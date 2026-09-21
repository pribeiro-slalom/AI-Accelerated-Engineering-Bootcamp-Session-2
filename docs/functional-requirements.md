# Functional Requirements

The TODO app should provide the following core functionality:

## Task Management

- The user can add a task with a required title.
- The user can add an optional description to a task.
- The user can add an optional due date to a task.
- The user can edit a task's title, description, and due date.
- The user can mark a task as complete or incomplete.
- The user can delete a task.
- The app prevents tasks with blank titles from being created or saved.
- Each task has a unique identifier and records when it was created.

## Task Display and Organization

- The app displays all tasks with their title, completion status, and due date when one is set.
- Incomplete tasks appear before completed tasks by default.
- Within each completion group, tasks are sorted by due date from soonest to latest.
- Tasks without a due date appear after tasks with due dates.
- Tasks with the same due date are sorted by creation time, with older tasks first.
- The user can filter the list to show all tasks, active tasks, or completed tasks.
- The user can search tasks by title or description.
- The app clearly identifies overdue incomplete tasks.

## Persistence and Reliability

- Tasks remain available after the page is refreshed.
- The app displays an empty state when no tasks match the current filter or search.
- The app displays a useful error message when loading or saving tasks fails.
- The app confirms destructive deletion before permanently removing a task.

## Accessibility and Usability

- The user can perform every task-management action with keyboard input.
- Form controls have accessible labels and communicate validation errors.
- Completion status is conveyed by more than color alone.
- Dates are displayed in a consistent, human-readable format.