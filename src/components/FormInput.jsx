import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function FormInput({
  id,
  name,
  label,
  type = "text",
  placeholder,
  register,
  error,
  isValid = false,
  icon: Icon,
  rightElement,
  helperText,
  autoComplete,
  min,
  max,
  required = true,
}) {
  const errorId = `${id || name}-error`;
  const helperId = `${id || name}-helper`;

  const wrapperStateClass = error
    ? "rf-input-shell--error"
    : isValid
    ? "rf-input-shell--valid"
    : "";

  return (
    <div className="rf-field-group">
      <div className="rf-label-row">
        <label htmlFor={id || name} className="rf-label">
          {label}
          {required && (
            <span className="rf-required-mark" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {!error && isValid && (
          <span className="rf-valid-pill" aria-live="polite">
            <CheckCircle2 size={13} strokeWidth={2.4} />
            <span>Valid</span>
          </span>
        )}
      </div>

      <div className={`rf-input-shell ${wrapperStateClass}`}>
        {Icon && (
          <span className="rf-input-icon" aria-hidden="true">
            <Icon size={18} strokeWidth={2} />
          </span>
        )}

        <input
          id={id || name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          min={min}
          max={max}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`rf-input ${Icon ? "rf-input--with-icon" : ""} ${
            rightElement ? "rf-input--with-action" : ""
          }`}
          {...register(name)}
        />

        {rightElement && <div className="rf-input-action">{rightElement}</div>}
      </div>

      {error ? (
        <p id={errorId} className="rf-error-message" role="alert">
          <AlertCircle size={14} strokeWidth={2.2} className="rf-error-icon" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="rf-helper-text">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
