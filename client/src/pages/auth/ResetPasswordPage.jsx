import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Input,
  Surface
} from "../../components/ui";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";

function ResetPasswordPage() {
  const {
    requestPasswordReset,
    profile
  } = useWorkspaceAccess();

  const [email, setEmail] = useState(
    profile.email || ""
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setError(
        "Enter the email linked to your StudyOS account."
      );
      setMessage("");
      return;
    }

    setError("");

    const response =
      requestPasswordReset(email);

    setMessage(response.message);
  }

  return (
    <Surface className="auth-card">
      <div className="auth-card__eyebrow">
        <span className="auth-shell__eyebrow">
          Account recovery
        </span>

        <span className="auth-card__step-label">
          Secure reset
        </span>
      </div>

      <div className="auth-card__title-group">
        <h2 className="auth-card__title">
          Get back in without the friction.
        </h2>

        <p className="auth-card__description">
          Enter your account email and StudyOS will
          prepare the next recovery step.
        </p>
      </div>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
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

        {message ? (
          <div
            className="auth-form__notice"
            role="status"
          >
            {message}
          </div>
        ) : null}

        <div className="auth-form__footer">
          <Button
            type="submit"
            variant="primary"
            size="lg"
          >
            Send recovery link
            <span aria-hidden="true">
              ↗
            </span>
          </Button>

          <div className="auth-form__links">
            <Link to="/login">
              Return to sign in
            </Link>
          </div>
        </div>
      </form>
    </Surface>
  );
}

export default ResetPasswordPage;