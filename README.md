# Playwright Sign Automation (Beast Mode 🚀)

A high-standard, professional-grade Playwright automation suite for the Zentixs Digital Signature platform. This project has been standardized with enterprise-level best practices for reliability, speed, and security.

## 🏗️ Architecture & Standards

This project follows the **"Beast Mode"** standard:
- **Global Authentication:** Uses `auth.setup.js` to authenticate once and share session state (`auth.json`) across all tests.
- **Page Object Model (POM):** Modern ES6 Class-based architecture for better maintainability.
- **Environment Management:** Zero hardcoding. All configurations and credentials are managed via `.env` files.
- **Resilient Locators:** Prioritizes User-Facing Locators (`getByRole`, `getByLabel`) over fragile CSS/XPath selectors.
- **Cross-Platform:** Relative path handling ensures tests run seamlessly on Windows, Linux (Termux), and macOS.
- **Zero-Flakiness:** Replaced arbitrary timeouts with Web-First Assertions.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Installation
```bash
npm install
npx playwright install
```

### 3. Environment Setup
The project uses environment variables for secure credential management.
1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your actual credentials:
   ```env
   BASE_URL=http://sign.test-zentixs.com/
   USER_EMAIL=your_email@example.com
   USER_PASSWORD=your_password_here
   ```

## 🧪 Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Runs all tests in headless mode |
| `npm run test:ui` | Opens Playwright Interactive UI Mode |
| `npm run test:debug` | Runs tests in Debug Mode |
| `npm run report` | Shows the last HTML test report |

## 📁 Project Structure

```text
├── tests/               # Test specifications
│   ├── auth.setup.js    # Global authentication setup
│   └── ...              # Functional test suites
├── pages/               # Page Object Models
├── data/                # Test data and assets
├── playwright.config.js # Centralized configuration
├── .env                 # Secrets (ignored by git)
└── .env.example         # Template for environment variables
```

---
*Created with focus on reliability and security.*
