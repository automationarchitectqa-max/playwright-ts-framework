# Playwright TypeScript Framework

> **Enterprise-grade Playwright + TypeScript test automation framework**
> Modular architecture · Type-safe · API & UI testing · Data-driven · CI/CD ready

---

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [API Testing Flow](#api-testing-flow)
4. [UI Testing Flow](#ui-testing-flow)
5. [Packages Overview](#packages-overview)
6. [Installation](#installation)
7. [Running Tests](#running-tests)
8. [Best Practices](#best-practices)

---

## Overview

A production-ready test automation framework built on **Playwright** and **TypeScript**. Supports both **API** and **UI** testing with a clean, modular, layered architecture.

### Key Features
- **Dual-layer testing**: API + UI testing in single framework
- **Type-safe**: Full TypeScript with strict type checking
- **Fixtures**: Reusable test setup/teardown (equivalent to TestNG hooks)
- **Data-driven**: YAML-based test data for different environments (dev, staging, prod)
- **Page Object Model**: Organized UI automation with reusable page objects
- **API Client**: Centralized HTTP client for API testing
- **Mock Server**: Built-in mock server for integration testing
- **Comprehensive Reporting**: Allure, HTML, and JUnit reports
- **CI/CD Ready**: Jenkins and GitHub Actions integration

---

## Project Structure

```
playwright-ts-framework/
│
├── src/                                    # Source code
│   │
│   ├── api/                               # API Testing Layer
│   │   ├── client/
│   │   │   └── api-client.ts             # HTTP client
│   │   ├── services/                      # API service layer (auth, user, etc.)
│   │   ├── pojos/                         # Data models (POJOs)
│   │   │   ├── anime-status.model.ts
│   │   │   ├── product.model.ts
│   │   │   ├── product-request.model.ts
│   │   │   └── product-response.model.ts
│   │   └── assertions/
│   │       └── api-assertions.ts          # API assertion helpers
│   │
│   ├── ui/                                # UI Testing Layer
│   │   ├── pages/                         # Page objects
│   │   │   ├── base.page.ts              # Base page class
│   │   │   ├── login.page.ts
│   │   │   ├── products.page.ts
│   │   │   └── cart.page.ts
│   │   ├── components/
│   │   │   └── header.component.ts        # Reusable UI components
│   │   └── assertions/
│   │       └── ui-assertions.ts           # UI assertion helpers
│   │
│   ├── core/                              # Core configuration & fixtures
│   │   ├── config/
│   │   │   ├── env/                       # Environment configurations
│   │   │   │   ├── .env
│   │   │   │   ├── .env.dev
│   │   │   │   ├── .env.staging
│   │   │   │   └── .env.prod
│   │   │   ├── global-setup.ts           # Global test setup
│   │   │   └── global-teardown.ts        # Global test teardown
│   │   ├── fixtures/
│   │   │   ├── api.fixtures.ts           # API fixtures (beforeEach/afterEach)
│   │   │   ├── ui.fixtures.ts            # UI fixtures (beforeEach/afterEach)
│   │   │   └── index.ts
│   │   └── utils/                        # Shared utilities
│   │   │    ├── data-provider.ts         # Load YAML test data
│   │   │    ├── logger.ts                # Custom logging
│   │   │    ├── report-helper.ts         # Allure report helpers
│   │   │    └── string-utils.ts          # String utilities
│   │   └── scripts/
│   │        └── playwright-env.js        # Environment setup
│   │
│   ├── helpers/
│   │   └── test-helper.ts                # Common test utilities
│   │
│   └── mock/
│       └── mock-server.ts                # Mock API server
│
├── tests/                                 # Test specifications
│   ├── api/                               # API test specs
│   │   ├── anime-status.spec.ts
│   │   └── products.spec.ts
│   ├── ui/                                # UI test specs
│   │   ├── login.spec.ts
│   │   └── products.spec.ts
│   └── e2e/                               # End-to-end test specs
│       └── shopping-flow.spec.ts
│
├── test-data/                             # Test data files
│   ├── api/
│   │   └── dev/                           # Dev environment test data
│   │       ├── anime-status.yaml
│   │       ├── products.yaml
│   │       └── sample-data.yaml
│   └── ui/                                # UI test data
│
│
├── playwright.config.ts                   # Playwright configuration
├── tsconfig.json                          # TypeScript configuration
├── .eslintrc.json                         # ESLint configuration
├── package.json                           # Dependencies & scripts
├── Jenkinsfile                            # Jenkins CI/CD pipeline
└── README.md                              # This file
```

---

## API Testing Flow

```
1. Test Session Start
   └─ global-setup.ts (runs once before all tests)
      ├─ Load environment variables (.env.dev)
      ├─ Initialize logger
      ├─ Start mock server (if needed)
      └─ Setup test database/users

2. Test Execution (for each API test)
   │
   ├─ API Fixtures Setup (beforeEach)
   │  ├─ Create new API client instance
   │  ├─ Set base URL from environment config
   │  └─ Initialize API services (Auth, User, etc.)
   │
   ├─ Test Runs
   │  ├─ Load test data from YAML
   │  │  └─ test-data/api/dev/anime-status.yaml
   │  │
   │  ├─ Call API via Service
   │  │  ├─ e.g., UserService.getUser(id)
   │  │  │
   │  │  ├─ API Client handles:
   │  │  │  ├─ Build HTTP request
   │  │  │  ├─ Add authentication headers
   │  │  │  ├─ Make HTTP call
   │  │  │  ├─ Measure response time
   │  │  │  └─ Return response
   │  │  │
   │  │  └─ Response deserialized to POJO
   │  │     └─ anime-status.model.ts (type-safe)
   │  │
   │  ├─ Validate Response
   │  │  ├─ Assert HTTP status code
   │  │  ├─ Assert response body (api-assertions.ts)
   │  │  ├─ Assert response schema
   │  │  └─ Verify response time within threshold
   │  │
   │  └─ Report
   │     ├─ Add step to Allure report
   │     ├─ Attach response data
   │     └─ Log latency metrics
   │
   ├─ API Fixtures Teardown (afterEach)
   │  ├─ Close HTTP connections
   │  └─ Cleanup resources
   │
   └─ Repeat for next test

3. Test Session End
   └─ global-teardown.ts (runs once after all tests)
      ├─ Stop mock server
      ├─ Close database connections
      ├─ Generate final reports
      └─ Cleanup temporary files
```

---

## UI Testing Flow

```
1. Test Session Start
   └─ global-setup.ts (runs once before all tests)
      ├─ Load environment variables (.env.dev)
      ├─ Set base URL for browser
      └─ Initialize test database/users

2. Test Execution (for each UI test)
   │
   ├─ UI Fixtures Setup (beforeEach)
   │  ├─ Launch browser (Chromium/Firefox/WebKit)
   │  ├─ Create browser context
   │  ├─ Create new page
   │  └─ Initialize page objects (LoginPage, ProductsPage, etc.)
   │
   ├─ Test Runs
   │  ├─ Load test data (credentials, test URLs, etc.)
   │  │
   │  ├─ Navigate to Application
   │  │  └─ page.goto(baseURL)
   │  │
   │  ├─ Interact with UI using Page Objects
   │  │  ├─ LoginPage
   │  │  │  ├─ Fill username input
   │  │  │  ├─ Fill password input
   │  │  │  └─ Click login button
   │  │  │
   │  │  ├─ ProductsPage
   │  │  │  ├─ Search for product
   │  │  │  ├─ Filter by category
   │  │  │  ├─ Get product details
   │  │  │  └─ Add to cart
   │  │  │
   │  │  ├─ CartPage
   │  │  │  ├─ Verify cart items
   │  │  │  ├─ Update quantities
   │  │  │  └─ Proceed to checkout
   │  │  │
   │  │  └─ Header Component
   │  │     ├─ Get cart count
   │  │     ├─ Get username
   │  │     └─ Click logout
   │  │
   │  ├─ Assertions using ui-assertions.ts
   │  │  ├─ Assert element is visible
   │  │  ├─ Assert element text
   │  │  ├─ Assert page URL
   │  │  └─ Assert element count
   │  │
   │  └─ Report
   │     ├─ Take screenshots (always on failure)
   │     ├─ Record video (optional)
   │     └─ Add steps to Allure report
   │
   ├─ UI Fixtures Teardown (afterEach)
   │  ├─ Close page
   │  ├─ Close browser context
   │  ├─ Take final screenshot on failure
   │  └─ Cleanup resources
   │
   └─ Repeat for next test

3. Test Session End
   └─ global-teardown.ts (runs once after all tests)
      ├─ Close all browsers
      ├─ Clean up test data
      ├─ Generate final reports
      └─ Generate screenshots report
```

---

## Packages Overview

### **API Package** (`src/api/`)

#### `client/api-client.ts`
- **Purpose**: Centralized HTTP client for all API requests
- **Features**:
  - Request/response interceptors
  - Automatic latency tracking
  - Bearer token authentication
  - Request/response logging
  - Error handling with retry logic
- **Methods**:
  - `get(endpoint)` - Make GET request
  - `post(endpoint, body)` - Make POST request
  - `put(endpoint, body)` - Make PUT request
  - `delete(endpoint)` - Make DELETE request

#### `pojos/` - Data Models
- `anime-status.model.ts` - Anime API response model
- `product.model.ts` - Product model
- `product-request.model.ts` - Product create/update request
- `product-response.model.ts` - Product response model
- **Purpose**: Type-safe serialization/deserialization of API responses

#### `services/` - API Service Layer
- Business-level API operations (Auth, User, Product, etc.)
- Encapsulates API client and builds domain-specific methods

#### `assertions/api-assertions.ts`
- **Assertion Helpers**:
  - `assertStatusCode(response, expectedCode)` - Verify HTTP status
  - `assertResponseSchema(response, schema)` - Validate schema
  - `assertResponseTime(latency, threshold)` - Check response time
  - `assertBodyContains(response, fields)` - Verify response fields
  - `assertBodyField(response, field, expectedValue)` - Assert specific field

---

### **UI Package** (`src/ui/`)

#### `pages/base.page.ts`
- **Base Page Class** with common methods for all page objects
- **Methods**:
  - `goto(url)` - Navigate to URL
  - `click(selector)` - Click element
  - `fill(selector, text)` - Fill input field
  - `getText(selector)` - Get element text
  - `isVisible(selector)` - Check element visibility
  - `waitForElement(selector)` - Wait for element to appear
  - `takeScreenshot(name)` - Take screenshot

#### `pages/` - Page Objects
- `login.page.ts` - Login page with login() method
- `products.page.ts` - Products page with search, filter, add to cart methods
- `cart.page.ts` - Cart page with cart management methods
- **Pattern**: Each page extends BasePage and encapsulates selectors + interactions

#### `components/header.component.ts`
- **Reusable header component** used across multiple pages
- **Methods**:
  - `getUsername()` - Get logged-in username
  - `getCartCount()` - Get cart item count
  - `logout()` - Click logout

#### `assertions/ui-assertions.ts`
- **UI Assertion Helpers**:
  - `assertElementVisible(selector)` - Check element is visible
  - `assertElementText(selector, expectedText)` - Verify text
  - `assertPageTitle(expectedTitle)` - Check page title
  - `assertURL(expectedURL)` - Verify current URL
  - `assertElementCount(selector, expectedCount)` - Check element count

---

### **Core Package** (`src/core/`)

#### `fixtures/api.fixtures.ts`
- **API Test Fixtures** (equivalent to TestNG @BeforeMethod/@AfterMethod)
- **Lifecycle**:
  - `beforeEach` - Create fresh API client and services
  - `afterEach` - Close connections, cleanup resources
- **Available Fixtures**:
  - `apiClient` - Configured API client instance
  - `authService` - Authentication service
  - `userService` - User management service

#### `fixtures/ui.fixtures.ts`
- **UI Test Fixtures**
- **Lifecycle**:
  - `beforeEach` - Launch browser, navigate to app, initialize page objects
  - `afterEach` - Close browser, cleanup resources, attach screenshots
- **Available Fixtures**:
  - `page` - Playwright page object
  - `context` - Browser context
  - `loginPage` - Initialized login page object
  - `productsPage` - Initialized products page object
  - `cartPage` - Initialized cart page object
  - `headerComponent` - Initialized header component

#### `config/global-setup.ts`
- **Global Setup** (runs once before entire test session)
- **Responsibilities**:
  - Load environment variables
  - Initialize logging system
  - Start mock server
  - Seed test database with users/products
  - Set global configuration

#### `config/global-teardown.ts`
- **Global Teardown** (runs once after entire test session)
- **Responsibilities**:
  - Stop mock server
  - Close database connections
  - Generate Allure/HTML/JUnit reports
  - Cleanup temporary files

#### `config/env/` - Environment Files
- `.env` - Default/local environment variables
- `.env.dev` - Development environment variables
- `.env.staging` - Staging environment variables
- `.env.prod` - Production environment variables

#### `utils/` - Shared Utilities

**`data-provider.ts`**
- Load test data from YAML files
- Example: `DataProvider.loadYAML('test-data/api/dev/anime-status.yaml')`

**`logger.ts`**
- Custom logging utility
- Methods: `info()`, `warn()`, `error()`, `debug()`
- Features: Timestamp logging, color-coded output, file logging

**`report-helper.ts`**
- Allure report helper functions
- Methods: `addStep()`, `attachScreenshot()`, `attachJSON()`, `attachText()`, `linkIssue()`

**`string-utils.ts`**
- String manipulation utilities
- Methods: `camelCase()`, `toPascalCase()`, `trim()`, `replace()`

---

### **Helpers** (`src/helpers/test-helper.ts`)
- **Common test utility functions**
- `generateRandomUser()` - Generate test user
- `generateRandomEmail()` - Generate test email
- `getCurrentDateTime()` - Get current timestamp
- `parseJWT(token)` - Decode JWT token

---

### **Mock Server** (`src/mock/mock-server.ts`)
- **Local mock API server for testing integrations**
- **Features**:
  - Route interception
  - Mock response data
  - Simulating API errors
  - Response delay simulation

---

## Installation

```bash
# Clone repository
git clone <repository-url>
cd playwright-ts-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# (Optional) Create local environment file
cp src/core/config/env/.env.dev .env.local
```

---

## Running Tests

### Run all tests
```bash
npm test
```

### Run by test type
```bash
npm run test:api      # API tests only
npm run test:ui       # UI tests only
npm run test:e2e      # E2E tests only
```

### Run specific test file
```bash
npx playwright test tests/api/anime-status.spec.ts
npx playwright test tests/ui/login.spec.ts --headed
```

### With custom workers
```bash
WORKERS=8 npm test
```

### Debug mode
```bash
npx playwright test --debug
npx playwright test --headed
```

### Generate reports
```bash
npm run report:html        # Open Playwright HTML report
npm run report:allure      # Generate & serve Allure report
```

---

## Best Practices

1. **Use Page Objects** - Encapsulate UI selectors and interactions in page objects
2. **Data-Driven Tests** - Use YAML files for test data, not hardcoded values
3. **Reusable Fixtures** - Use fixtures for common setup/teardown
4. **Type Safety** - Always use TypeScript models (POJOs) for API responses
5. **Meaningful Assertions** - Use descriptive assertion messages
6. **Screenshots on Failure** - Automatic screenshot capture on UI test failure
7. **Separate Test Types** - Keep API, UI, and E2E tests in separate directories
8. **Logging** - Use logger utility for debugging information
9. **Error Handling** - Always handle errors gracefully with meaningful messages
10. **Reporting** - Add steps and attachments to Allure reports

---

## Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests |
| `npm run test:api` | Run API tests |
| `npm run test:ui` | Run UI tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run report:allure` | Generate Allure report |
| `npm run report:html` | Generate HTML report |
| `npm run lint` | Run ESLint |
| `npm run build` | Build TypeScript |

---

## Support

For questions or issues, refer to individual module files or check test examples in the `tests/` directory.
