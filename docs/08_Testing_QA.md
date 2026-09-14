# Testing & Quality Assurance

## Backend Testing
- **Unit Tests:** `pytest` for business logic (BOQ math, currency conversion).
- **Coverage:** Aim for 80%+ coverage.
- **Mocks:** Extensive mocking of payment gateways and LLM APIs.

## E2E Testing
- **Selenium/Playwright:** Core flows (Login → Search → Pay → Track).
- **Load Testing:** `Locust` simulating 500 concurrent SME users.

## Security
- **OWASP ZAP:** Automated vulnerability scanning.
- **Encryption:** AES-256 for stored API keys.
- **Sanitization:** Strict input validation to prevent SQLi and XSS.