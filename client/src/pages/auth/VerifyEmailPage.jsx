import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Surface
} from "../../components/ui";
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
    const response =
      requestVerificationEmail();

    setMessage(response.message);
  }

  function handleContinue() {
    const nextRoute =
      markEmailVerified();

    navigate(nextRoute);
  }

  return (
    <Surface className="auth-card">
      <div className="auth-card__eyebrow">
        <span className="auth-shell__eyebrow">
          One final step
        </span>

        <span className="auth-card__step-label">
          Email verification
        </span>
      </div>

      <div className="auth-verification">
        <div
          className="auth-verification__mark"
          aria-hidden="true"
        >
          @
        </div>

        <div className="auth-card__title-group">
          <h2 className="auth-card__title">
            Confirm your access and keep moving.
          </h2>

          <p className="auth-verification__description">
            We prepared a verification message for your
            inbox. Confirm it, then we will take you
            straight into your workspace setup.
          </p>
        </div>

        <span className="auth-verification__email">
          {profile.email || "your inbox"}
        </span>
      </div>

      {message ? (
        <div
          className="auth-form__notice"
          role="status"
        >
          {message}
        </div>
      ) : null}

      <div className="auth-card__actions">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={handleResend}
        >
          Resend email
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleContinue}
        >
          I verified my email
          <span aria-hidden="true">
            ↗
          </span>
        </Button>
      </div>

      <div className="auth-form__links">
        <Link to="/login">
          Use another account
        </Link>
      </div>
    </Surface>
  );
}

export default VerifyEmailPage;