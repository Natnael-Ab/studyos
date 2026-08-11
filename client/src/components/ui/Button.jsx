import { forwardRef } from "react";
import { Link } from "react-router-dom";
import cn from "../../lib/cn";

const Button = forwardRef(function Button(
  {
    as: Component = "button",
    to,
    href,
    variant = "primary",
    size = "md",
    className = "",
    children,
    type = "button",
    ...props
  },
  ref
) {
  const classes = cn(
    "ui-button",
    `ui-button--${variant}`,
    `ui-button--${size}`,
    className
  );

  if (to) {
    return (
      <Link
        ref={ref}
        className={classes}
        to={to}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        ref={ref}
        className={classes}
        href={href}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Component
      ref={ref}
      className={classes}
      type={type}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Button;