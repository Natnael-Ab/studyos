import { useMemo } from "react";
import { Badge, Button, SectionHeader, Surface } from "../../../components/ui";
import { buildLibraryCsv, buildLibraryExportPayload } from "../../../domain/library";
import { useStudyData } from "../../../hooks/useStudyData";
import { useWorkspaceAccess } from "../../../hooks/useWorkspaceAccess";
import { useWorkspaceLibrary } from "../../../hooks/useWorkspaceLibrary";
import { useWorkspaceSettings } from "../../../hooks/useWorkspaceSettings";

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
}

function ExportPanel() {
  const { profile } = useWorkspaceAccess();
  const { settings } = useWorkspaceSettings();
  const { tasks, studySessions, exams, subjects } = useStudyData();
  const { notes, resources, attachments } = useWorkspaceLibrary();

  const payload = useMemo(
    () =>
      buildLibraryExportPayload({
        profile,
        settings,
        tasks,
        studySessions,
        exams,
        subjects,
        notes,
        resources,
        attachments
      }),
    [attachments, exams, notes, profile, resources, settings, studySessions, subjects, tasks]
  );

  const csv = useMemo(() => buildLibraryCsv(payload), [payload]);
  const exportDate = new Date(payload.exportedAt).toLocaleString();

  function handleJsonExport() {
    const fileDate = payload.exportedAt.slice(0, 10);
    downloadTextFile(
      `studyos-library-${fileDate}.json`,
      JSON.stringify(payload, null, 2),
      "application/json;charset=utf-8"
    );
  }

  function handleCsvExport() {
    const fileDate = payload.exportedAt.slice(0, 10);
    downloadTextFile(
      `studyos-library-${fileDate}.csv`,
      csv,
      "text/csv;charset=utf-8"
    );
  }

  return (
    <Surface className="library-panel library-export">
      <SectionHeader
        eyebrow="Export"
        title="Portable workspace snapshot"
        description="Download a clean JSON or CSV snapshot for demos, backups, or future sync."
        action={<Badge tone="accent">Export ready</Badge>}
      />

      <div className="library-export__meta">
        <div className="library-export__meta-row">
          <span>Built</span>
          <strong>{exportDate}</strong>
        </div>
        <div className="library-export__meta-row">
          <span>Total items</span>
          <strong>{payload.summary.totalItems}</strong>
        </div>
        <div className="library-export__meta-row">
          <span>Linked items</span>
          <strong>{payload.summary.linkedItems}</strong>
        </div>
      </div>

      <div className="library-export__summary">
        <p className="library-export__text">
          The export includes profile details, settings, notes, resources,
          attachment records, tasks, sessions, and exams.
        </p>
      </div>

      <div className="library-export__actions">
        <Button type="button" variant="primary" onClick={handleJsonExport}>
          Download JSON
        </Button>
        <Button type="button" variant="ghost" onClick={handleCsvExport}>
          Download CSV
        </Button>
      </div>
    </Surface>
  );
}

export default ExportPanel;