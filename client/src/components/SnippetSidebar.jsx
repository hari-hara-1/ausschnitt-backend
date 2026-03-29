import { AnimatePresence, motion } from "framer-motion";
import { FileCode2, Plus, Trash2 } from "lucide-react";

function formatDate(value) {
  if (!value) return "No activity yet";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SnippetSidebar({
  snippets,
  selectedSnippetId,
  onSelect,
  onCreate,
  onDelete,
  loading,
}) {
  return (
    <section className="sidebar panel">
      <div className="sidebar-header">
        <div>
          <p className="eyebrow">Snippet arsenal</p>
          <h2>Loadout</h2>
        </div>

        <motion.button
          className="icon-button"
          type="button"
          onClick={onCreate}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          title="Create snippet"
        >
          <Plus size={18} />
        </motion.button>
      </div>

      <div className="snippet-list">
        <AnimatePresence mode="popLayout">
          {snippets.map((snippet) => (
            <motion.button
              key={snippet.id}
              className={
                snippet.id === selectedSnippetId
                  ? "snippet-card active"
                  : "snippet-card"
              }
              type="button"
              onClick={() => onSelect(snippet.id)}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="snippet-card-main">
                <FileCode2 size={18} />
                <div>
                  <strong>{snippet.title || "Untitled Snippet"}</strong>
                  <p>{formatDate(snippet.updatedAt)}</p>
                </div>
              </div>

              <motion.span
                className="delete-chip"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(snippet.id);
                }}
                whileHover={{ scale: 1.04 }}
              >
                <Trash2 size={14} />
              </motion.span>
            </motion.button>
          ))}
        </AnimatePresence>

        {!snippets.length && !loading ? (
          <div className="empty-state">
            <p>No snippets yet.</p>
            <span>Open a floating editor and create your first one.</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
