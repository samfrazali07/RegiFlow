import { useState } from "react";
import {
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  KeyRound,
} from "lucide-react";
import FormInput from "./FormInput";
import {
  emailFieldSchema,
  passwordFieldSchema,
  evaluatePasswordChecks,
} from "../schemas/registrationSchema";

export default function AccountDetails({
  register,
  errors,
  formValues,
  isStepValid,
  onBack,
  onNext,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailValue = formValues.email || "";
  const passwordValue = formValues.password || "";
  const confirmPasswordValue = formValues.confirmPassword || "";

  const isEmailValid = emailFieldSchema.safeParse(emailValue).success;
  const isPasswordValid = passwordFieldSchema.safeParse(passwordValue).success;
  const isConfirmPasswordValid =
    confirmPasswordValue.length > 0 &&
    isPasswordValid &&
    passwordValue === confirmPasswordValue;

  const passwordMetrics = evaluatePasswordChecks(passwordValue);

  return (
    <div className="rf-step-panel" data-step="2">
      <div className="rf-section-intro">
        <div className="rf-section-kicker">
          <KeyRound size={14} strokeWidth={2.2} />
          <span>Account Security</span>
        </div>
        <h2 className="rf-section-title">Set up your credentials</h2>
        <p className="rf-section-subtitle">
          Use a valid work or personal email address and create a strong password.
        </p>
      </div>

      <div className="rf-fields-stack">
        <FormInput
          id="email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          icon={Mail}
          register={register}
          error={errors.email?.message}
          isValid={isEmailValid}
        />

        <div className="rf-password-block">
          <FormInput
            id="password"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            autoComplete="new-password"
            icon={Lock}
            register={register}
            error={errors.password?.message}
            isValid={isPasswordValid}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="rf-visibility-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            }
          />

          {/* Live Password Strength & Complexity Checklist */}
          <div className="rf-strength-card" aria-live="polite">
            <div className="rf-strength-header">
              <span className="rf-strength-title">Password strength</span>
              <span
                className={`rf-strength-status rf-strength-status--${passwordMetrics.strengthTone}`}
              >
                {passwordMetrics.strengthLabel}
              </span>
            </div>

            <div className="rf-strength-bars" aria-hidden="true">
              {[1, 2, 3, 4].map((segment) => {
                const isFilled = passwordMetrics.passedCount >= segment;
                return (
                  <span
                    key={segment}
                    className={`rf-strength-segment ${
                      isFilled
                        ? `rf-strength-segment--${passwordMetrics.strengthTone}`
                        : ""
                    }`}
                  />
                );
              })}
            </div>

            <ul className="rf-criteria-grid">
              {passwordMetrics.checks.map((rule) => (
                <li
                  key={rule.id}
                  className={`rf-criteria-item ${
                    rule.passed ? "rf-criteria-item--passed" : ""
                  }`}
                >
                  <span className="rf-criteria-icon" aria-hidden="true">
                    {rule.passed ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      <Circle size={10} strokeWidth={2.2} />
                    )}
                  </span>
                  <span>{rule.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          icon={ShieldCheck}
          register={register}
          error={errors.confirmPassword?.message}
          isValid={isConfirmPasswordValid}
          helperText={
            isConfirmPasswordValid
              ? "Passwords match."
              : "Must match your password exactly."
          }
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="rf-visibility-toggle"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              title={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={18} strokeWidth={2} />
              ) : (
                <Eye size={18} strokeWidth={2} />
              )}
            </button>
          }
        />
      </div>

      <div className="rf-actions-bar rf-actions-bar--split">
        <button
          type="button"
          onClick={onBack}
          className="rf-btn rf-btn--secondary"
        >
          <ArrowLeft size={17} strokeWidth={2.2} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isStepValid}
          className="rf-btn rf-btn--primary"
        >
          <span>Next</span>
          <ArrowRight size={17} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
