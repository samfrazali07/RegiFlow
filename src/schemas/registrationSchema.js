import { z } from "zod";

/**
 * Returns today's date in the user's local timezone formatted as YYYY-MM-DD.
 * Using local calendar components avoids UTC offset bugs around midnight.
 */
export function getTodayLocalISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Validates that a YYYY-MM-DD string represents an actual calendar date
 * (e.g., rejects non-existent dates such as Feb 30 or invalid formats).
 */
export function parseValidCalendarDate(dateString) {
  if (typeof dateString !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return null;
  }

  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const isRealCalendarDate =
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() + 1 === month &&
    utcDate.getUTCDate() === day;

  if (!isRealCalendarDate) {
    return null;
  }

  return { year, month, day };
}

/**
 * Calculates age in completed years from a valid YYYY-MM-DD date string.
 */
export function calculateAgeFromISO(dateString) {
  const parsed = parseValidCalendarDate(dateString);
  if (!parsed) return null;

  const today = new Date();
  let age = today.getFullYear() - parsed.year;
  const monthDiff = today.getMonth() + 1 - parsed.month;

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsed.day)) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

/**
 * Formats a YYYY-MM-DD string into a human-friendly label (e.g., "May 14, 2001").
 */
export function formatDisplayDate(dateString) {
  const parsed = parseValidCalendarDate(dateString);
  if (!parsed) return dateString || "—";

  const date = new Date(parsed.year, parsed.month - 1, parsed.day);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const VALID_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ' -]*$/;

const firstNameSchema = z
  .string()
  .min(1, "First Name is required.")
  .refine((val) => val.trim().length > 0, {
    message: "First Name cannot contain only whitespace.",
  })
  .regex(
    VALID_NAME_REGEX,
    "First Name must contain valid letters only (no numbers or special symbols)."
  )
  .max(50, "First Name cannot exceed 50 characters.");

const lastNameSchema = z
  .string()
  .min(1, "Last Name is required.")
  .refine((val) => val.trim().length > 0, {
    message: "Last Name cannot contain only whitespace.",
  })
  .regex(
    VALID_NAME_REGEX,
    "Last Name must contain valid letters only (no numbers or special symbols)."
  )
  .max(50, "Last Name cannot exceed 50 characters.");

const dateOfBirthSchema = z
  .string()
  .min(1, "Date of Birth is required.")
  .superRefine((val, ctx) => {
    if (!val) return;

    const parsed = parseValidCalendarDate(val);
    if (!parsed) {
      ctx.addIssue({
        code: "custom",
        message: "Please enter a valid Date of Birth.",
      });
      return;
    }

    if (parsed.year < 1900) {
      ctx.addIssue({
        code: "custom",
        message: "Date of Birth must be in the year 1900 or later.",
      });
      return;
    }

    const todayISO = getTodayLocalISO();
    if (val > todayISO) {
      ctx.addIssue({
        code: "custom",
        message: "Future dates are not allowed for Date of Birth.",
      });
    }
  });

export const emailFieldSchema = z
  .string()
  .min(1, "Email Address is required.")
  .refine((val) => val.trim().length > 0, {
    message: "Email Address is required.",
  })
  .email("Please enter a valid email address (e.g., name@domain.com).");

export const passwordFieldSchema = z
  .string()
  .min(1, "Password is required.")
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
  .regex(/[a-z]/, "Password must include at least one lowercase letter.")
  .regex(/[0-9]/, "Password must include at least one number.");

const emailSchema = emailFieldSchema;
const passwordSchema = passwordFieldSchema;

const confirmPasswordSchema = z
  .string()
  .min(1, "Confirm Password is required.");

/**
 * Step 1 Schema: Personal Information
 */
export const personalInfoSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  dateOfBirth: dateOfBirthSchema,
});

/**
 * Base Step 2 object fields (before cross-field password matching)
 */
const accountDetailsFields = {
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
};

/**
 * Reusable cross-field password confirmation refinement
 */
function validatePasswordMatch(data, ctx) {
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    });
  }
}

/**
 * Step 2 Schema: Account Details (including Confirm Password matching)
 */
export const accountDetailsSchema = z
  .object(accountDetailsFields)
  .superRefine(validatePasswordMatch);

/**
 * Complete Registration Schema (Step 1 + Step 2 + cross-field validation)
 * Integrated with React Hook Form via zodResolver(registrationSchema).
 */
export const registrationSchema = personalInfoSchema
  .merge(z.object(accountDetailsFields))
  .superRefine(validatePasswordMatch);

/**
 * Default values for all fields in React Hook Form
 */
export const DEFAULT_REGISTRATION_VALUES = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  password: "",
  confirmPassword: "",
};

/**
 * Field names grouped by wizard step for targeted RHF trigger() validation
 */
export const STEP_FIELDS = {
  1: ["firstName", "lastName", "dateOfBirth"],
  2: ["email", "password", "confirmPassword"],
};

/**
 * Evaluates live password rules & strength indicator for Step 2 UI feedback
 */
export function evaluatePasswordChecks(password = "") {
  const checks = [
    {
      id: "length",
      label: "At least 8 characters",
      passed: password.length >= 8,
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter (A–Z)",
      passed: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "At least one lowercase letter (a–z)",
      passed: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "At least one number (0–9)",
      passed: /[0-9]/.test(password),
    },
  ];

  const passedCount = checks.filter((item) => item.passed).length;

  let strengthLabel = "Enter a password";
  let strengthTone = "idle";

  if (password.length > 0) {
    if (passedCount <= 1) {
      strengthLabel = "Weak";
      strengthTone = "weak";
    } else if (passedCount === 2) {
      strengthLabel = "Fair";
      strengthTone = "fair";
    } else if (passedCount === 3) {
      strengthLabel = "Good";
      strengthTone = "good";
    } else if (passedCount === 4 && password.length >= 12) {
      strengthLabel = "Very Strong";
      strengthTone = "strong";
    } else {
      strengthLabel = "Strong";
      strengthTone = "strong";
    }
  }

  return {
    checks,
    passedCount,
    totalChecks: checks.length,
    isAllPassed: passedCount === checks.length,
    strengthLabel,
    strengthTone,
  };
}
