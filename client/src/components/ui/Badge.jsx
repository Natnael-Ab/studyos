import cn from "../../lib/cn";

function Badge({ children, tone = "neutral", className = "" }) {
  return <span className={cn("badge", `badge--${tone}`, className)}>{children}</span>;
}

export default Badge;