import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, SectionHeader, Surface } from "../../components/ui";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const {
    profile,
    requestVerificationEmail,
    markEmailVerified
  } = useWorkspaceAccess();
  const [message, setMessage] = useState("");

  function handleResend() {
    const response = requestVerificationEmail();
    setMessage(response.message);
  }

  function handleContinue() {
    const nextRoute = markEmailVerified();
    navigate(nextRoute);
  }

  return (
    <Surface className="auth-card">
      <Badge tone="accent">Email verification</Badge>
      <SectionHeader
        title="Verify your email."
        description={`We sent access details to ${profile.email || "your inbox"}. Confirm it to continue.`}
      />

      <div className="auth-form">
        {message ? <div className="auth-form__notice">{message}</div> : null}

        <div className="auth-card__actions">
          <Button type="button" variant="ghost" onClick={handleResend}>
            Resend verification
          </Button>
          <Button type="button" variant="primary" onClick={handleContinue}>
            I verified my email
          </Button>
        </div>

        <div className="auth-form__links">
          <Link to="/login">Use another account</Link>
        </div>
      </div>
    </Surface>
  );
}

export default VerifyEmailPage;