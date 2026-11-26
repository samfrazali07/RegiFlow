import { CheckCircle2, RotateCcw, ShieldCheck, Terminal } from "lucide-react";

export default function SuccessScreen({ submittedData, onStartAgain }) {
  const fullName = submittedData
    ? `${submittedData.firstName} ${submittedData.lastName}`
    : "";

  return (
    <div className="rf-success-screen" role="status" aria-live="polite">
      {/* Animated Success Icon */}
      <div className="rf-success-badge-wrap" aria-hidden="true">
        <span className="rf-success-pulse-ring" />
        <span className="rf-success-pulse-ring rf-success-pulse-ring--delayed" />
        <div className="rf-success-icon-circle">
          <CheckCircle2 size={42} strokeWidth={2.2} />
        </div>
      </div>

      <h2 className="rf-success-heading">Registration Completed!</h2>
      <p className="rf-success-message">
        Your information has been successfully submitted.
      </p>

      {/* Confirmation that all form validations passed */}
      <div className="rf-success-confirm-box">
        <div className="rf-success-confirm-row">
          <ShieldCheck size={18} strokeWidth={2.3} className="rf-confirm-icon" />
          <span>All form validations passed successfully (Step 1, Step 2 &amp; Schema Check).</span>
        </div>

        <div className="rf-success-confirm-row rf-success-confirm-row--muted">
          <Terminal size={16} strokeWidth={2.1} className="rf-confirm-icon--violet" />
          <span>Finalized registration object has been logged to the browser console.</span>
        </div>
      </div>

      {submittedData && (
        <div className="rf-success-account-pill">
          <div className="rf-avatar-circle" aria-hidden="true">
            {submittedData.firstName?.[0]?.toUpperCase() || "R"}
            {submittedData.lastName?.[0]?.toUpperCase() || "F"}
          </div>
          <div className="rf-account-pill-meta">
            <span className="rf-account-pill-name">{fullName}</span>
            <span className="rf-account-pill-email">{submittedData.email}</span>
          </div>
        </div>
      )}

      <div className="rf-success-actions">
        <button
          type="button"
          onClick={onStartAgain}
          className="rf-btn rf-btn--primary rf-btn--wide"
        >
          <RotateCcw size={17} strokeWidth={2.2} />
          <span>Start Again</span>
        </button>
      </div>
    </div>
  );
}
