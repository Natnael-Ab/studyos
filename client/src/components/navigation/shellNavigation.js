const guestNavigationGroups = [
  {
    label: "Explore",
    items: [
      {
        to: "/",
        label: "Home",
        description: "Discover StudyOS",
        icon: "workspace"
      }
    ]
  }
];

const authenticatedNavigationGroups = [
  {
    label: "Workspace",
    items: [
      {
        to: "/dashboard",
        label: "Workspace",
        description: "Today, priorities, and next steps",
        icon: "workspace"
      },
      {
        to: "/planner",
        label: "Planner",
        description: "Plan your days, weeks, and exams",
        icon: "planner"
      }
    ]
  },
  {
    label: "Knowledge",
    items: [
      {
        to: "/search",
        label: "Search",
        description: "Find anything across your workspace",
        icon: "search"
      },
      {
        to: "/library",
        label: "Library",
        description: "Notes, resources, and attachments",
        icon: "library"
      }
    ]
  },
  {
    label: "Account",
    items: [
      {
        to: "/settings",
        label: "Settings",
        description: "Appearance and workspace preferences",
        icon: "settings"
      }
    ]
  }
];

const routeMeta = [
  {
    path: "/",
    title: "Home",
    description: "Discover StudyOS"
  },
  {
    path: "/dashboard",
    title: "Workspace",
    description: "Today, priorities, and next steps"
  },
  {
    path: "/planner",
    title: "Planner",
    description: "Plan your days, weeks, and exams"
  },
  {
    path: "/search",
    title: "Search",
    description: "Find anything across your workspace"
  },
  {
    path: "/library",
    title: "Library",
    description: "Notes, resources, and attachments"
  },
  {
    path: "/settings",
    title: "Settings",
    description: "Appearance and workspace preferences"
  }
];

function normalizePathname(pathname) {
  const value = `${pathname ?? "/"}`.replace(/\/+$/, "");
  return value || "/";
}

function getNavigationGroups(isAuthenticated) {
  return isAuthenticated
    ? authenticatedNavigationGroups
    : guestNavigationGroups;
}

function getNavigationLinks(isAuthenticated) {
  return getNavigationGroups(isAuthenticated).flatMap(
    (group) => group.items
  );
}

function getShellRouteMeta(pathname, isAuthenticated) {
  const normalizedPath = normalizePathname(pathname);

  const match = routeMeta.find(
    (item) => item.path === normalizedPath
  );

  if (match) {
    return match;
  }

  if (!isAuthenticated) {
    return routeMeta[0];
  }

  return {
    title: "Workspace",
    description: "Your academic workspace"
  };
}

export {
  authenticatedNavigationGroups,
  guestNavigationGroups,
  getNavigationGroups,
  getNavigationLinks,
  getShellRouteMeta
};