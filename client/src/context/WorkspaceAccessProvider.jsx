import { useCallback, useEffect, useMemo, useState } from "react";
import WorkspaceAccessContext from "./WorkspaceAccessContext";
import {
  createEmptyAccessState,
  loadAccessState,
  persistAccessState,
  resolveNextRoute
} from "./workspaceAccessStorage";

function WorkspaceAccessProvider({ children }) {
  const [access, setAccess] = useState(loadAccessState);

  useEffect(() => {
    persistAccessState(access);
  }, [access]);

  const signIn = useCallback(
    ({ email }) => {
      const nextState = {
        ...access,
        isAuthenticated: true,
        profile: {
          ...access.profile,
          email: email.trim()
        }
      };

      setAccess(nextState);
      return resolveNextRoute(nextState);
    },
    [access]
  );

  const signUp = useCallback(
    ({ fullName, email }) => {
      const nextState = {
        ...access,
        isAuthenticated: true,
        emailVerified: false,
        onboardingComplete: false,
        profile: {
          ...access.profile,
          fullName: fullName.trim(),
          email: email.trim()
        }
      };

      setAccess(nextState);
      return "/verify-email";
    },
    [access]
  );

  const signOut = useCallback(() => {
    const nextState = createEmptyAccessState();
    setAccess(nextState);
    return "/";
  }, []);

  const requestPasswordReset = useCallback(
    (email) => {
      const targetEmail = email.trim() || access.profile.email.trim();
      const nextState = {
        ...access,
        resetRequestedFor: targetEmail,
        resetRequestedAt: new Date().toISOString()
      };

      setAccess(nextState);

      return {
        ok: true,
        message: targetEmail
          ? `Password reset request prepared for ${targetEmail}.`
          : "Password reset request prepared."
      };
    },
    [access]
  );

  const requestVerificationEmail = useCallback(() => {
    const nextState = {
      ...access,
      verificationRequestedFor: access.profile.email.trim(),
      verificationRequestedAt: new Date().toISOString()
    };

    setAccess(nextState);

    return {
      ok: true,
      message: access.profile.email
        ? `Verification email prepared for ${access.profile.email}.`
        : "Verification email prepared."
    };
  }, [access]);

  const markEmailVerified = useCallback(() => {
    const nextState = {
      ...access,
      emailVerified: true
    };

    setAccess(nextState);
    return resolveNextRoute(nextState);
  }, [access]);

  const completeOnboarding = useCallback(
    (profilePatch) => {
      const nextState = {
        ...access,
        onboardingComplete: true,
        profile: {
          ...access.profile,
          fullName: profilePatch.fullName.trim(),
          goalType: profilePatch.goalType,
          termName: profilePatch.termName.trim(),
          weeklyStudyHours: Number(profilePatch.weeklyStudyHours),
          sessionLength: Number(profilePatch.sessionLength),
          studyMode: profilePatch.studyMode,
          themeMode: profilePatch.themeMode,
          subjects: Array.isArray(profilePatch.subjects)
            ? [...new Set(profilePatch.subjects.map((item) => `${item}`.trim()).filter(Boolean))]
            : access.profile.subjects
        }
      };

      setAccess(nextState);
      return resolveNextRoute(nextState);
    },
    [access]
  );

  const updateProfile = useCallback((profilePatch = {}) => {
    setAccess((current) => {
      const nextSubjects = Array.isArray(profilePatch.subjects)
        ? [...new Set(profilePatch.subjects.map((item) => `${item}`.trim()).filter(Boolean))]
        : current.profile.subjects;

      return {
        ...current,
        profile: {
          ...current.profile,
          fullName:
            typeof profilePatch.fullName === "string"
              ? profilePatch.fullName.trim()
              : current.profile.fullName,
          goalType:
            typeof profilePatch.goalType === "string"
              ? profilePatch.goalType
              : current.profile.goalType,
          termName:
            typeof profilePatch.termName === "string"
              ? profilePatch.termName.trim()
              : current.profile.termName,
          weeklyStudyHours:
            profilePatch.weeklyStudyHours !== undefined
              ? Number(profilePatch.weeklyStudyHours)
              : current.profile.weeklyStudyHours,
          sessionLength:
            profilePatch.sessionLength !== undefined
              ? Number(profilePatch.sessionLength)
              : current.profile.sessionLength,
          studyMode:
            typeof profilePatch.studyMode === "string"
              ? profilePatch.studyMode
              : current.profile.studyMode,
          subjects: nextSubjects
        }
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: access.isAuthenticated,
      emailVerified: access.emailVerified,
      onboardingComplete: access.onboardingComplete,
      resetRequestedFor: access.resetRequestedFor,
      resetRequestedAt: access.resetRequestedAt,
      verificationRequestedFor: access.verificationRequestedFor,
      verificationRequestedAt: access.verificationRequestedAt,
      profile: access.profile,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      requestVerificationEmail,
      markEmailVerified,
      completeOnboarding,
      updateProfile
    }),
    [
      access,
      completeOnboarding,
      markEmailVerified,
      requestPasswordReset,
      requestVerificationEmail,
      signIn,
      signOut,
      signUp,
      updateProfile
    ]
  );

  return (
    <WorkspaceAccessContext.Provider value={value}>
      {children}
    </WorkspaceAccessContext.Provider>
  );
}

export default WorkspaceAccessProvider;