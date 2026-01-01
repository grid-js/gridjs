# End-to-End Testing for Grid.js Interactive Documentation

## Overview
This repository contains a comprehensive **End-to-End (E2E) testing suite** for the **Grid.js Interactive Documentation Website**, built using **Playwright**.

The purpose of this test suite is to continuously validate critical interactive features demonstrated in the Grid.js documentation and to help prevent regressions that could negatively impact developer experience and trust.

---

## Background
Grid.js is an open-source JavaScript table plugin whose documentation website showcases live, interactive examples such as searching, sorting, pagination, and live configuration.

Because these demos reflect real-world usage, regressions in the documentation can be easily mistaken as core library failures. This E2E test suite acts as a safety net to ensure the stability and correctness of those interactive examples.

---

## Objectives
- Validate core interactive behaviors in the documentation site
- Detect regressions caused by UI or internal logic changes
- Reduce reliance on manual verification
- Improve long-term maintainability of interactive demos
- Ensure consistent behavior across major browsers

---

## Features & Test Coverage

### Functional Coverage
The test suite covers the following key features:

- **Global Search**
  - Input handling and filtering behavior
  - Asynchronous update validation

- **Column Sorting**
  - Ascending and descending ordering
  - Numeric and string sorting validation

- **Pagination**
  - Page navigation
  - Row count consistency

- **Live Editor**
  - Real-time configuration updates
  - Table re-rendering behavior

### Non-Functional Coverage
- Cross-browser compatibility (Chromium, Firefox, WebKit)
- Stability against asynchronous client-side rendering
- Deterministic and repeatable test execution

---

## Handling Dynamic Client-Side Data
Some Grid.js documentation demos rely on dynamically generated client-side data. To ensure stable and repeatable E2E tests, this test suite:

- Controls the data used by documentation demos
- Validates behavior against predictable, deterministic datasets
- Uses logic-based assertions rather than fragile text comparisons

This approach prevents flaky tests while remaining faithful to real user interactions.

---

## Technical Approach
- **Framework:** Playwright
- **Architecture:** Page Object Model (POM)
- **Selectors:** User-centric locators (role- and text-based)
- **Assertions:** Logic-driven validation of table behavior
- **Waiting Strategy:** Native Playwright auto-waiting and explicit UI state checks

---

## Setup

### Prerequisites
- **Node.js** v16 or later
- **npm** or **yarn**
- Git

### Installation
Clone the Grid.js repository and install all required dependencies:

```
$ npm install
```

### Local Development

```
$ npm run start
```

### Run the tests

```
$ npx playwright test
```
