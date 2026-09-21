# UI Guidelines

The TODO app should use a clear, consistent, and accessible interface for managing tasks.

## Component Library

- Use Material UI components for common controls, layout primitives, feedback, and navigation.
- Prefer existing Material UI components over custom controls when they provide the required behavior.
- Use consistent component sizing, spacing, and typography throughout the app.
- Keep task rows visually distinct without nesting cards inside other cards.

## Color and Visual Design

- Use a calm, high-contrast palette with a light neutral background, dark readable text, and one primary accent color.
- Use the primary accent color for the main add-task action and selected navigation or filter states.
- Use a distinct warning color for overdue tasks and a success color for completed tasks.
- Do not use color as the only way to communicate completion, errors, warnings, or focus.
- Maintain a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text and interface components.

## Buttons and Controls

- Use a filled primary button for the main add-task action.
- Use outlined or text buttons for secondary actions such as canceling or clearing a form.
- Use icon buttons for compact actions such as edit and delete, with accessible labels and tooltips.
- Destructive actions must use a clearly identifiable delete affordance and require confirmation before removal.
- Buttons and form controls must have visible hover, focus, disabled, and loading states.
- Keep touch targets at least 44 by 44 pixels where practical.

## Layout and Responsive Behavior

- Present the task list as the primary content, with the add-task form easy to find without dominating the screen.
- Keep filters and search controls close to the task list so users can scan and refine tasks quickly.
- Use a responsive layout that remains usable on mobile, tablet, and desktop screens.
- Prevent task titles, due dates, and action controls from overlapping or causing layout shifts.
- Preserve the user's current filter and search context after task edits when possible.

## Forms and Feedback

- Label every form field, including title, description, and due date.
- Show validation messages next to the relevant field and explain how to correct the input.
- Keep form submissions available by keyboard and support pressing Enter where it is unambiguous.
- Show clear success or error feedback after saving, editing, deleting, or loading tasks.
- Use an empty state that explains when no tasks match the current view without blocking task creation.

## Accessibility

- Support full keyboard navigation with a visible focus indicator for every interactive element.
- Use semantic headings, landmarks, lists, labels, and buttons so the interface works with assistive technology.
- Announce dynamic changes such as task creation, completion, deletion, and save failures to screen readers.
- Provide text alternatives for icons and never rely on hover alone to expose essential information.
- Respect user preferences for reduced motion and avoid animations that interfere with reading or task completion.
- Ensure dialogs trap focus while open, close predictably, and return focus to the initiating control.