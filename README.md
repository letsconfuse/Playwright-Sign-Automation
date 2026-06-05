# Playwright End-to-End & API Automation Suite

This repository contains a professional-grade, enterprise-ready automation framework built with **Playwright**, designed for testing the Zentixs digital signature platform.

This suite is structured according to modern software development standards to showcase advanced QA automation skills, including session management, modular page objects, API integration, target-specific testing pipelines, linting, and automated continuous integration (CI/CD).

---

## 🛠️ Architecture and Technical Standards

The framework implements advanced architecture patterns to ensure reliability, security, and velocity:

*   **Global Authentication Lifecycle (`auth.setup.js`):** Sessions are authenticated once per execution run. The resulting authentication state (`auth.json`) is captured and shared across UI tests, bypassing repetitive login steps and accelerating test runs.
*   **Modular Page Object Model (POM):** Locators and actions are strictly encapsulated in modular classes (`pages/`), separating test logic from page layout. Tests only call high-level methods, making code changes easy to manage if the UI changes.
*   **Segmented Test Categories:** Tests are tagged with `@smoke` and `@regression` and split into logical projects: E2E (UI) tests and API tests.
*   **API Automation Integration:** Features a native Playwright API testing suite that bypasses the browser to test RESTful backend endpoints directly, demonstrating full-stack testing capabilities.
*   **Environment-Driven Config (`.env`):** Secrets (credentials, URLs) are injected via env variables, preventing sensitive info from being committed to source control.
*   **Continuous Integration (CI):** Fully integrated with a GitHub Actions workflow that executes the test suite on every pull request (PR) and push.
*   **Code Quality Pipelines:** Leverages **ESLint** (with Playwright rules) and **Prettier** to enforce formatting consistency and prevent coding anti-patterns.

---

## 📁 Repository Structure

```text
Playwright-Sign-Automation/
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions CI/CD workflow
├── data/
│   └── testData.json            # Centralized test data profiles
├── pages/                       # Page Object Models (POM)
│   ├── loginPage.js             # Encapsulates login & session conflict modal
│   ├── dashboardPage.js         # Sidebar/header navigation
│   ├── signPage.js              # Upload form and recipient configuration
│   ├── editorPage.js            # Drag & drop field editor canvas & submission
│   ├── trashPage.js             # Restoration and trash list management
│   ├── settingsPage.js          # Profile settings and signature configuration
│   └── historyPage.js           # Document history logs and audit reports
├── tests/                       # Test suites
│   ├── setup/
│   │   └── auth.setup.js        # Global authentication setup
│   ├── e2e/                     # End-to-End User Interface tests
│   │   ├── send-for-sign.spec.js# UI workflow: Send for signature (@smoke, @regression)
│   │   ├── sign-yourself.spec.js # UI workflow: Sign yourself (@regression)
│   │   ├── document-actions.spec.js # Document history & trash restoration (@regression)
│   │   └── settings.spec.js     # User signature profile configuration (@regression)
│   └── api/                     # REST API test cases
│       └── api-example.spec.js  # Playwright Request API automation (@api)
├── .eslintrc.json               # ESLint code quality configuration
├── .prettierrc                  # Code formatting guidelines
├── playwright.config.js         # Centralized Playwright configuration
├── package.json                 # Project dependencies and runner scripts
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
*   **Node.js** (v18 or higher)
*   **npm** (Node Package Manager)

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

Install the Playwright browser binaries and their system dependencies:
```bash
npx playwright install --with-deps
```

### 3. Environment Setup
Copy the template environment file:
```bash
cp .env.example .env
```
Open `.env` and fill in the target URL and valid test account credentials:
```env
BASE_URL=http://sign.test-zentixs.com/
USER_EMAIL=your_email@example.com
USER_PASSWORD=your_password_here
```

---

## 💻 Test Execution

This project defines specific NPM scripts to run tests by project, tag, or debug mode:

### Running Specific Suites
| Command | Tag/Project | Description |
|---------|-------------|-------------|
| `npm run test:smoke` | `@smoke` | Runs only fast, high-priority verification tests |
| `npm run test:regression` | `@regression` | Runs the full regression suite |
| `npm run test:api` | `api` Project | Runs API-only test suites, bypassing browser start-up |
| `npm run test:e2e` | `e2e-chromium` | Runs UI E2E tests only |
| `npm test` | All | Runs the entire test suites (API + E2E UI) |

### Interactive & Debugging Modes
| Command | Mode | Description |
|---------|------|-------------|
| `npm run test:ui` | UI Mode | Opens the interactive test runner with time-travel debugging |
| `npm run test:debug` | Debugger | Launches test execution with step-by-step code pauses |
| `npm run report` | Report | Serves the interactive HTML test execution report |

### Code Style Validation
| Command | Tool | Description |
|---------|------|-------------|
| `npm run lint` | ESLint | Audits codebase for syntax errors and code smells |
| `npm run lint:fix` | ESLint | Fixes auto-resolvable lint issues |
| `npm run format` | Prettier | Formats code styling consistency globally |

---

## 🔄 CI/CD Pipeline (GitHub Actions)

A CI/CD pipeline is configured in `.github/workflows/playwright.yml` that triggers on **every Push and Pull Request** targeting `main` or `master`.

### Key Features of the Pipeline:
1.  **Fast Feedback Loop:** Installs dependencies and browser binaries efficiently using Node.js caching.
2.  **Graceful Secrets Handling:** If repository secrets (`USER_EMAIL`, `USER_PASSWORD`) are not populated (e.g. on community-contributed fork PRs), the pipeline dynamically runs **API tests only**. This avoids breaking the build for external reviewers while guaranteeing E2E checks run on internal branches.
3.  **HTML Test Artifacts:** Generates and publishes the Playwright HTML Test Report on every run (success or failure). Reports are kept as artifacts for 14 days, allowing developers to inspect logs, video recordings, and screenshots of failures.
