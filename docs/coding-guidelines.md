# Coding Guidelines

The project should favor code that is clear, predictable, and easy to change. Formatting and naming should make the intent of a module obvious, while small, focused functions and components should keep behavior easy to test.

## Formatting and Structure

- Follow the formatting conventions already established in the surrounding file and package.
- Use consistent indentation, spacing, braces, and semicolons within each language and package.
- Keep functions, React components, and modules focused on one responsibility.
- Prefer early returns and straightforward control flow when they make the main behavior easier to follow.
- Keep public interfaces and shared data shapes explicit and document non-obvious decisions briefly.
- Avoid unrelated formatting or refactoring changes in a feature or bug-fix change.

## Imports and Dependencies

- Organize imports consistently, with external packages before local modules and a blank line between groups.
- Remove unused imports and avoid importing a module when a narrower local dependency is sufficient.
- Prefer existing project dependencies and utilities before adding a new package.
- Keep dependency additions intentional and explain their value through the code or change description.
- Avoid circular dependencies and keep module boundaries aligned with ownership of the behavior.

## Naming and Reuse

- Use descriptive names for variables, functions, components, routes, and test fixtures; avoid unexplained abbreviations.
- Use names that reflect domain concepts such as tasks, due dates, completion, and filters.
- Follow the DRY principle by extracting genuinely repeated logic, but do not create abstractions for one-off code or superficial similarities.
- Prefer small reusable helpers when they make shared validation, sorting, formatting, or API behavior consistent.
- Keep abstractions close to the code that owns them until there is a clear need to share them.

## Quality and Error Handling

- Validate inputs at the boundary where they enter the application and return useful errors for invalid requests.
- Handle expected failures explicitly, including API errors, persistence failures, and empty or missing data.
- Do not silently swallow errors or expose sensitive implementation details in user-facing messages.
- Avoid mutating shared state unexpectedly; make state transitions and side effects easy to identify.
- Preserve accessibility, functional requirements, and testability when changing UI or backend behavior.

## Linting and Review

- Use the Create React App ESLint rules for frontend JavaScript and address lint warnings introduced by a change.
- Run the package tests, or the full root test command for cross-package changes, before merging.
- Keep lint and test output free of newly introduced warnings and errors.
- Review changes for correctness, readability, unnecessary duplication, and maintainability rather than relying only on automated checks.
- Update documentation and tests when a change alters behavior, public interfaces, or project conventions.