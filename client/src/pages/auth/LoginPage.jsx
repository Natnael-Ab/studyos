import { Badge, Button, Input, SectionHeader, Surface } from "../../components/ui";

function LoginPage() {
  return (
    <section className="page auth-page">
      <Surface className="auth-card">
        <Badge tone="accent">Secure access</Badge>
        <SectionHeader
          title="Welcome back."
          description="Sign in to continue your study workflow and keep everything in one calm workspace."
        />

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