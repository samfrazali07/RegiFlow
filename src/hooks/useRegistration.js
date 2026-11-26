import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  personalInfoSchema,
  accountDetailsSchema,
  DEFAULT_REGISTRATION_VALUES,
  STEP_FIELDS,
} from "../schemas/registrationSchema";

export const TOTAL_STEPS = 3;

export function useRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState("forward");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    watch,
    trigger,
    handleSubmit,
    reset,
    getValues,
    formState,
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: DEFAULT_REGISTRATION_VALUES,
    shouldUnregister: false,
  });

  const { errors, touchedFields, dirtyFields, isSubmitting } = formState;

  // Watch all fields so step validity and review summary stay synchronized in real time
  const formValues = watch();
  const passwordValue = watch("password");

  // Re-validate confirmPassword immediately whenever password is edited after confirmPassword has input
  useEffect(() => {
    const currentConfirm = getValues("confirmPassword");
    if (currentConfirm && currentConfirm.length > 0) {
      trigger("confirmPassword");
    }
  }, [passwordValue, getValues, trigger]);

  // Real-time Step 1 validity (Personal Information)
  const isStep1Valid = personalInfoSchema.safeParse({
    firstName: formValues.firstName,
    lastName: formValues.lastName,
    dateOfBirth: formValues.dateOfBirth,
  }).success;

  // Real-time Step 2 validity (Account Details + Confirm Password match)
  const isStep2Valid = accountDetailsSchema.safeParse({
    email: formValues.email,
    password: formValues.password,
    confirmPassword: formValues.confirmPassword,
  }).success;

  const isCurrentStepValid =
    currentStep === 1 ? isStep1Valid : currentStep === 2 ? isStep2Valid : isStep1Valid && isStep2Valid;

  /**
   * Validates the active step before advancing to the next conditional view
   */
  const handleNextStep = useCallback(async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    if (!fieldsToValidate) return;

    const passedTrigger = await trigger(fieldsToValidate, { shouldFocus: true });
    if (!passedTrigger) return;

    if (currentStep === 1 && !isStep1Valid) return;
    if (currentStep === 2 && !isStep2Valid) return;

    setDirection("forward");
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  }, [currentStep, trigger, isStep1Valid, isStep2Valid]);

  /**
   * Navigates back to the previous step while keeping all entered form state intact
   */
  const handleBackStep = useCallback(() => {
    if (currentStep <= 1) return;
    setDirection("backward");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, [currentStep]);

  /**
   * Allows jumping back to an earlier completed step (e.g., from Step 3 Review or ProgressBar)
   */
  const goToStep = useCallback(
    (targetStep) => {
      if (targetStep < 1 || targetStep > TOTAL_STEPS || targetStep === currentStep) {
        return;
      }

      if (targetStep < currentStep) {
        setDirection("backward");
        setCurrentStep(targetStep);
        return;
      }

      // Only allow moving forward if intermediate steps are completely valid
      if (targetStep === 2 && isStep1Valid) {
        setDirection("forward");
        setCurrentStep(2);
      } else if (targetStep === 3 && isStep1Valid && isStep2Valid) {
        setDirection("forward");
        setCurrentStep(3);
      }
    },
    [currentStep, isStep1Valid, isStep2Valid]
  );

  /**
   * Final form submission handler (runs only after full Zod schema validation passes)
   */
  const onSubmitRegistration = useCallback(
    (validData) => {
      const finalizedObject = {
        firstName: validData.firstName.trim(),
        lastName: validData.lastName.trim(),
        dateOfBirth: validData.dateOfBirth,
        email: validData.email.trim(),
        password: validData.password,
        submittedAt: new Date().toISOString(),
      };

      // Mandatory Sprint 07 Requirement: Log finalized data object to browser console
      console.log("RegiFlow – Finalized Registration Data:", finalizedObject);

      setSubmittedData(finalizedObject);
      setIsSubmitted(true);
    },
    []
  );

  /**
   * Resets all form fields, validation errors, submission state, and returns to Step 1
   */
  const handleStartAgain = useCallback(() => {
    reset(DEFAULT_REGISTRATION_VALUES, {
      keepErrors: false,
      keepDirty: false,
      keepTouched: false,
      keepIsSubmitted: false,
      keepSubmitCount: false,
    });
    setSubmittedData(null);
    setIsSubmitted(false);
    setDirection("backward");
    setCurrentStep(1);
  }, [reset]);

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    direction,
    isSubmitted,
    submittedData,
    register,
    watch,
    trigger,
    handleSubmit,
    formState,
    errors,
    touchedFields,
    dirtyFields,
    isSubmitting,
    formValues,
    isStep1Valid,
    isStep2Valid,
    isCurrentStepValid,
    handleNextStep,
    handleBackStep,
    goToStep,
    onSubmitRegistration,
    handleStartAgain,
  };
}
