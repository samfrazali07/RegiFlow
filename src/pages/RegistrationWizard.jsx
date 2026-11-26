import { Layers, Shield } from "lucide-react";
import { useRegistration } from "../hooks/useRegistration";
import ProgressBar from "../components/ProgressBar";
import PersonalInfo from "../components/PersonalInfo";
import AccountDetails from "../components/AccountDetails";
import ReviewSubmit from "../components/ReviewSubmit";
import SuccessScreen from "../components/SuccessScreen";

export default function RegistrationWizard() {
  const {
    currentStep,
    totalSteps,
    direction,
    isSubmitted,
    submittedData,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    formValues,
    isStep1Valid,
    isStep2Valid,
    handleNextStep,
    handleBackStep,
    goToStep,
    onSubmitRegistration,
    handleStartAgain,
  } = useRegistration();

  /**
   * Prevents browser reload or premature submission when pressing Enter in Step 1 or Step 2.
   * Instead, validates the active step and advances only when all fields are valid.
   */
  const handleFormKeyDown = (event) => {
    if (event.key === "Enter" && currentStep < totalSteps) {
      event.preventDefault();
      handleNextStep();
    }
  };

  return (
    <main className="rf-page-shell">
      {/* Subtle Ambient SaaS Accents */}
      <div className="rf-ambient-orb rf-ambient-orb--blue" aria-hidden="true" />
      <div className="rf-ambient-orb rf-ambient-orb--violet" aria-hidden="true" />

      <div className="rf-wizard-wrapper">
        <div className="rf-card">
          {/* Branded Card Header */}
          <header className="rf-card-header">
            <div className="rf-brand-row">
              <div className="rf-brand-logo" aria-hidden="true">
                <Layers size={20} strokeWidth={2.3} />
              </div>
              <span className="rf-brand-name">RegiFlow</span>
              <span className="rf-brand-pill">Smart Wizard</span>
            </div>

            <h1 className="rf-brand-tagline">
              Create Your Account in Just 3 Simple Steps.
            </h1>
          </header>

          {/* Conditional View: Success Screen vs Multi-Step Form */}
          {isSubmitted ? (
            <div className="rf-card-body">
              <SuccessScreen
                submittedData={submittedData}
                onStartAgain={handleStartAgain}
              />
            </div>
          ) : (
            <div className="rf-card-body">
              <ProgressBar
                currentStep={currentStep}
                totalSteps={totalSteps}
                isStep1Valid={isStep1Valid}
                isStep2Valid={isStep2Valid}
                onStepSelect={goToStep}
              />

              <form
                onSubmit={handleSubmit(onSubmitRegistration)}
                onKeyDown={handleFormKeyDown}
                noValidate
                className="rf-wizard-form"
              >
                <div
                  key={currentStep}
                  className={`rf-step-stage rf-step-stage--${direction}`}
                >
                  {currentStep === 1 && (
                    <PersonalInfo
                      register={register}
                      errors={errors}
                      formValues={formValues}
                      isStepValid={isStep1Valid}
                      onNext={handleNextStep}
                    />
                  )}

                  {currentStep === 2 && (
                    <AccountDetails
                      register={register}
                      errors={errors}
                      formValues={formValues}
                      isStepValid={isStep2Valid}
                      onBack={handleBackStep}
                      onNext={handleNextStep}
                    />
                  )}

                  {currentStep === 3 && (
                    <ReviewSubmit
                      formValues={formValues}
                      isSubmitting={isSubmitting}
                      onBack={handleBackStep}
                      onEditStep={goToStep}
                    />
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Subtle Card Footer */}
          <footer className="rf-card-footer">
            <Shield size={14} strokeWidth={2.1} aria-hidden="true" />
            <span>
              Client-side React Hook Form &amp; Zod Validation · Prodesk IT Sprint 07
            </span>
          </footer>
        </div>
      </div>
    </main>
  );
}
