const guestNavigationGroups = [
  {
    label: "Explore",
    items: [
      {
        to: "/",
        label: "Home",
        description: "Start here"
      }
    ]
  }
];

const authenticatedNavigationGroups = [
  {
    label: "Core",
    items: [
      {
        to: "/dashboard",
        label: "Workspace",
        description: "Overview and next steps"
      }
    ]
  },
  {
    label: "Planning",
    items: [
      {
        to: "/planner",
        label: "Planner",
        description: "Calendar-first scheduling"
      },
      {
        to: "/search",
        label: "Search",
        description: "Find tasks, sessions, and exams"
      }
    ]
  },
  {
    label: "Knowledge",
    items: [
      {
        to: "/library",
        label: "Library",
        description: "Notes, resources, and attachments"
      }
    ]
  },
  {
    label: "Account",
    items: [
      {
        to: "/settings",
        label: "Settings",
        description: "Profile and workspace preferences"
      }
    ]
  }
];

const routeMeta = [
  {
    path: "/",
    title: "Home",
    description: "Start here"
  },
  {
    path: "/dashboard",
    title: "Workspace",
    description: "Today, progress, and next steps"
  },
  {
    path: "/planner",
    title: "Planner",
    description: "Plan the week with calm precision"
  },
  {
    path: "/search",
    title: "Search",
    description: "Find tasks, sessions, exams, and saved views"
  },
  {
    path: "/library",
    title: "Library",
    description: "Notes, resources, and attachment records"
  },
  {
    path: "/settings",
    title: "Settings",
    description: "Profile and workspace preferences"
  }
];

function normalizePathname(pathname) {
  const value = `${pathname ?? "/"}`.replace(/\/+$/, "");
  return value || "/";
}

function getNavigationGroups(isAuthenticated) {
  return isAuthenticated ? authenticatedNavigationGroups : guestNavigationGroups;
}

function getNavigationLinks(isAuthenticated) {
  return getNavigationGroups(isAuthenticated).flatMap((group) => group.items);
}

function getShellRouteMeta(pathname, isAuthenticated) {
  const normalizedPath = normalizePathname(pathname);

  const match = routeMeta.find((item) => item.path === normalizedPath);
  if (match) {
    return match;
  }

  if (!isAuthenticated) {
    return routeMeta[0];
  }

  return {
    title: "StudyOS",
    description: "Premium student operating system"
  };
}

export {
  authenticatedNavigationGroups,
  guestNavigationGroups,
  getNavigationGroups,
  getNavigationLinks,
  getShellRouteMeta
};