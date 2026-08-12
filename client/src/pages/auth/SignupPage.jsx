import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Surface
} from "../../components/ui";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";
import AuthPasswordField from "./components/AuthPasswordField";

function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useWorkspaceAccess();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
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
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      setError(
        "Complete the required fields to continue."
      );
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Use at least 8 characters for your password."
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "The passwords do not match."
      );
      return;
    }

    setError("");

    const nextRoute = signUp({
      fullName: form.fullName,
      email: form.email,
      password: form.password
    });

    navigate(nextRoute);
  }

  return (
    <Surface className="auth-card">
      <div className="auth-card__eyebrow">
        <span className="auth-shell__eyebrow">
          Create your workspace
        </span>

        <span className="auth-card__step-label">
          1 of 2
        </span>
      </div>

      <div className="auth-card__title-group">
        <h2 className="auth-card__title">
          Make study feel simpler from day one.
        </h2>

        <p className="auth-card__description">
          Create your account first. We will then verify
          your email and tailor the workspace around your
          study rhythm.
        </p>
      </div>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <Input
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Your name"
          autoComplete="name"
          autoFocus
          required
        />

        <Input
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <AuthPasswordField
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Create a password"
          autoComplete="new-password"
          hint="At least 8 characters."
          required
        />

        <AuthPasswordField
          label="Confirm password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your password"
          autoComplete="new-password"
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
            One account. One academic workspace.
          </span>

          <Link to="/login">
            Already have an account?
          </Link>
        </div>

        <div className="auth-form__footer">
          <Button
            type="submit"
            variant="primary"
            size="lg"
          >
            Create account
            <span aria-hidden="true">
              ↗
            </span>
          </Button>
        </div>
      </form>
    </Surface>
  );
}

export default SignupPage;