import {
  UserCheck,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Pencil,
  Send,
  Lock,
} from "lucide-react";
import {
  formatDisplayDate,
  calculateAgeFromISO,
} from "../schemas/registrationSchema";

export default function ReviewSubmit({
  formValues,
  isSubmitting = false,
  onBack,
  onEditStep,
}) {
  const firstName = (formValues.firstName || "").trim();
  const lastName = (formValues.lastName || "").trim();
  const dateOfBirth = formValues.dateOfBirth || "";
  const email = (formValues.email || "").trim();
  const password = formValues.password || "";

  const maskedPassword =
    password.length > 0 ? "•".repeat(Math.min(Math.max(password.length, 8), 16)) : "••••••••";

  const calculatedAge = calculateAgeFromISO(dateOfBirth);

  return (
    <div className="rf-step-panel" data-step="3">
      <div className="rf-section-intro">
        <div className="rf-section-kicker">
          <CheckCircle2 size={14} strokeWidth={2.2} />
          <span>Final Verification</span>
        </div>
        <h2 className="rf-section-title">Review &amp; Submit</h2>
        <p className="rf-section-subtitle">
          Please confirm that your personal and account details are accurate before completing registration.
        </p>
      </div>

      <div className="rf-review-stack">
        {/* Personal Information Summary Card */}
        <section className="rf-review-card" aria-labelledby="review-personal-heading">
          <div className="rf-review-card-header">
            <div className="rf-review-card-title-wrap">
              <span className="rf-review-icon rf-review-icon--blue" aria-hidden="true">
                <UserCheck size={17} strokeWidth={2.2} />
              </span>
              <h3 id="review-personal-heading" className="rf-review-card-title">
                Personal Information
              </h3>
            </div>

            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="rf-edit-link"
                aria-label="Edit Personal Information"
              >
                <Pencil size={13} strokeWidth={2.2} />
                <span>Edit</span>
              </button>
            )}
          </div>

          <dl className="rf-review-list">
            <div className="rf-review-row">
              <dt className="rf-review-term">First Name</dt>
              <dd className="rf-review-detail">{firstName || "—"}</dd>
            </div>

            <div className="rf-review-row">
              <dt className="rf-review-term">Last Name</dt>
              <dd className="rf-review-detail">{lastName || "—"}</dd>
            </div>

            <div className="rf-review-row">
              <dt className="rf-review-term">Date of Birth</dt>
              <dd className="rf-review-detail">
                <span>{formatDisplayDate(dateOfBirth)}</span>
                {dateOfBirth && (
                  <span className="rf-review-submeta">
                    ({dateOfBirth}
                    {calculatedAge !== null ? ` · Age ${calculatedAge}` : ""})
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </section>

        {/* Account Information Summary Card */}
        <section className="rf-review-card" aria-labelledby="review-account-heading">
          <div className="rf-review-card-header">
            <div className="rf-review-card-title-wrap">
              <span className="rf-review-icon rf-review-icon--violet" aria-hidden="true">
                <ShieldCheck size={17} strokeWidth={2.2} />
              </span>
              <h3 id="review-account-heading" className="rf-review-card-title">
                Account Information
              </h3>
            </div>

            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="rf-edit-link"
                aria-label="Edit Account Information"
              >
                <Pencil size={13} strokeWidth={2.2} />
                <span>Edit</span>
              </button>
            )}
          </div>

          <dl className="rf-review-list">
            <div className="rf-review-row">
              <dt className="rf-review-term">Email Address</dt>
              <dd className="rf-review-detail rf-review-detail--mono">{email || "—"}</dd>
            </div>

            <div className="rf-review-row">
              <dt className="rf-review-term">Password</dt>
              <dd className="rf-review-detail rf-review-password-cell">
                <span className="rf-masked-dots" aria-label="Password masked for security">
                  {maskedPassword}
                </span>
                <span className="rf-security-chip">
                  <Lock size={11} strokeWidth={2.4} />
                  <span>Masked ({password.length} chars)</span>
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <div className="rf-validation-banner">
          <CheckCircle2 size={18} strokeWidth={2.3} className="rf-validation-banner-icon" />
          <p>
            All schema validations have passed. Submitting will finalize your profile and log the
            validated payload to the developer console.
          </p>
        </div>
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
          type="submit"
          disabled={isSubmitting}
          className="rf-btn rf-btn--submit"
        >
          <Send size={16} strokeWidth={2.2} />
          <span>{isSubmitting ? "Submitting..." : "Submit Registration"}</span>
        </button>
      </div>
    </div>
  );
}
