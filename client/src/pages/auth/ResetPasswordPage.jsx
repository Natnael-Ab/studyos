import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Input, SectionHeader, Surface } from "../../components/ui";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";

function ResetPasswordPage() {
  const { requestPasswordReset, profile } = useWorkspaceAccess();
  const [email, setEmail] = useState(profile.email || "");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Enter the email address linked to your StudyOS account.");
      return;
    }

    const response = requestPasswordReset(email);
    setMessage(response.message);
  }

  return (
    <Surface className="auth-card">
      <Badge tone="accent">Password recovery</Badge>
      <SectionHeader
        title="Reset your password."
        description="Prepare a secure recovery flow and continue back into the workspace."
      />

      <form className="auth-form" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        {message ? <div className="auth-form__notice">{message}</div> : null}

        <div className="auth-form__footer">
          <Button type="submit" variant="primary">
            Send reset link
          </Button>

          <div className="auth-form__links">
            <Link to="/login">Back to sign in</Link>
          </div>
        </div>
      </form>
    </Surface>
  );
}

export default ResetPasswordPage;