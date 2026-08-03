import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Input,
  Progress,
  SectionHeader,
  Select,
  Surface
} from "../../components/ui";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";

const goalOptions = [
  {
    value: "university",
    label: "University",
    text: "Course-heavy planning with deadlines and revision."
  },
  {
    value: "high-school",
    label: "High school",
    text: "Balanced timetable with assignments and exams."
  },
  {
    value: "course",
    label: "Course",
    text: "Structured learning with milestones and study blocks."
  },
  {
    value: "exam-prep",
    label: "Exam prep",
    text: "Focused revision and readiness tracking."
  },
  {
    value: "self-study",
    label: "Self-study",
    text: "Flexible planning with personal study rhythm."
  }
];

const studyModeOptions = [
  { value: "balanced", label: "Balanced" },
  { value: "deep-work", label: "Deep work" },
  { value: "flexible", label: "Flexible" }
];

const themeOptions = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" }
];

const recommendedSubjects = [
  "Mathematics",
  "Biology",
  "Economics",
  "Design",
  "Computer Science",
  "History"
];

function OnboardingWizardPage() {
  const navigate = useNavigate();
  const { profile, completeOnboarding } = useWorkspaceAccess();
  const steps = useMemo(
    () => ["Profile", "Study plan", "Subjects", "Preferences"],
    []
  );

  const [step, setStep] = useState(0);
  const [subjectDraft, setSubjectDraft] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: profile.fullName || "",
    goalType: profile.goalType || "university",
    termName: profile.termName || "Current term",
    weeklyStudyHours: profile.weeklyStudyHours || 12,
    sessionLength: profile.sessionLength || 50,
    studyMode: profile.studyMode || "balanced",
    themeMode: profile.themeMode || "system",
    subjects: Array.isArray(profile.subjects) && profile.subjects.length > 0 ? profile.subjects : ["Mathematics"]
  });

  const progress = ((step + 1) / steps.length) * 100;
  const isLastStep = step === steps.length - 1;

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function addSubject(value) {
    const nextValue = `${value ?? subjectDraft}`.trim();

    if (!nextValue) {
      return;
    }

    setForm((current) => {
      if (current.subjects.includes(nextValue)) {
        return current;
      }

      return {
        ...current,
        subjects: [...current.subjects, nextValue]
      };
    });

    setSubjectDraft("");
  }

  function removeSubject(subjectName) {
    setForm((current) => ({
      ...current,
      subjects: current.subjects.filter((item) => item !== subjectName)
    }));
  }

  function handleNext(event) {
    event.preventDefault();

    if (step === 0 && !form.fullName.trim()) {
      setError("Add your name to continue.");
      return;
    }

    if (step === 2 && form.subjects.length === 0) {
      setError("Add at least one subject.");
      return;
    }

    if (isLastStep) {
      const nextRoute = completeOnboarding({
        fullName: form.fullName,
        goalType: form.goalType,
        termName: form.termName,
        weeklyStudyHours: form.weeklyStudyHours,
        sessionLength: form.sessionLength,
        studyMode: form.studyMode,
        themeMode: form.themeMode,
        subjects: form.subjects
      });

      navigate(nextRoute);
      return;
    }

    setError("");
    setStep((current) => current + 1);
  }

  function handleBack() {
    setError("");
    setStep((current) => Math.max(0, current - 1));
  }

  return (
    <Surface className="auth-card wizard">
      <Badge tone="accent">First launch setup</Badge>
      <SectionHeader
        title="Personalize your StudyOS workspace."
        description="A short setup helps the app feel tailored to your study rhythm."
      />

      <div className="wizard__progress">
        <Progress value={progress} label={`Step ${step + 1} of ${steps.length}`} />
        <div className="wizard__steps">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`wizard__step ${index === step ? "is-active" : ""}`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <form className="auth-form" onSubmit={handleNext}>
        {step === 0 ? (
          <div className="wizard__section">
            <Input
              label="Full name"
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Your name"
              autoComplete="name"
              required
            />

            <div className="choice-grid">
              {goalOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`choice-card ${form.goalType === option.value ? "is-selected" : ""}`}
                  onClick={() => updateField("goalType", option.value)}
                >
                  <strong className="choice-card__title">{option.label}</strong>
                  <span className="choice-card__text">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="wizard__section">
            <Input
              label="Term or session name"
              value={form.termName}
              onChange={(event) => updateField("termName", event.target.value)}
              placeholder="Current term"
            />

            <div className="auth-form__row">
              <Input
                label="Study hours per week"
                type="number"
                min="1"
                step="1"
                value={form.weeklyStudyHours}
                onChange={(event) =>
                  updateField("weeklyStudyHours", Number(event.target.value))
                }
                required
              />

              <Input
                label="Session length"
                type="number"
                min="15"
                step="5"
                value={form.sessionLength}
                onChange={(event) =>
                  updateField("sessionLength", Number(event.target.value))
                }
                required
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="wizard__section">
            <div className="auth-form__row">
              <Input
                label="Add a subject"
                value={subjectDraft}
                onChange={(event) => setSubjectDraft(event.target.value)}
                placeholder="Type a subject"
              />
              <div className="wizard__subject-action">
                <Button type="button" variant="ghost" onClick={() => addSubject()}>
                  Add subject
                </Button>
              </div>
            </div>

            <div className="subject-list">
              {recommendedSubjects.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  className="subject-pill"
                  onClick={() => addSubject(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>

            <div className="subject-chip-grid">
              {form.subjects.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  className="subject-chip"
                  onClick={() => removeSubject(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="wizard__section">
            <div className="choice-grid">
              {studyModeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`choice-card ${form.studyMode === option.value ? "is-selected" : ""}`}
                  onClick={() => updateField("studyMode", option.value)}
                >
                  <strong className="choice-card__title">{option.label}</strong>
                  <span className="choice-card__text">How your sessions should feel.</span>
                </button>
              ))}
            </div>

            <Select
              label="Theme"
              value={form.themeMode}
              onChange={(event) => updateField("themeMode", event.target.value)}
            >
              {themeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <div className="summary-card">
              <span className="summary-card__label">Workspace preview</span>
              <strong className="summary-card__value">{form.fullName || "Your workspace"}</strong>
              <p className="summary-card__text">
                {form.goalType} · {form.subjects.length} subjects · {form.weeklyStudyHours} study hours per week
              </p>
            </div>
          </div>
        ) : null}

        {error ? <div className="auth-form__error">{error}</div> : null}

        <div className="auth-form__footer">
          <div className="auth-card__actions">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={handleBack}>
                Back
              </Button>
            ) : null}
            <Button type="submit" variant="primary">
              {isLastStep ? "Finish setup" : "Continue"}
            </Button>
          </div>
        </div>
      </form>
    </Surface>
  );
}

export default OnboardingWizardPage;