import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2, Save, X } from "lucide-react";

const MONOKAI_RAMPART = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "6F7377" },
    { token: "keyword", foreground: "F92672" },
    { token: "number", foreground: "AE81FF" },
    { token: "string", foreground: "E6DB74" },
    { token: "regexp", foreground: "FD971F" },
    { token: "delimiter", foreground: "F8F8F2" },
    { token: "type.identifier", foreground: "66D9EF" },
    { token: "identifier", foreground: "F8F8F2" },
    { token: "operator", foreground: "F92672" },
    { token: "predefined", foreground: "A6E22E" },
  ],
  colors: {
    "editor.background": "#111315",
    "editor.foreground": "#F8F8F2",
    "editorLineNumber.foreground": "#4C5055",
    "editorLineNumber.activeForeground": "#B9BDC2",
    "editorCursor.foreground": "#FF2A2A",
    "editor.selectionBackground": "#8A101066",
    "editor.inactiveSelectionBackground": "#5510104D",
    "editorIndentGuide.background1": "#202325",
    "editorIndentGuide.activeBackground1": "#7A1111",
    "editor.lineHighlightBackground": "#1A1D20",
  },
};

export function EditorWindow({
  open,
  snippet,
  saving,
  onClose,
  onSave,
  onChange,
}) {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!open) {
      setMaximized(false);
    }
  }, [open]);

  function handleEditorMount(monaco) {
    monaco.editor.defineTheme("monokai-rampart", MONOKAI_RAMPART);
    monaco.editor.setTheme("monokai-rampart");
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="window-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.section
            className={maximized ? "editor-window maximized" : "editor-window"}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="editor-header">
              <div>
                <p className="eyebrow">Floating editor</p>
                <h3>{snippet.title || "Untitled Snippet"}</h3>
              </div>

              <div className="editor-actions">
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => setMaximized((value) => !value)}
                  title={maximized ? "Restore" : "Maximize"}
                >
                  {maximized ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
                </button>

                <button className="icon-button" type="button" onClick={onClose} title="Close">
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="editor-meta-grid">
              <label>
                Title
                <input
                  name="title"
                  value={snippet.title}
                  onChange={onChange}
                  placeholder="Snippet title"
                />
              </label>

              <label>
                Language
                <input
                  name="language"
                  value={snippet.language}
                  onChange={onChange}
                  placeholder="javascript"
                />
              </label>
            </div>

            <div className="monaco-shell">
              <Editor
                height="100%"
                language={snippet.language || "javascript"}
                value={snippet.code}
                beforeMount={handleEditorMount}
                onChange={(value) =>
                  onChange({
                    target: {
                      name: "code",
                      value: value ?? "",
                    },
                  })
                }
                options={{
                  fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                  fontSize: 15,
                  minimap: { enabled: false },
                  smoothScrolling: true,
                  cursorSmoothCaretAnimation: "on",
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 18, bottom: 18 },
                }}
                theme="monokai-rampart"
              />
            </div>

            <label className="notes-field">
              Notes
              <textarea
                name="notes"
                value={snippet.notes}
                onChange={onChange}
                placeholder="Context, references, edge-cases..."
              />
            </label>

            <div className="editor-footer">
              <span className="subtle-copy">
                Syntax highlighting is enabled through Monaco with a custom
                Monokai-inspired theme.
              </span>

              <motion.button
                className="primary-button"
                type="button"
                onClick={onSave}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={saving}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Snippet"}
              </motion.button>
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
