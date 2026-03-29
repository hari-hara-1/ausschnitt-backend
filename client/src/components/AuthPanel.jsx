import { motion } from "framer-motion";

const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

export function AuthPanel({
  mode,
  form,
  onChange,
  onSubmit,
  onModeChange,
  loading,
  error,
}) {
  const isLogin = mode === "login";

  return (
    <motion.section
      className="auth-panel panel"
      initial={{ opacity: 0, x: -36, y: 30 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={transition}
    >
      <div className="panel-glow" />
      <p className="eyebrow">Encrypted access node</p>
      <h1 className="hero-title">Ausschnitt</h1>
      <p className="hero-copy">
        Store sharp, searchable code fragments inside a combat-styled vault with
        fast access and a floating editor surface.
      </p>

      <div className="auth-tabs">
        <button
          className={isLogin ? "tab active" : "tab"}
          onClick={() => onModeChange("login")}
          type="button"
        >
          Login
        </button>
        <button
          className={!isLogin ? "tab active" : "tab"}
          onClick={() => onModeChange("register")}
          type="button"
        >
          Register
        </button>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            placeholder="rog_operator"
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </label>

        <motion.button
          className="primary-button"
          type="submit"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? "Processing..." : isLogin ? "Enter Vault" : "Create Account"}
        </motion.button>

        {error ? <p className="status error">{error}</p> : null}
      </form>
    </motion.section>
  );
}
