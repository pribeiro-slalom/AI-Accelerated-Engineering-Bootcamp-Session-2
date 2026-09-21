# Testing Guidelines

The TODO app should be supported by tests that provide fast feedback, protect user-facing behavior, and remain easy to understand and maintain.

## Test Coverage

- The project must include unit, integration, and end-to-end tests.
- Unit tests should verify individual functions, components, and validation or sorting rules in isolation.
- Integration tests should verify interactions between related components, the frontend and backend, and persistence boundaries.
- End-to-end tests should verify critical user journeys in a realistic browser environment, including creating, editing, completing, filtering, and deleting tasks.
- New features must include the appropriate unit, integration, and end-to-end tests for their risk and scope.
- Bug fixes must include a regression test that fails before the fix and passes afterward whenever practical.
- Tests should cover successful behavior, validation failures, empty states, loading states, and error states where those states apply.

## Test Quality and Maintainability

- Tests should describe observable behavior rather than implementation details.
- Test names should clearly state the scenario and expected result.
- Each test should verify one focused behavior and avoid unrelated setup or assertions.
- Prefer stable semantic selectors and accessible labels over CSS classes, generated identifiers, or DOM structure.
- Use shared fixtures and test helpers for repeated setup, but keep them small and easy to discover.
- Tests should be deterministic, isolated, and independent of execution order.
- Avoid arbitrary timeouts, unnecessary network calls, and dependence on external services in automated tests.
- Keep test data representative, minimal, and explicit so failures are easy to diagnose.
- Update tests when requirements or user-visible behavior change; do not weaken assertions just to make a test pass.

## Running and Reviewing Tests

- Run the relevant focused tests during development and the complete test suite before merging.
- Pull requests should report test results and should not merge when required tests fail.
- The test suite should run in a clean environment without relying on a developer's local state.
- Code coverage may be used to identify untested areas, but coverage percentages must not replace meaningful behavioral tests.
- Reviewers should assess whether each new behavior has appropriate coverage and whether the tests will remain understandable as the app evolves.