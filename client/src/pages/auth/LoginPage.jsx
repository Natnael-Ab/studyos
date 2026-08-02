import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Surface from "../../components/ui/Surface";

function LoginPage() {
  return (
    <section className="page auth-page">
      <Surface className="auth-card">
        <Badge tone="accent">Secure access</Badge>
        <h1 className="page__title">Welcome back.</h1>
        <p className="page__text">
          Sign in to continue your study workflow and keep everything in one calm
          workspace.
        </p>

        <form className="form-grid">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          <Button type="submit" variant="primary">
            Sign in
          </Button>
        </form>
      </Surface>
    </section>
  );
}

export default LoginPage;