import { Check, User, Shield, ClipboardCheck } from "lucide-react";

const WIZARD_STEPS = [
  {
    number: 1,
    label: "Personal Info",
    shortLabel: "Personal",
    icon: User,
  },
  {
    number: 2,
    label: "Account Details",
    shortLabel: "Account",
    icon: Shield,
  },
  {
    number: 3,
    label: "Review & Submit",
    shortLabel: "Review",
    icon: ClipboardCheck,
  },
];

export default function ProgressBar({
  currentStep,
  totalSteps = 3,
  isStep1Valid = false,
  isStep2Valid = false,
  onStepSelect,
}) {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);
  const activeStepMeta = WIZARD_STEPS[currentStep - 1] || WIZARD_STEPS[0];

  const canNavigateToStep = (stepNumber) => {
    if (stepNumber === currentStep) return false;
    if (stepNumber < currentStep) return true;
    if (stepNumber === 2) return isStep1Valid;
    if (stepNumber === 3) return isStep1Valid && isStep2Valid;
    return false;
  };

  return (
    <div className="rf-progress-container" aria-label="Registration progress">
      <div className="rf-progress-header">
        <div className="rf-step-counter-group">
          <span className="rf-step-badge">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="rf-step-current-name">{activeStepMeta.label}</span>
        </div>
        <span className="rf-progress-percent">{progressPercentage}% Complete</span>
      </div>

      {/* Smooth Animated Progress Bar */}
      <div
        className="rf-progress-track"
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        <div
          className="rf-progress-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Nodes & Labels */}
      <ol className="rf-steps-list">
        {WIZARD_STEPS.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isClickable = Boolean(onStepSelect) && canNavigateToStep(step.number);
          const StepIcon = step.icon;

          const stateClass = isCompleted
            ? "rf-step-item--completed"
            : isActive
            ? "rf-step-item--active"
            : "rf-step-item--upcoming";

          return (
            <li key={step.number} className={`rf-step-item ${stateClass}`}>
              <button
                type="button"
                onClick={() => isClickable && onStepSelect(step.number)}
                disabled={!isClickable}
                className={`rf-step-trigger ${isClickable ? "rf-step-trigger--clickable" : ""}`}
                aria-current={isActive ? "step" : undefined}
                title={
                  isClickable
                    ? `Go to Step ${step.number}: ${step.label}`
                    : `Step ${step.number}: ${step.label}`
                }
              >
                <span className="rf-step-node">
                  {isCompleted ? (
                    <Check size={15} strokeWidth={2.8} />
                  ) : (
                    <StepIcon size={14} strokeWidth={2.2} />
                  )}
                </span>
                <span className="rf-step-text">
                  <span className="rf-step-label-full">{step.label}</span>
                  <span className="rf-step-label-short">{step.shortLabel}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
