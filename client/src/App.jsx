import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AuthPanel } from "./components/AuthPanel";
import { EditorWindow } from "./components/EditorWindow";
import { Dashboard } from "./pages/Dashboard";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import {
  createSnippet,
  deleteSnippet,
  fetchSnippetById,
  fetchSnippets,
  loginUser,
  registerUser,
  updateSnippet,
} from "./lib/api";

const EMPTY_SNIPPET = {
  id: null,
  title: "",
  language: "javascript",
  code: "// Initialize your snippet here\n",
  notes: "",
  updatedAt: null,
};

export default function App() {
  const [mode, setMode] = useState("login");
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [token, setToken] = useLocalStorageState("ausschnitt-token", "");
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [draftSnippet, setDraftSnippet] = useState(EMPTY_SNIPPET);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function loadSnippets() {
      setLoading(true);
      setStatus("");

      try {
        const records = await fetchSnippets(token);
        if (cancelled) return;

        setSnippets(records);

        if (records.length) {
          const fullRecord = await fetchSnippetById(records[0].id, token);
          if (cancelled) return;
          setSelectedSnippet(fullRecord);
          setDraftSnippet(fullRecord);
        } else {
          setSelectedSnippet(null);
          setDraftSnippet(EMPTY_SNIPPET);
        }
      } catch (error) {
        if (cancelled) return;
        setStatus(
          `Snippet sync failed: ${error.message}. The current backend auth middleware appears to reject protected requests, so the UI is ready but live snippet operations may stay blocked until that server issue is corrected.`,
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSnippets();

    return () => {
      cancelled = true;
    };
  }, [token]);

  function handleAuthChange(event) {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  }

  function handleSnippetChange(event) {
    const { name, value } = event.target;
    setDraftSnippet((current) => ({ ...current, [name]: value }));
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      if (mode === "register") {
        await registerUser(authForm);
        setMode("login");
        setAuthError("Account created. Sign in to enter the vault.");
      } else {
        const payload = await loginUser(authForm);
        setToken(payload.token);
        setAuthForm({ username: "", password: "" });
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSelectSnippet(snippetId) {
    if (!token) return;

    try {
      const payload = await fetchSnippetById(snippetId, token);
      setSelectedSnippet(payload);
      setDraftSnippet(payload);
    } catch (error) {
      setStatus(`Unable to load snippet: ${error.message}`);
    }
  }

  function handleCreateSnippet() {
    setDraftSnippet(EMPTY_SNIPPET);
    setEditorOpen(true);
  }

  async function handleSaveSnippet() {
    if (!token) return;

    setSaving(true);
    setStatus("");

    try {
      const payload = draftSnippet.id
        ? await updateSnippet(draftSnippet.id, draftSnippet, token)
        : await createSnippet(draftSnippet, token);

      if (!draftSnippet.id && payload?.id) {
        setSelectedSnippet(payload);
        setDraftSnippet(payload);
      }

      const records = await fetchSnippets(token);
      setSnippets(records);

      if (draftSnippet.id) {
        const refreshed = await fetchSnippetById(draftSnippet.id, token);
        setSelectedSnippet(refreshed);
        setDraftSnippet(refreshed);
      } else if (payload?.id) {
        setSelectedSnippet(payload);
      }

      setEditorOpen(false);
      setStatus("Snippet saved.");
    } catch (error) {
      setStatus(`Save failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSnippet(snippetId) {
    if (!token) return;

    try {
      await deleteSnippet(snippetId, token);
      const records = await fetchSnippets(token);
      setSnippets(records);

      if (!records.length) {
        setSelectedSnippet(null);
        setDraftSnippet(EMPTY_SNIPPET);
      } else {
        await handleSelectSnippet(records[0].id);
      }
    } catch (error) {
      setStatus(`Delete failed: ${error.message}`);
    }
  }

  function openSelectedSnippet() {
    if (selectedSnippet) {
      setDraftSnippet(selectedSnippet);
    }

    setEditorOpen(true);
  }

  function handleLogout() {
    setToken("");
    setSnippets([]);
    setSelectedSnippet(null);
    setDraftSnippet(EMPTY_SNIPPET);
    setEditorOpen(false);
    setStatus("");
  }

  return (
    <div className="app-shell">
      <div className="ambient-grid" />
      <div className="ambient-brush" />
      <div className="ambient-diagonal" />

      <AnimatePresence mode="wait">
        {!token ? (
          <AuthPanel
            key="auth"
            mode={mode}
            form={authForm}
            onChange={handleAuthChange}
            onSubmit={handleAuthSubmit}
            onModeChange={setMode}
            loading={authLoading}
            error={authError}
          />
        ) : (
          <Dashboard
            key="dashboard"
            snippets={snippets}
            selectedSnippet={selectedSnippet}
            onOpenEditor={openSelectedSnippet}
            onSelectSnippet={handleSelectSnippet}
            onCreateSnippet={handleCreateSnippet}
            onDeleteSnippet={handleDeleteSnippet}
            loading={loading}
            status={status}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      <EditorWindow
        open={editorOpen}
        snippet={draftSnippet}
        saving={saving}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveSnippet}
        onChange={handleSnippetChange}
      />
    </div>
  );
}
