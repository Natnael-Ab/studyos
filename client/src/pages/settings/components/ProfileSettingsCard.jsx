import { useState } from "react";
import { Badge, Button, Input, SectionHeader, Select, Surface } from "../../../components/ui";
import { useWorkspaceAccess } from "../../../hooks/useWorkspaceAccess";

const goalOptions = [
  { value: "university", label: "University" },
  { value: "high-school", label: "High school" },
  { value: "course", label: "Course" },
  { value: "exam-prep", label: "Exam prep" },
  { value: "self-study", label: "Self-study" }
];

const studyModeOptions = [
  { value: "balanced", label: "Balanced" },
  { value: "deep-work", label: "Deep work" },
  { value: "flexible", label: "Flexible" }
];

function ProfileSettingsCard() {
  const { profile, updateProfile } = useWorkspaceAccess();
  const [subjectDraft, setSubjectDraft] = useState("");

  function updateField(field, value) {
    updateProfile({ [field]: value });
  }

  function handleNumberField(field, value) {
    if (value === "") {
      return;
    }

    updateProfile({ [field]: Number(value) });
  }

  function addSubject(value = subjectDraft) {
    const nextSubject = value.trim();

    if (!nextSubject) {
      return;
    }

    const nextSubjects = [...profile.subjects, nextSubject].filter(Boolean);
    updateProfile({ subjects: nextSubjects });
    setSubjectDraft("");
  }

  function removeSubject(subjectName) {
    updateProfile({
      subjects: profile.subjects.filter((item) => item !== subjectName)
    });
  }

  return (
    <Surface className="settings-card">
      <SectionHeader
        eyebrow="Profile"
        title="Student profile"
        description="Update your academic identity, study rhythm, and subject list."
        action={<Badge tone="neutral">Saved automatically</Badge>}
      />

      <div className="profile-field-grid">
        <Input
          label="Full name"
          value={profile.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />

        <Input
          label="Email"
          value={profile.email}
          readOnly
          placeholder="Managed by sign-in"
        />

        <Select
          label="Goal type"
          value={profile.goalType}
          onChange={(event) => updateField("goalType", event.target.value)}
        >
          {goalOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Input
          label="Term name"
          value={profile.termName}
          onChange={(event) => updateField("termName", event.target.value)}
          placeholder="Current term"
        />

        <Input
          label="Weekly study hours"
          type="number"
          min="1"
          step="1"
          value={profile.weeklyStudyHours}
          onChange={(event) => handleNumberField("weeklyStudyHours", event.target.value)}
        />

        <Input
          label="Session length"
          type="number"
          min="15"
          step="5"
          value={profile.sessionLength}
          onChange={(event) => handleNumberField("sessionLength", event.target.value)}
        />

        <Select
          label="Study mode"
          value={profile.studyMode}
          onChange={(event) => updateField("studyMode", event.target.value)}
        >
          {studyModeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="subject-editor">
        <div className="subject-editor__actions">
          <Input
            label="Add subject"
            value={subjectDraft}
            onChange={(event) => setSubjectDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addSubject();
              }
            }}
            placeholder="Type a subject"
          />

          <div className="subject-editor__button">
            <Button type="button" variant="ghost" onClick={() => addSubject()}>
              Add subject
            </Button>
          </div>
        </div>

        <div className="subject-chip-list">
          {profile.subjects.length > 0 ? (
            profile.subjects.map((subject) => (
              <button
                key={subject}
                type="button"
                className="subject-chip-list__item"
                onClick={() => removeSubject(subject)}
              >
                {subject}
              </button>
            ))
          ) : (
            <span className="subject-chip-list__empty">No subjects added yet.</span>
          )}
        </div>
      </div>
    </Surface>
  );
}

export default ProfileSettingsCard;