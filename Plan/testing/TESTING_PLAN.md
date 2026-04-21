# Testing Strategy for Mock Mentor

## Summary

Adopt a three-layer test stack:
- `Vitest` for unit and route-level integration tests
- `React Testing Library` for component behavior tests
- `Playwright` for end-to-end browser flows

Use mocked external dependencies by default:
- mock Clerk auth
- mock Gemini responses
- mock Stripe routes/events
- mock DB access in unit/integration tests
- keep end-to-end tests deterministic by using local stubs or test-only bypasses instead of real third-party calls

## Key Changes

### Test tooling
- Add `Vitest`, `React Testing Library`, and `Playwright`
- Add test scripts in `package.json`
- Add shared setup for DOM matchers and global mocks

### What to test
- Unit tests for billing and pricing helpers
- Integration tests for billing and interview API routes
- Component tests for `AddNewInterview`, `UsageOverview`, and `Upgrade`
- End-to-end tests for home, upgrade, and dashboard accessibility under test auth bypass

### How to test
- Mock external services by default
- Route tests call handlers directly
- Component tests use Testing Library in `jsdom`
- Playwright runs against local `next dev` with a middleware auth bypass

## Test Cases
- Free users are capped at 2 total interviews
- Paid users receive 20 sessions per monthly entitlement window
- Interview creation rejects quota exhaustion and succeeds on valid AI responses
- Billing routes return correct status, checkout, and portal responses
- Upgrade and dashboard pages display plan usage correctly

## Assumptions
- No real Stripe, Clerk, Gemini, or Neon calls are needed in routine tests
- Browser tests are local only
- Initial coverage focuses on billing and interview creation first
