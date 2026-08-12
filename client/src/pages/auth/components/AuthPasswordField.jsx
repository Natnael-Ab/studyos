import { useState } from "react";
import NavigationIcon from "../../../components/navigation/NavigationIcon";
import cn from "../../../lib/cn";

function AuthPasswordField({
  label,
  hint,
  className = "",
  ...props
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label
      className={cn(
        "field",
        "auth-password-field",
        className
      )}
    >
      <span className="field__label">{label}</span>

      <span className="auth-password-field__control">
        <input
          className="field__control"
          type={visible ? "text" : "password"}
          {...props}
        />

        <button
          type="button"
          className="auth-password-field__toggle"
          onClick={() =>
            setVisible((current) => !current)
          }
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
          aria-pressed={visible}
        >
          <NavigationIcon
            name={visible ? "close" : "search"}
            size={15}
          />

          <span>
            {visible ? "Hide" : "Show"}
          </span>
        </button>
      </span>

      {hint ? (
        <span className="field__hint">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export default AuthPasswordField;