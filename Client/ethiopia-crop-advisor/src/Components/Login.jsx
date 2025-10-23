import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../Auth.css";

const Login = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      // Login successful - AppContent will automatically show ChatApp
    } else {
      setError(result.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🌾</span>
          <h2>Ethiopia Crop Advisor</h2>
          <p className="auth-subtitle">
            Sign in to access agricultural intelligence
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account?{" "}
          <button onClick={onSwitchToRegister} className="link-button">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
