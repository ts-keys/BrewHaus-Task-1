import { useState } from "react";
import { Link } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import "../auth.css"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
    login(formData.email, formData.password)
  };

  async function login(email, password) {
  const { data, error } = await authClient.signIn.email({
    email,
    password
  });

  if (error) {
    console.error("Login failed:", error.message);
    return;
  }

  console.log("Login successful:", data);
}

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-logo">
          THE BOOK NOOK
        </Link>

        <div className="auth-heading">
          <span className="auth-eyebrow">WELCOME BACK</span>
          <h1>Good to see you again.</h1>
          <p>
            Sign in to discover your next favourite read.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit">
            Sign In <span aria-hidden="true">→</span>
          </button>
        </form>

        <div className="auth-divider">
          <span>YOUR NEXT CHAPTER AWAITS</span>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to the bookstore
        </Link>
      </section>

      <aside className="auth-quote">
        <span className="quote-mark">“</span>
        <blockquote>
          A reader lives a thousand lives before he dies.
        </blockquote>
        <p>— George R. R. Martin</p>
        <div className="quote-decoration">✳</div>
      </aside>
    </main>
  );
}
