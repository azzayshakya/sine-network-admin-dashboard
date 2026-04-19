import { publicAPI } from "@/apis/axiosInstance";
import { useState } from "react";
import "./login.css";
import { useAuth } from "@/context/authContext";
import { useNavigate } from "react-router-dom";
const loginUser = async (data) => {
  const res = await publicAPI.post("/auth/login", data);
  return res.data;
};

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const LockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.0 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14v2.92z" />
  </svg>
);

export default function LoginPage() {
  const [mode, setMode] = useState("email"); // "email" | "phone"
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null); // user object
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const payload =
      mode === "email"
        ? { email: identifier, password }
        : { phone: identifier, password };

    setLoading(true);
    try {
      const data = await loginUser(payload);

      // ✅ Save via context
      login(data, true);

      setSuccess(data.user);
      navigate("/home");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    }
  };

  return (
    <>
      {/* <style>{styles}</style> */}
      <div className="login-root">
        {/* Right panel */}
        <div className="right-panel">
          <div className="form-container">
            {success ? (
              <div className="success-state">
                <div className="success-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="success-name">
                  Welcome back, {success.name?.split(" ")[0]}!
                </p>
                <p className="success-msg">
                  You are signed in as {success.email}.
                </p>
              </div>
            ) : (
              <>
                <p className="form-eyebrow">Welcome back</p>
                <h2 className="form-title">Sign in</h2>
                <p className="form-subtitle">Good to see you again.</p>

                {/* Mode toggle */}
                <div className="tab-row">
                  <button
                    type="button"
                    className={`tab-btn ${mode === "email" ? "active" : ""}`}
                    onClick={() => {
                      setMode("email");
                      setIdentifier("");
                      setError("");
                    }}
                  >
                    <UserIcon /> Email
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${mode === "phone" ? "active" : ""}`}
                    onClick={() => {
                      setMode("phone");
                      setIdentifier("");
                      setError("");
                    }}
                  >
                    <PhoneIcon /> Phone
                  </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Identifier */}
                  <div className="field" key={mode}>
                    <label className="field-label">
                      {mode === "email" ? "Email address" : "Phone number"}
                    </label>
                    <div className="input-wrap">
                      <input
                        className="field-input"
                        type={mode === "email" ? "email" : "tel"}
                        placeholder={
                          mode === "email"
                            ? "you@example.com"
                            : "+91 00000 00000"
                        }
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        autoComplete={mode === "email" ? "email" : "tel"}
                      />
                      <span className="input-icon">
                        {mode === "email" ? <UserIcon /> : <PhoneIcon />}
                      </span>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="field">
                    <label className="field-label">Password</label>
                    <div className="input-wrap">
                      <input
                        className="field-input"
                        type={showPw ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <span className="input-icon">
                        <LockIcon />
                      </span>
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowPw((v) => !v)}
                        tabIndex={-1}
                      >
                        <EyeIcon open={showPw} />
                      </button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="options-row">
                    <label className="remember-label">
                      <input
                        type="checkbox"
                        className="remember-check"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />
                      Remember me
                    </label>
                    <a href="#" className="forgot-link">
                      Forgot password?
                    </a>
                  </div>

                  {/* Error */}
                  {error && <div className="error-msg">{error}</div>}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    <span className="btn-inner">
                      {loading && <span className="spinner" />}
                      {loading ? "Signing in…" : "Sign in"}
                    </span>
                  </button>
                </form>

                <div className="divider">
                  <div className="divider-line" />
                  <span className="divider-text">Do not have an account?</span>
                  <div className="divider-line" />
                </div>

                <p className="signup-row">
                  <a href="#" className="signup-link">
                    Create a free account →
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
