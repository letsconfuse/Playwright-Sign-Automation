# Playwright Automation Suite for Zentixs

A professional automation framework developed for the Zentixs digital signature platform. This suite utilizes Playwright to provide robust, scalable, and maintainable end-to-end testing solutions.

## Architecture and Technical Standards

The framework is built upon industry-standard design patterns to ensure reliability and security:

*   **Global Authentication Lifecycle:** Implementation of a dedicated authentication setup (`auth.setup.js`) that manages session persistence. This ensures that authentication occurs once per test cycle, with the resulting state (`auth.json`) shared across the test suite for improved execution speed.
*   **Modular Page Object Model (POM):** Utilization of modern ES6 classes to encapsulate page-specific logic and locators, promoting code reuse and simplifying maintenance.
*   **Environment-Driven Configuration:** Complete separation of configuration and code using environment variables (`.env`). This approach secures sensitive data and facilitates seamless transitions between development, staging, and production environments.
*   **Resilient Element Selection:** Emphasis on user-facing locators (such as role and label) to create tests that are resistant to structural UI changes.
*   **Cross-Platform Compatibility:** Logic designed to be platform-agnostic, ensuring consistent execution across Windows, Linux, and macOS environments through relative path resolution.
*   **Web-First Assertions:** Use of Playwright's built-in auto-waiting and assertions to eliminate the need for arbitrary hard timeouts, resulting in highly stable test execution.

## Getting Started

### Prerequisites

*   Node.js (Version 18 or higher)
*   npm (Node Package Manager)

### Installation

1. Clone the repository to your local machine.
2. Install the project dependencies:
   ```bash
   npm install
   ```
3. Install the required Playwright browsers:
   ```bash
   npx playwright install
   ```

### Environment Configuration

1. Create a `.env` file in the root directory by copying the provided template:
   ```bash
   cp .env.example .env
   ```
2. Define the required environment variables in the `.env` file:
   ```env
   BASE_URL=http://sign.test-zentixs.com/
   USER_EMAIL=your_email@example.com
   USER_PASSWORD=your_password_here
   ```

## Test Execution Commands

| Command | Description |
|---------|-------------|
| `npm test` | Executes all tests in headless mode |
| `npm run test:ui` | Launches the Playwright UI mode for interactive testing |
| `npm run test:debug` | Initiates test execution in debug mode |
| `npm run report` | Displays the generated HTML test report |

## Project Structure

*   `tests/`: Contains test specifications and global setup logic.
*   `pages/`: Contains Page Object Model classes.
*   `data/`: Stores test data and static assets.
*   `playwright.config.js`: Centralized configuration for the Playwright runner.
*   `.env.example`: Template for required environment configurations.

---
This framework is maintained with a focus on technical excellence and structural integrity.
