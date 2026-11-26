import { User, Calendar, ArrowRight, Sparkles } from "lucide-react";
import FormInput from "./FormInput";
import {
  personalInfoSchema,
  getTodayLocalISO,
  calculateAgeFromISO,
  formatDisplayDate,
} from "../schemas/registrationSchema";

export default function PersonalInfo({
  register,
  errors,
  formValues,
  isStepValid,
  onNext,
}) {
  const todayISO = getTodayLocalISO();

  const isFirstNameValid = personalInfoSchema.shape.firstName.safeParse(
    formValues.firstName
  ).success;

  const isLastNameValid = personalInfoSchema.shape.lastName.safeParse(
    formValues.lastName
  ).success;

  const isDobValid = personalInfoSchema.shape.dateOfBirth.safeParse(
    formValues.dateOfBirth
  ).success;

  const calculatedAge = isDobValid
    ? calculateAgeFromISO(formValues.dateOfBirth)
    : null;

  const dobHelperText = isDobValid
    ? `${formatDisplayDate(formValues.dateOfBirth)}${
        calculatedAge !== null ? ` · ${calculatedAge} ${calculatedAge === 1 ? "year" : "years"} old` : ""
      }`
    : "Select a valid past or current date (future dates are not permitted).";

  return (
    <div className="rf-step-panel" data-step="1">
      <div className="rf-section-intro">
        <div className="rf-section-kicker">
          <Sparkles size={14} strokeWidth={2.2} />
          <span>Personal Profile</span>
        </div>
        <h2 className="rf-section-title">Tell us about yourself</h2>
        <p className="rf-section-subtitle">
          Enter your legal name and date of birth to begin setting up your RegiFlow workspace.
        </p>
      </div>

      <div className="rf-fields-grid rf-fields-grid--two-col">
        <FormInput
          id="firstName"
          name="firstName"
          label="First Name"
          type="text"
          placeholder="e.g., Aarav"
          autoComplete="given-name"
          icon={User}
          register={register}
          error={errors.firstName?.message}
          isValid={isFirstNameValid}
        />

        <FormInput
          id="lastName"
          name="lastName"
          label="Last Name"
          type="text"
          placeholder="e.g., Sharma"
          autoComplete="family-name"
          icon={User}
          register={register}
          error={errors.lastName?.message}
          isValid={isLastNameValid}
        />
      </div>

      <div className="rf-fields-stack">
        <FormInput
          id="dateOfBirth"
          name="dateOfBirth"
          label="Date of Birth"
          type="date"
          autoComplete="bday"
          min="1900-01-01"
          max={todayISO}
          icon={Calendar}
          register={register}
          error={errors.dateOfBirth?.message}
          isValid={isDobValid}
          helperText={dobHelperText}
        />
      </div>

      <div className="rf-actions-bar rf-actions-bar--end">
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
