const iconPaths = {
  workspace: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M8 8h8M8 12h5M8 16h7" />
    </>
  ),
  planner: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17" />
      <path d="M8 13h.01M12 13h.01M16 13h.01M8 16.5h.01M12 16.5h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  library: (
    <>
      <path d="M5 4.5h11.5A2.5 2.5 0 0 1 19 7v12.5H7A2.5 2.5 0 0 1 4.5 17V5a.5.5 0 0 1 .5-.5Z" />
      <path d="M7 19.5h12M8 8h7M8 12h7" />
    </>
  ),
  settings: (
    <>
      <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" />
      <path d="m19.2 14.1 1.2 1.1-1.8 3-1.6-.5a8 8 0 0 1-1.5.9l-.3 1.7h-3.6l-.3-1.7a8 8 0 0 1-1.5-.9l-1.6.5-1.8-3 1.2-1.1a7.8 7.8 0 0 1 0-2.2L5 10.8l1.8-3 1.6.5a8 8 0 0 1 1.5-.9l.3-1.7h3.6l.3 1.7a8 8 0 0 1 1.5.9l1.6-.5 1.8 3-1.2 1.1a7.8 7.8 0 0 1 0 2.2Z" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h13" />
      <path d="m14 7 5 5-5 5" />
    </>
  ),
  logout: (
    <>
      <path d="M10 5H6.8A1.8 1.8 0 0 0 5 6.8v10.4A1.8 1.8 0 0 0 6.8 19H10" />
      <path d="M14 8l4 4-4 4M10 12h8" />
    </>
  )
};

function NavigationIcon({ name, size = 18, strokeWidth = 1.7 }) {
  const content = iconPaths[name];

  if (!content) {
    return null;
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {content}
    </svg>
  );
}

export default NavigationIcon;