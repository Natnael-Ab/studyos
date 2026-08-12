import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Progress,
  Surface
} from "../../components/ui";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";
import { useWorkspaceSettings } from "../../hooks/useWorkspaceSettings";

const goalOptions = [
  {
    value: "university",
    label: "University",
    text: "Course-heavy planning with deadlines and revision."
  },
  {
    value: "high-school",
    label: "High school",
    text: "Balanced planning with assignments and exams."
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
    text: "Flexible planning around your own study rhythm."
  }
];

const studyModeOptions = [
  {
    value: "balanced",
    label: "Balanced",
    text: "A steady mix of focused work and flexibility."
  },
  {
    value: "deep-work",
    label: "Deep work",
    text: "Longer uninterrupted sessions and fewer switches."
  },
  {
    value: "flexible",
    label: "Flexible",
    text: "Adapt the workspace around changing days."
  }
];

const themeOptions = [
  {
    value: "system",
    label: "System",
    text: "Follow your device appearance."
  },
  {
    value: "light",
    label: "Light",
    text: "Bright, editorial workspace."
  },
  {
    value: "dark",
    label: "Dark",
    text: "Quiet, low-light workspace."
  }
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

  const {
    profile,
    completeOnboarding
  } = useWorkspaceAccess();

  const {
    updateAppearance
  } = useWorkspaceSettings();

  const steps = useMemo(
    () => [
      "Profile",
      "Study plan",
      "Subjects",
      "Preferences"
    ],
    []
  );

  const [step, setStep] = useState(0);
  const [subjectDraft, setSubjectDraft] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName:
      profile.fullName || "",
    goalType:
      profile.goalType || "university",
    termName:
      profile.termName || "Current term",
    weeklyStudyHours:
      profile.weeklyStudyHours || 12,
    sessionLength:
      profile.sessionLength || 50,
    studyMode:
      profile.studyMode || "balanced",
    themeMode:
      profile.themeMode || "system",
    subjects:
      Array.isArray(profile.subjects) &&
      profile.subjects.length > 0
        ? profile.subjects
        : ["Mathematics"]
  });

  const progress =
    ((step + 1) /
      steps.length) *
    100;

  const isLastStep =
    step === steps.length - 1;

  function updateField(
    name,
    value
  ) {
    setForm((current) => ({
      ...current,
      [name]: value
    }));

    setError("");
  }

  function addSubject(
    value = subjectDraft
  ) {
    const nextValue =
      `${value}`.trim();

    if (!nextValue) {
      return;
    }

    setForm((current) => {
      if (
        current.subjects.includes(
          nextValue
        )
      ) {
        return current;
      }

      return {
        ...current,
        subjects: [
          ...current.subjects,
          nextValue
        ]
      };
    });

    setSubjectDraft("");
    setError("");
  }

  function removeSubject(
    subjectName
  ) {
    setForm((current) => ({
      ...current,
      subjects:
        current.subjects.filter(
          (item) =>
            item !==
            subjectName
        )
    }));
  }

  function validateStep() {
    if (
      step === 0 &&
      !form.fullName.trim()
    ) {
      return "Add your name to continue.";
    }

    if (
      step === 1 &&
      (!Number(
        form.weeklyStudyHours
      ) ||
        Number(
          form.weeklyStudyHours
        ) < 1 ||
        !Number(
          form.sessionLength
        ) ||
        Number(
          form.sessionLength
        ) < 15)
    ) {
      return "Choose realistic study hours and a session length.";
    }

    if (
      step === 2 &&
      form.subjects.length === 0
    ) {
      return "Add at least one subject.";
    }

    return "";
  }

  function handleNext(event) {
    event.preventDefault();

    const validationError =
      validateStep();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    if (!isLastStep) {
      setStep(
        (current) =>
          current + 1
      );
      return;
    }

    updateAppearance(
      "themeMode",
      form.themeMode
    );

    const nextRoute =
      completeOnboarding({
        fullName:
          form.fullName,
        goalType:
          form.goalType,
        termName:
          form.termName,
        weeklyStudyHours:
          form.weeklyStudyHours,
        sessionLength:
          form.sessionLength,
        studyMode:
          form.studyMode,
        themeMode:
          form.themeMode,
        subjects:
          form.subjects
      });

    navigate(nextRoute);
  }

  function handleBack() {
    setError("");

    setStep(
      (current) =>
        Math.max(
          0,
          current - 1
        )
    );
  }

  return (
    <Surface className="auth-card wizard">
      <div className="auth-card__eyebrow">
        <span className="auth-shell__eyebrow">
          Personalize your workspace
        </span>

        <span className="auth-card__step-label">
          Step {step + 1} of {steps.length}
        </span>
      </div>

      <div className="auth-card__title-group">
        <h2 className="auth-card__title">
          Shape StudyOS around the way you study.
        </h2>

        <p className="auth-card__description">
          Four short steps are enough to create a useful
          first workspace. You can change these preferences
          later.
        </p>
      </div>

      <div className="wizard__progress">
        <Progress
          value={progress}
          label={`Step ${step + 1} of ${steps.length}`}
        />

        <div className="wizard__steps">
          {steps.map(
            (label, index) => (
              <div
                key={label}
                className={`wizard__step ${
                  index === step
                    ? "is-active"
                    : ""
                }`}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>

      <form
        className="auth-form"
        onSubmit={handleNext}
      >
        {step === 0 ? (
          <div className="wizard__section">
            <Input
              label="Full name"
              value={form.fullName}
              onChange={(event) =>
                updateField(
                  "fullName",
                  event.target.value
                )
              }
              placeholder="Your name"
              autoComplete="name"
              autoFocus
              required
            />

            <div className="choice-grid">
              {goalOptions.map(
                (option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`choice-card ${
                      form.goalType ===
                      option.value
                        ? "is-selected"
                        : ""
                    }`}
                    onClick={() =>
                      updateField(
                        "goalType",
                        option.value
                      )
                    }
                  >
                    <strong className="choice-card__title">
                      {option.label}
                    </strong>

                    <span className="choice-card__text">
                      {option.text}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="wizard__section">
            <Input
              label="Term or session name"
              value={form.termName}
              onChange={(event) =>
                updateField(
                  "termName",
                  event.target.value
                )
              }
              placeholder="Current term"
            />

            <div className="auth-form__row">
              <Input
                label="Study hours per week"
                type="number"
                min="1"
                step="1"
                value={
                  form.weeklyStudyHours
                }
                onChange={(event) =>
                  updateField(
                    "weeklyStudyHours",
                    Number(
                      event.target.value
                    )
                  )
                }
                required
              />

              <Input
                label="Session length"
                type="number"
                min="15"
                step="5"
                value={
                  form.sessionLength
                }
                onChange={(event) =>
                  updateField(
                    "sessionLength",
                    Number(
                      event.target.value
                    )
                  )
                }
                required
              />
            </div>

            <div className="summary-card">
              <span className="summary-card__label">
                Planning baseline
              </span>

              <strong className="summary-card__value">
                {form.weeklyStudyHours} hours ·{" "}
                {form.sessionLength} min sessions
              </strong>

              <p className="summary-card__text">
                You can adjust the plan later
                as your schedule changes.
              </p>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="wizard__section">
            <div className="auth-form__row">
              <Input
                label="Add a subject"
                value={subjectDraft}
                onChange={(event) =>
                  setSubjectDraft(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    event.preventDefault();
                    addSubject();
                  }
                }}
                placeholder="Type a subject"
              />

              <div className="wizard__subject-action">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    addSubject()
                  }
                >
                  Add subject
                </Button>
              </div>
            </div>

            <div>
              <span className="summary-card__label">
                Suggested starting points
              </span>

              <div className="subject-list">
                {recommendedSubjects.map(
                  (subject) => (
                    <button
                      key={subject}
                      type="button"
                      className="subject-pill"
                      onClick={() =>
                        addSubject(
                          subject
                        )
                      }
                    >
                      {subject}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <span className="summary-card__label">
                Your subjects
              </span>

              <div className="subject-chip-grid">
                {form.subjects.map(
                  (subject) => (
                    <button
                      key={subject}
                      type="button"
                      className="subject-chip"
                      onClick={() =>
                        removeSubject(
                          subject
                        )
                      }
                      aria-label={`Remove ${subject}`}
                    >
                      {subject}
                      <span aria-hidden="true">
                        ×
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="wizard__section">
            <div>
              <span className="summary-card__label">
                Study mode
              </span>

              <div className="choice-grid">
                {studyModeOptions.map(
                  (option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`choice-card ${
                        form.studyMode ===
                        option.value
                          ? "is-selected"
                          : ""
                      }`}
                      onClick={() =>
                        updateField(
                          "studyMode",
                          option.value
                        )
                      }
                    >
                      <strong className="choice-card__title">
                        {option.label}
                      </strong>

                      <span className="choice-card__text">
                        {option.text}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <span className="summary-card__label">
                Appearance
              </span>

              <div className="choice-grid">
                {themeOptions.map(
                  (option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`choice-card ${
                        form.themeMode ===
                        option.value
                          ? "is-selected"
                          : ""
                      }`}
                      onClick={() =>
                        updateField(
                          "themeMode",
                          option.value
                        )
                      }
                    >
                      <strong className="choice-card__title">
                        {option.label}
                      </strong>

                      <span className="choice-card__text">
                        {option.text}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="summary-card">
              <span className="summary-card__label">
                Workspace preview
              </span>

              <strong className="summary-card__value">
                {form.fullName ||
                  "Your workspace"}
              </strong>

              <p className="summary-card__text">
                {form.goalType} ·{" "}
                {form.subjects.length} subjects ·{" "}
                {form.weeklyStudyHours} study hours per week
              </p>
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            className="auth-form__error"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <div className="auth-form__footer">
          <div className="auth-card__actions">
            {step > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleBack}
              >
                Back
              </Button>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
            >
              {isLastStep
                ? "Open my workspace"
                : "Continue"}

              <span aria-hidden="true">
                ↗
              </span>
            </Button>
          </div>
        </div>
      </form>
    </Surface>
  );
}

export default OnboardingWizardPage;