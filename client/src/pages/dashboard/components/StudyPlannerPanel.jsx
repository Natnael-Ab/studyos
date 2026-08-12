import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Badge,
  Button,
  Surface
} from "../../../components/ui";

import {
  useStudyData
} from "../../../hooks/useStudyData";

import {
  formatSessionDateLabel
} from "../../../domain/studySessionPlanner";

import {
  TIMER_MODES,
  createTimerState,
  formatTimer,
  loadTimerState,
  persistTimerState
} from "../../../domain/focusTimer";

function StudyPlannerPanel() {
  const {
    studySessions,
    subjects
  } = useStudyData();

  const [
    timer,
    setTimer
  ] = useState(
    loadTimerState
  );

  const [
    activeSessionId,
    setActiveSessionId
  ] = useState(null);

  const [
    currentTime,
    setCurrentTime
  ] = useState(
    () => Date.now()
  );

  useEffect(() => {
    persistTimerState(
      timer
    );
  }, [
    timer
  ]);

  useEffect(() => {
    if (!timer.running) {
      return undefined;
    }

    const intervalId =
      window.setInterval(() => {
        setTimer(
          (current) => {
            if (
              current.remainingSeconds <=
              1
            ) {
              const completedFocusBlock =
                current.mode ===
                "focus";

              return {
                mode:
                  completedFocusBlock
                    ? "shortBreak"
                    : "focus",

                remainingSeconds:
                  completedFocusBlock
                    ? TIMER_MODES
                        .shortBreak
                        .minutes *
                      60
                    : TIMER_MODES
                        .focus
                        .minutes *
                      60,

                running: false,

                completedFocusBlocks:
                  current.completedFocusBlocks +
                  (
                    completedFocusBlock
                      ? 1
                      : 0
                  )
              };
            }

            return {
              ...current,

              remainingSeconds:
                current.remainingSeconds -
                1
            };
          }
        );

        setCurrentTime(
          Date.now()
        );
      }, 1000);

    return () => {
      window.clearInterval(
        intervalId
      );
    };
  }, [
    timer.running
  ]);

  useEffect(() => {
    const minuteIntervalId =
      window.setInterval(() => {
        setCurrentTime(
          Date.now()
        );
      }, 60_000);

    return () => {
      window.clearInterval(
        minuteIntervalId
      );
    };
  }, []);

  const subjectMap =
    useMemo(
      () =>
        new Map(
          subjects.map(
            (subject) => [
              subject.id,
              subject.name
            ]
          )
        ),
      [subjects]
    );

  const upcomingSessions =
    useMemo(() => {
      return [...studySessions]
        .filter(
          (session) =>
            new Date(
              session.scheduledFor
            ).getTime() >=
            currentTime
        )
        .sort(
          (left, right) =>
            new Date(
              left.scheduledFor
            ).getTime() -
            new Date(
              right.scheduledFor
            ).getTime()
        )
        .slice(0, 4);
    }, [
      studySessions,
      currentTime
    ]);

  const mode =
    TIMER_MODES[
      timer.mode
    ] ?? TIMER_MODES.focus;

  const modeDurationSeconds =
    mode.minutes * 60;

  const elapsedRatio =
    Math.min(
      1,
      Math.max(
        0,
        1 -
          timer.remainingSeconds /
            modeDurationSeconds
      )
    );

  const displayModeLabel =
    timer.mode ===
    "shortBreak"
      ? "Short break"
      : timer.mode ===
        "longBreak"
      ? "Long break"
      : "Focus";

  const activeSession =
    upcomingSessions.find(
      (session) =>
        session.id ===
        activeSessionId
    ) ?? null;

  function setMode(
    nextMode
  ) {
    setTimer({
      mode: nextMode,

      remainingSeconds:
        TIMER_MODES[nextMode]
          .minutes * 60,

      running: false,

      completedFocusBlocks:
        timer.completedFocusBlocks
    });
  }

  function toggleTimer() {
    setTimer(
      (current) => ({
        ...current,
        running:
          !current.running
      })
    );
  }

  function resetTimer() {
    setTimer({
      mode: timer.mode,

      remainingSeconds:
        TIMER_MODES[
          timer.mode
        ].minutes * 60,

      running: false,

      completedFocusBlocks:
        timer.completedFocusBlocks
    });
  }

  function selectSession(
    session
  ) {
    setActiveSessionId(
      session.id
    );

    setTimer({
      mode: "focus",

      remainingSeconds:
        Math.max(
          15,
          Number(
            session.durationMinutes
          ) || 50
        ) * 60,

      running: false,

      completedFocusBlocks:
        timer.completedFocusBlocks
    });
  }

  function startFreshFocus() {
    setActiveSessionId(
      null
    );

    setTimer({
      mode: "focus",

      remainingSeconds:
        TIMER_MODES.focus
          .minutes * 60,

      running: true,

      completedFocusBlocks:
        timer.completedFocusBlocks
    });
  }

  return (
    <section
      className="focus-workspace"
      aria-labelledby="focus-workspace-title"
    >
      <div className="focus-workspace__header">
        <div>
          <span className="focus-workspace__eyebrow">
            Focus
          </span>

          <h2 id="focus-workspace-title">
            Protect the time that matters.
          </h2>

          <p>
            Pick a session, start one calm block, and let the
            rest of the workspace stay out of the way.
          </p>
        </div>

        <Badge tone="accent">
          {timer.completedFocusBlocks}
          {" "}
          blocks completed
        </Badge>
      </div>

      <div className="focus-workspace__layout">
        <Surface className="focus-timer">
          <div className="focus-timer__top">
            <div
              className="focus-timer__mode-tabs"
              aria-label="Focus mode"
            >
              {Object.entries(
                TIMER_MODES
              ).map(
                ([
                  modeKey,
                  modeConfig
                ]) => (
                  <button
                    key={modeKey}
                    type="button"
                    className={`focus-timer__mode ${
                      timer.mode ===
                      modeKey
                        ? "is-active"
                        : ""
                    }`}
                    onClick={() =>
                      setMode(
                        modeKey
                      )
                    }
                    disabled={
                      timer.running
                    }
                  >
                    {
                      modeConfig.label
                    }
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              className="focus-timer__reset"
              onClick={
                resetTimer
              }
            >
              Reset
            </button>
          </div>

          <div
            className="focus-timer__dial"
            role="timer"
            aria-live="polite"
            aria-label={`${displayModeLabel}: ${formatTimer(
              timer.remainingSeconds
            )}`}
          >
            <span
              className="focus-timer__dial-progress"
              style={{
                background:
                  `conic-gradient(var(--accent) 0 ${
                    elapsedRatio *
                    360
                  }deg, color-mix(in srgb, var(--text) 7%, transparent) ${
                    elapsedRatio *
                    360
                  }deg 360deg)`
              }}
            />

            <div className="focus-timer__dial-center">
              <span>
                {displayModeLabel}
              </span>

              <strong>
                {formatTimer(
                  timer.remainingSeconds
                )}
              </strong>

              <small>
                {activeSession
                  ? activeSession.title
                  : mode.description}
              </small>
            </div>
          </div>

          <div className="focus-timer__controls">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={
                toggleTimer
              }
            >
              {timer.running
                ? "Pause"
                : timer.remainingSeconds <
                  modeDurationSeconds
                ? "Resume"
                : "Start focus"}
            </Button>

            {!timer.running &&
            timer.remainingSeconds ===
              0 ? (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={
                  startFreshFocus
                }
              >
                Start another block
              </Button>
            ) : null}
          </div>

          {activeSession ? (
            <div className="focus-timer__session">
              <span>
                Selected session
              </span>

              <strong>
                {activeSession.title}
              </strong>

              <small>
                {subjectMap.get(
                  activeSession.subjectId
                ) ??
                  "Study session"}
                {" · "}
                {
                  activeSession.durationMinutes
                }
                {" min"}
              </small>
            </div>
          ) : (
            <button
              type="button"
              className="focus-timer__quick-start"
              onClick={
                startFreshFocus
              }
            >
              Start an unplanned focus block
            </button>
          )}
        </Surface>

        <Surface className="focus-queue">
          <div className="focus-queue__header">
            <div>
              <span>
                Up next
              </span>

              <strong>
                Study sessions
              </strong>
            </div>

            <Button
              to="/planner"
              variant="ghost"
              size="sm"
            >
              Open planner
            </Button>
          </div>

          {upcomingSessions.length ===
          0 ? (
            <div className="focus-queue__empty">
              <span aria-hidden="true">
                +
              </span>

              <strong>
                Your focus queue is clear.
              </strong>

              <p>
                Schedule a study session in the planner and
                it will appear here.
              </p>
            </div>
          ) : (
            <div className="focus-queue__list">
              {upcomingSessions.map(
                (
                  session
                ) => {
                  const isSelected =
                    session.id ===
                    activeSessionId;

                  return (
                    <button
                      key={
                        session.id
                      }
                      type="button"
                      className={`focus-queue__item ${
                        isSelected
                          ? "is-selected"
                          : ""
                      }`}
                      onClick={() =>
                        selectSession(
                          session
                        )
                      }
                    >
                      <span className="focus-queue__item-time">
                        {formatSessionDateLabel(
                          session.scheduledFor
                        )}
                      </span>

                      <span className="focus-queue__item-copy">
                        <strong>
                          {
                            session.title
                          }
                        </strong>

                        <span>
                          {subjectMap.get(
                            session.subjectId
                          ) ??
                            "Study session"}
                          {" · "}
                          {
                            session.durationMinutes
                          }
                          {" min"}
                        </span>
                      </span>

                      <span className="focus-queue__item-action">
                        {isSelected
                          ? "Selected"
                          : "Focus"}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </Surface>
      </div>

      <div className="focus-workspace__principles">
        <article>
          <span>
            01
          </span>

          <strong>
            One thing at a time.
          </strong>

          <p>
            The timer stays simple so your attention can stay on
            the work.
          </p>
        </article>

        <article>
          <span>
            02
          </span>

          <strong>
            Choose the session first.
          </strong>

          <p>
            Scheduled work gives the timer context instead of
            making focus an isolated feature.
          </p>
        </article>

        <article>
          <span>
            03
          </span>

          <strong>
            Keep the rhythm visible.
          </strong>

          <p>
            Completed blocks create useful feedback without
            turning studying into a noisy scorecard.
          </p>
        </article>
      </div>
    </section>
  );
}

export default StudyPlannerPanel;