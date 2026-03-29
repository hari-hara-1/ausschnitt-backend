import { motion } from "framer-motion";
import { LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { SnippetSidebar } from "../components/SnippetSidebar";

export function Dashboard({
  snippets,
  selectedSnippet,
  onOpenEditor,
  onSelectSnippet,
  onCreateSnippet,
  onDeleteSnippet,
  loading,
  status,
  onLogout,
}) {
  return (
    <motion.main
      className="dashboard-shell"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <section className="hero-band panel">
        <div className="hero-band-copy">
          <p className="eyebrow">Republic-grade code storage</p>
          <h1>Forge snippets in a floating tactical editor.</h1>
          <p>
            A black-metal workspace with motion-rich transitions, quick snippet
            recall, and a dark Monaco surface tuned for intense coding sessions.
          </p>

          <div className="hero-actions">
            <motion.button
              className="primary-button"
              type="button"
              onClick={onCreateSnippet}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles size={16} />
              New Snippet
            </motion.button>

            <button className="ghost-button" type="button" onClick={onOpenEditor}>
              Open Floating Editor
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <ShieldCheck size={18} />
            <strong>{snippets.length}</strong>
            <span>Stored snippets</span>
          </div>

          <button className="ghost-button logout-button" type="button" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </section>

      <section className="content-grid">
        <SnippetSidebar
          snippets={snippets}
          selectedSnippetId={selectedSnippet?.id ?? null}
          onSelect={onSelectSnippet}
          onCreate={onCreateSnippet}
          onDelete={onDeleteSnippet}
          loading={loading}
        />

        <section className="preview panel">
          <div className="preview-header">
            <div>
              <p className="eyebrow">Live preview</p>
              <h2>{selectedSnippet?.title || "No snippet selected"}</h2>
            </div>
            <button className="ghost-button" type="button" onClick={onOpenEditor}>
              Edit
            </button>
          </div>

          {selectedSnippet ? (
            <>
              <div className="preview-tags">
                <span>{selectedSnippet.language || "plain text"}</span>
                <span>
                  Updated{" "}
                  {selectedSnippet.updatedAt
                    ? new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(selectedSnippet.updatedAt))
                    : "just now"}
                </span>
              </div>

              <pre className="code-preview">
                <code>{selectedSnippet.code || "// No code yet"}</code>
              </pre>

              <div className="notes-preview">
                <h3>Notes</h3>
                <p>{selectedSnippet.notes || "No notes attached to this snippet yet."}</p>
              </div>
            </>
          ) : (
            <div className="empty-state large">
              <p>No active snippet.</p>
              <span>Create one to open the floating editor and start storing code.</span>
            </div>
          )}

          {status ? <p className="status neutral">{status}</p> : null}
        </section>
      </section>
    </motion.main>
  );
}
