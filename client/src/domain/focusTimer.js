const TIMER_STORAGE_KEY =
  "studyos-focus-timer";

const TIMER_MODES = {
  focus: {
    label: "Focus",
    minutes: 50,
    description:
      "One protected block for meaningful work."
  },

  shortBreak: {
    label: "Short break",
    minutes: 10,
    description:
      "Step away, reset, and return."
  },

  longBreak: {
    label: "Long break",
    minutes: 20,
    description:
      "A longer reset after several blocks."
  }
};

function createTimerState(
  mode = "focus"
) {
  const safeMode =
    TIMER_MODES[mode]
      ? mode
      : "focus";

  return {
    mode: safeMode,

    remainingSeconds:
      TIMER_MODES[safeMode].minutes *
      60,

    running: false,

    completedFocusBlocks: 0
  };
}

function loadTimerState() {
  if (
    typeof window ===
    "undefined"
  ) {
    return createTimerState();
  }

  try {
    const saved =
      window.localStorage.getItem(
        TIMER_STORAGE_KEY
      );

    if (!saved) {
      return createTimerState();
    }

    const parsed =
      JSON.parse(saved);

    if (
      !parsed ||
      !TIMER_MODES[
        parsed.mode
      ] ||
      !Number.isFinite(
        parsed.remainingSeconds
      )
    ) {
      return createTimerState();
    }

    return {
      mode: parsed.mode,

      remainingSeconds:
        Math.max(
          0,
          Math.floor(
            parsed.remainingSeconds
          )
        ),

      running: false,

      completedFocusBlocks:
        Number.isFinite(
          parsed.completedFocusBlocks
        )
          ? Math.max(
              0,
              Math.floor(
                parsed.completedFocusBlocks
              )
            )
          : 0
    };
  } catch {
    return createTimerState();
  }
}

function persistTimerState(
  state
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.localStorage.setItem(
    TIMER_STORAGE_KEY,
    JSON.stringify({
      mode: state.mode,

      remainingSeconds:
        state.remainingSeconds,

      completedFocusBlocks:
        state.completedFocusBlocks
    })
  );
}

function formatTimer(
  totalSeconds
) {
  const safeSeconds =
    Math.max(
      0,
      Math.floor(
        totalSeconds
      )
    );

  const minutes =
    Math.floor(
      safeSeconds / 60
    );

  const seconds =
    safeSeconds % 60;

  return `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

export {
  TIMER_MODES,
  createTimerState,
  formatTimer,
  loadTimerState,
  persistTimerState
};