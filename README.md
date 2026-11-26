# RegiFlow – Smart Registration Wizard

> *"Create Your Account in Just 3 Simple Steps."*  
> **Prodesk IT – Sprint 07 | Phase 3: Core Engineering**

**RegiFlow** is a production-grade, multi-step SaaS registration wizard built with **React**, **Vite**, **JavaScript**, **React Hook Form**, **Zod**, **CSS3**, and **Lucide React Icons**. It demonstrates resilient client-side schema validation, persistent multi-step state management via conditional rendering, dynamic progress tracking, accessible password controls, and responsive SaaS UI engineering.

---

## Key Features

### Priority 1 – Core Mandatory Engineering
- **3-Step Conditional Wizard (No React Router / No Redux):**
  - **Step 1 – Personal Information:** First Name, Last Name, and Date of Birth with valid character checks, calendar verification, and future-date prevention.
  - **Step 2 – Account Details:** Email Address, Password (8+ chars, uppercase, lowercase, number), Confirm Password exact matching, and independent Show/Hide toggles (`Eye` / `EyeOff`).
  - **Step 3 – Review & Submit:** Structured summary of Personal and Account Information (with masked password display), `Back` navigation with 100% state persistence, and `Submit Registration` logging finalized data via `console.log()`.
- **React Hook Form Architecture:** Configured in parent hook (`useRegistration.js`) with `mode: "onChange"`, `reValidateMode: "onChange"`, `defaultValues`, and `shouldUnregister: false`.
- **Zod Schema Validation:** Modular schemas (`personalInfoSchema`, `accountDetailsSchema`, and `registrationSchema`) integrated via `zodResolver` with cross-field `.superRefine()` password confirmation.
- **Dynamic Progress Indicator:** Displays `"Step X of 3"`, completion percentage, smooth animated gradient fill bar, and distinct Upcoming / Active / Completed step styling.
- **Animated Success Screen:** Displays animated success badge, `"Registration Completed!"`, `"Your information has been successfully submitted."`, validation pass confirmation, and a `Start Again` full-reset action.

### Priority 2 – Enhanced SaaS UX
- **Live Password Strength Meter & Interactive 4-Rule Checklist** on Step 2.
- **Real-Time Cross-Field Password Re-Validation** when `password` is edited after `confirmPassword` was entered.
- **Formatted Date & Calculated Age Helper** on Step 1 and Step 3.
- **Quick-Edit Section Links** on Step 3 (`Edit` buttons on Personal Info and Account Info cards) plus clickable completed step nodes in the Progress Bar.
- **Enter-Key Page Reload Protection** on Steps 1 and 2 (`event.preventDefault()` + step validation).

---

## Project Structure

```text
├── Prompts.md
├── README.md
├── index.html
├── package.json
└── src/
    ├── components/
    │   ├── AccountDetails.jsx
    │   ├── FormInput.jsx
    │   ├── PersonalInfo.jsx
    │   ├── ProgressBar.jsx
    │   ├── ReviewSubmit.jsx
    │   └── SuccessScreen.jsx
    ├── hooks/
    │   └── useRegistration.js
    ├── pages/
    │   └── RegistrationWizard.jsx
    ├── schemas/
    │   └── registrationSchema.js
    ├── styles/
    │   ├── global.css
    │   ├── responsive.css
    │   └── wizard.css
    ├── App.jsx
    └── main.jsx
```

---

## Getting Started Locally

### 1. Install Dependencies
```bash
npm install
# Core packages installed:
# npm install react-hook-form zod @hookform/resolvers lucide-react
```

### 2. Start Development Server
```bash
npm run dev
```
Open the local URL displayed in your terminal (typically `http://localhost:5173`).

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Bundle
```bash
npm run preview
```

---

## Deployment Guide

### Push to GitHub
```bash
git init
git add .
git commit -m "feat: implement RegiFlow 3-step registration wizard (Prodesk Sprint 07)"
git branch -M main
git remote add origin https://github.com/<your-username>/regiflow-registration-wizard.git
git push -u origin main
```

### Deploy on Vercel
1. Sign in to [vercel.com](https://vercel.com) and click **Add New... → Project**.
2. Import your `regiflow-registration-wizard` GitHub repository.
3. Verify the auto-detected build settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. Because all step transitions use conditional rendering rather than client-side URL routes, no custom rewrite rules are needed.
