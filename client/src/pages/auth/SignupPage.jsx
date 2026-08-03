import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Input, SectionHeader, Surface } from "../../components/ui";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";

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
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Complete all required fields.");
      return;
    }

    if (form.password.length < 8) {
      setError("Use at least 8 characters for the password.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
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
      <Badge tone="accent">Create workspace</Badge>
      <SectionHeader
        title="Set up your StudyOS account."
        description="Create your access, verify your email, then finish the setup wizard."
      />

      <form className="auth-form" onSubmit={handleSubmit}>
        <Input
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Your name"
          autoComplete="name"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
        />

        {error ? <div className="auth-form__error">{error}</div> : null}

        <div className="auth-form__footer">
          <Button type="submit" variant="primary">
            Create account
          </Button>

          <div className="auth-form__links">
            <Link to="/login">Already have an account</Link>
          </div>
        </div>
      </form>
    </Surface>
  );
}

export default SignupPage;