import { useState } from "react";
import { Link } from "react-router-dom";
import { authClient } from "../lib/auth-client";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      register(formData.name, formData.email, formData.password);
    } finally {
      setIsLoading(false)
    }
  };

  async function register(name, email, password) {
  const { error } = await authClient.signUp.email({
    name,
    email,
    password
  });

  if (error) {
    setError(error.message);
    return;
  }

}

  return (
    <main className="auth-page register-page">
      <section className="auth-card">
        <Link to="/" className="auth-logo">
          THE BOOK NOOK
        </Link>

        <div className="auth-heading">
          <span className="auth-eyebrow">BEGIN YOUR STORY</span>
          <h1>Your next chapter starts here.</h1>
          <p>
            Create an account and find books worth getting lost in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

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
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <div className="auth-divider">
          <span>EVERY GREAT STORY BEGINS SOMEWHERE</span>
        </div>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to the bookstore
        </Link>
      </section>

      <aside className="auth-quote">
        <span className="quote-mark">“</span>
        <blockquote>
          We read to know we are not alone.
        </blockquote>
        <p>— C. S. Lewis</p>
        <div className="quote-decoration">✳</div>
      </aside>
    </main>
  );
}

export default Register;