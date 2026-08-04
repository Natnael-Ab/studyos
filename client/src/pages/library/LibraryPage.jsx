import { useMemo } from "react";
import { buildLibrarySummary } from "../../domain/library";
import { useWorkspaceLibrary } from "../../hooks/useWorkspaceLibrary";
import LibraryHero from "./components/LibraryHero";
import NotesPanel from "./components/NotesPanel";
import ResourcesPanel from "./components/ResourcesPanel";
import AttachmentsPanel from "./components/AttachmentsPanel";
import ExportPanel from "./components/ExportPanel";

function LibraryPage() {
  const { notes, resources, attachments } = useWorkspaceLibrary();

  const summary = useMemo(
    () => buildLibrarySummary({ notes, resources, attachments }),
    [attachments, notes, resources]
  );

  const summaryCards = useMemo(
    () => [
      {
        label: "Notes",
        value: String(summary.notes),
        detail: "Study writing"
      },
      {
        label: "Resources",
        value: String(summary.resources),
        detail: "Reference links"
      },
      {
        label: "Attachments",
        value: String(summary.attachments),
        detail: "Record entries"
      },
      {
        label: "Linked items",
        value: String(summary.linkedItems),
        detail: "Connected to the workspace"
      }
    ],
    [summary.attachments, summary.linkedItems, summary.notes, summary.resources]
  );

  return (
    <section className="page library-page">
      <LibraryHero summary={summary} />

      <div className="library-summary-grid">
        {summaryCards.map((card) => (
          <article key={card.label} className="library-summary-card">
            <span className="library-summary-card__label">{card.label}</span>
            <strong className="library-summary-card__value">{card.value}</strong>
            <p className="library-summary-card__detail">{card.detail}</p>
          </article>
        ))}
      </div>

      <div className="library-layout">
        <div className="library-main">
          <NotesPanel />
          <ResourcesPanel />
        </div>

        <aside className="library-side">
          <AttachmentsPanel />
          <ExportPanel />
        </aside>
      </div>
    </section>
  );
}

export default LibraryPage;