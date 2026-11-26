# Prompts & Engineering Log – RegiFlow (Prodesk IT Sprint 07)

**Project:** RegiFlow – Smart Registration Wizard  
**Assignment:** Prodesk IT – Sprint 07 | Phase 3: Core Engineering  
**Architecture:** React + Vite + JavaScript (`.jsx` / `.js`) + React Hook Form + Zod + CSS3 + Lucide React  

---

## 1. AI Tools Used

- **AI Coding Assistant (Workspace Agent):** Used for workspace inspection, component scaffolding, Zod v4 schema design, React Hook Form state management integration, CSS3 SaaS styling, and automated DOM verification scripting.

---

## 2. Actual Development Prompt

The project was initiated using the Prodesk IT Sprint 07 Master Prompt specifying:

1. **Technology Stack:** React.js, Vite, JavaScript (not TypeScript), `react-hook-form`, `zod`, `@hookform/resolvers`, pure CSS3, and `lucide-react` icons (no Redux, no React Router for wizard steps, no backend/database).
2. **UI/UX Design:** Centered SaaS registration card on a clean white canvas with subtle light-blue and violet accents, branding **RegiFlow**, tagline *"Create Your Account in Just 3 Simple Steps."*, dynamic progress bar (`Step 1 of 3` to `Step 3 of 3`), responsive design, inline validation errors, and an animated success screen.
3. **Three Conditional Wizard Steps:**
   - **Step 1 – Personal Information:** First Name, Last Name, Date of Birth (valid characters, valid calendar date, future dates disallowed, disabled `Next` button until valid).
   - **Step 2 – Account Details:** Email Address, Password (8+ chars, uppercase, lowercase, number), Confirm Password (exact match via Zod refinement), independent Show/Hide toggles (`Eye` / `EyeOff`), and disabled `Next` button until valid.
   - **Step 3 – Review & Submit:** Summary of Personal Information and Account Information (with Password masked), `Back` button preserving state, and `Submit Registration` logging finalized data via `console.log()` before rendering `SuccessScreen` with a `Start Again` full reset button.
4. **React Hook Form Configuration:** `useForm()` in parent state with `mode: "onChange"`, `reValidateMode: "onChange"`, `defaultValues`, and `shouldUnregister: false`.

---

## 3. Actual Errors & Diagnostics Encountered During Session

> Note: Only real issues encountered during actual workspace inspection, build verification, and automated DOM testing in this session are recorded below.

### Issue 1: Pre-existing TypeScript Template vs. JavaScript Project Requirement
- **Context:** Workspace inspection revealed an existing Vite template configured with `tsconfig.json` (`"strict": true`, without `"allowJs"`), `index.html` pointing to `/src/main.tsx`, and `src/App.tsx` as the root entry point, whereas Sprint 07 requires JavaScript (`.js` / `.jsx`) modules.
- **Solution Implemented:**
  - Enabled `"allowJs": true` in `tsconfig.json`.
  - Built the entire application in JavaScript (`src/schemas/registrationSchema.js`, `src/hooks/useRegistration.js`, `src/pages/RegistrationWizard.jsx`, `src/components/*.jsx`, `src/App.jsx`, `src/main.jsx`).
  - Delegated `src/App.tsx` cleanly to `src/App.jsx` so both `npx tsc --noEmit` and `npm run build` succeed with zero errors.

### Issue 2: Verifying Zod v4 (`^4.6.7`) Compatibility with `@hookform/resolvers` (`^7.0.7`)
- **Context:** Installing `zod` and `@hookform/resolvers` installed Zod v4 (`4.6.7`) and `@hookform/resolvers` (`7.0.7`). Because Zod v4 changed internal schema structures (`_zod`) compared to Zod v3, we inspected `node_modules/@hookform/resolvers/zod/dist/zod.mjs` and ran a Node verification script before building UI components.
- **Verification Prompt / Command Executed:** Tested `personalInfoSchema`, `accountDetailsSchema`, `registrationSchema`, and `zodResolver(registrationSchema)` directly in Node against 10 edge cases (empty fields, numeric characters in names, future date `2099-01-01`, invalid non-leap date `2025-02-29`, malformed email, weak password, mismatched confirm password, and valid payload).
- **Result:** Confirmed native Zod v4 support in `@hookform/resolvers` v7.0.7 with deterministic field-level error mapping.

### Issue 3: Automated Headless DOM Verification Issues in Sandbox
- **Context:** While executing automated end-to-end verification of the rendered React 19 application in Node using `happy-dom`:
  1. Writing `dist/index.html` into `happy-dom` initially left `#root` empty because `happy-dom` disables inline `<script type="module">` evaluation by default (`ROOT HTML LENGTH: 0`), and Node's VM context requires `--experimental-vm-modules`.
  2. Attempting Vite's `ssrLoadModule("react")` threw `ReferenceError: module is not defined` because `react/index.js` uses CommonJS `module.exports`.
  3. Bundling the test harness with `esbuild --node-paths=...` failed with `Invalid build flag: "--node-paths=..."` because `esbuild` expects `NODE_PATH` as an environment variable rather than a CLI flag.
  4. Once compiled with `NODE_PATH="$(pwd)/node_modules"`, the test script completed all assertions in `< 1s` but waited at the end until `domWindow.happyDOM.close()` / explicit exit closed `happy-dom`'s open event loop handles.
- **Solution Implemented:** Compiled the test entry with `NODE_PATH` + `esbuild`, mounted `<RegistrationWizard />` with `react-dom/client` inside `React.act()`, verified all 15 Sprint 07 scenarios, and closed `domWindow.happyDOM.close()` cleanly.

---

## 4. Key Technical & Architectural Decisions

1. **Parent-Level `useForm` with `shouldUnregister: false` (`src/hooks/useRegistration.js`):**
   - Because Steps 1, 2, and 3 use conditional rendering (`currentStep === 1`, `2`, `3`) without React Router or Redux, unmounting `<PersonalInfo />` when moving to `<AccountDetails />` could discard field values if inputs unregistered on unmount. Setting `shouldUnregister: false` alongside explicit `defaultValues` guarantees 100% state persistence across forward/backward navigation.
2. **Per-Step Validity vs. Global `formState.isValid`:**
   - When a single `registrationSchema` validates all 6 fields, React Hook Form's global `formState.isValid` stays `false` on Step 1 because Step 2 fields (`email`, `password`, `confirmPassword`) are still empty.
   - To accurately disable the `Next` button per step in real time, `useRegistration` evaluates `personalInfoSchema.safeParse(...)` for Step 1 and `accountDetailsSchema.safeParse(...)` for Step 2 on watched values, and pairs this with `await trigger(STEP_FIELDS[currentStep])` on click.
3. **Cross-Field Password Re-Validation Without Infinite Loops:**
   - In React Hook Form, if a user enters matching `password` and `confirmPassword` and then edits `password`, `confirmPassword` must immediately re-validate to flag the mismatch.
   - A targeted `useEffect` watches `password` and calls `trigger("confirmPassword")` only when `confirmPassword` already contains characters—updating error state immediately without mutating values or causing re-render loops.
4. **Timezone-Safe Future Date & Calendar Validation (`src/schemas/registrationSchema.js`):**
   - Comparing `new Date("YYYY-MM-DD")` (parsed as UTC midnight) against `new Date()` causes off-by-one timezone bugs depending on user offset.
   - `getTodayLocalISO()` builds `YYYY-MM-DD` from local `getFullYear()`, `getMonth() + 1`, and `getDate()`, while `parseValidCalendarDate()` validates real calendar dates (e.g., rejecting `2025-02-29`) via UTC component comparison.
5. **Preventing Accidental Browser Page Reloads:**
   - All `Next`, `Back`, `Edit`, `Start Again`, and password visibility toggle buttons explicitly declare `type="button"`.
   - `handleFormKeyDown` intercepts `Enter` key presses on Steps 1 and 2 with `event.preventDefault()` and triggers step validation instead of submitting the unfinished form.
