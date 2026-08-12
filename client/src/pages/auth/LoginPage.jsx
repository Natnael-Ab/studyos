import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Surface
} from "../../components/ui";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";
import AuthPasswordField from "./components/AuthPasswordField";

function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useWorkspaceAccess();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const {
      name,
      value
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.email.trim() ||
      !form.password.trim()
    ) {
      setError(
        "Enter your email and password to continue."
      );
      return;
    }

    setError("");

    const nextRoute = signIn({
      email: form.email,
      password: form.password
    });

    navigate(nextRoute);
  }

  return (
    <Surface className="auth-card">
      <div className="auth-card__eyebrow">
        <span className="auth-shell__eyebrow">
          Welcome back
        </span>

        <span className="auth-card__step-label">
          StudyOS account
        </span>
      </div>

      <div className="auth-card__title-group">
        <h2 className="auth-card__title">
          Return to your rhythm.
        </h2>

        <p className="auth-card__description">
          Sign in and continue from exactly where you
          left off.
        </p>
      </div>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <Input
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
          required
        />

        <AuthPasswordField
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          hint="Use the password associated with your StudyOS account."
          required
        />

        {error ? (
          <div
            className="auth-form__error"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <div className="auth-card__form-note">
          <span>
            Secure access to your workspace.
          </span>

          <Link to="/reset-password">
            Forgot password?
          </Link>
        </div>

        <div className="auth-form__footer">
          <Button
            type="submit"
            variant="primary"
            size="lg"
          >
            Sign in
            <span aria-hidden="true">
              ↗
            </span>
          </Button>

          <div className="auth-form__links">
            <span>New to StudyOS?</span>

            <Link to="/signup">
              Create your workspace
            </Link>
          </div>
        </div>
      </form>
    </Surface>
  );
}

export default LoginPage;