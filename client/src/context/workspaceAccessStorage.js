const storageKey = "studyos.access.v1";

function createEmptyAccessState() {
  return {
    isAuthenticated: false,
    emailVerified: false,
    onboardingComplete: false,
    resetRequestedFor: "",
    resetRequestedAt: null,
    verificationRequestedFor: "",
    verificationRequestedAt: null,
    profile: {
      fullName: "",
      email: "",
      goalType: "university",
      termName: "Current term",
      weeklyStudyHours: 12,
      sessionLength: 50,
      studyMode: "balanced",
      themeMode: "system",
      subjects: []
    }
  };
}

function normalizeProfile(profile) {
  const baseProfile = createEmptyAccessState().profile;

  return {
    ...baseProfile,
    ...profile,
    subjects: Array.isArray(profile?.subjects)
      ? [...new Set(profile.subjects.map((item) => `${item}`.trim()).filter(Boolean))]
      : baseProfile.subjects
  };
}

function normalizeAccessState(input) {
  const baseState = createEmptyAccessState();

  if (!input || typeof input !== "object") {
    return baseState;
  }

  return {
    ...baseState,
    ...input,
    isAuthenticated: Boolean(input.isAuthenticated),
    emailVerified: Boolean(input.emailVerified),
    onboardingComplete: Boolean(input.onboardingComplete),
    resetRequestedFor:
      typeof input.resetRequestedFor === "string" ? input.resetRequestedFor : "",
    resetRequestedAt:
      typeof input.resetRequestedAt === "string" ? input.resetRequestedAt : null,
    verificationRequestedFor:
      typeof input.verificationRequestedFor === "string"
        ? input.verificationRequestedFor
        : "",
    verificationRequestedAt:
      typeof input.verificationRequestedAt === "string"
        ? input.verificationRequestedAt
        : null,
    profile: normalizeProfile(input.profile)
  };
}

function loadAccessState() {
  if (typeof window === "undefined") {
    return createEmptyAccessState();
  }

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return createEmptyAccessState();
    }

    return normalizeAccessState(JSON.parse(raw));
  } catch {
    return createEmptyAccessState();
  }
}

function persistAccessState(state) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Keep the app usable even if storage is blocked.
  }
}

function resolveNextRoute(state) {
  if (!state.isAuthenticated) {
    return "/login";
  }

  if (!state.emailVerified) {
    return "/verify-email";
  }

  if (!state.onboardingComplete) {
    return "/onboarding";
  }

  return "/dashboard";
}

export {
  createEmptyAccessState,
  loadAccessState,
  persistAccessState,
  resolveNextRoute
};