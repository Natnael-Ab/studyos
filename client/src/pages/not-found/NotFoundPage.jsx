import { Badge, Button, Surface } from "../../components/ui";

function NotFoundPage() {
  return (
    <section className="page not-found-page">
      <Surface className="not-found-card">
        <Badge tone="neutral">404</Badge>
        <h1 className="page__title">This page does not exist.</h1>
        <p className="page__text not-found-card__text">
          The link may be outdated, mistyped, or no longer available.
        </p>

        <div className="not-found-card__actions">
          <Button to="/" variant="ghost">
            Go home
          </Button>
          <Button to="/dashboard" variant="primary">
            Open workspace
          </Button>
        </div>
      </Surface>
    </section>
  );
}

export default NotFoundPage;