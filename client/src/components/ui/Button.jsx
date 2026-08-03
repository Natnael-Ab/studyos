import { Link } from "react-router-dom";
import cn from "../../lib/cn";

function Button({
  as: Component = "button",
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...props
}) {
  const classes = cn(
    "ui-button",
    `ui-button--${variant}`,
    `ui-button--${size}`,
    className
  );

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Component className={classes} type={type} {...props}>
      {children}
    </Component>
  );
}

export default Button;