function Badge({ children, tone = "neutral", className = "" }) {
  const classes = ["badge", `badge--${tone}`, className].filter(Boolean).join(" ");

  return <span className={classes}>{children}</span>;
}

export default Badge;