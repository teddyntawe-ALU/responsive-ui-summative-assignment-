# Tedly - The Campus Planner

![App Preview](assets/img/pre.png)

## Developer

**Teddy Ntawe**

GitHub: https://github.com/teddyntawe-ALU  
Email: [t.ntawe@alustudent.com](mailto:t.ntawe@alustudent.com)  
Github Pages: https://teddyntawe-alu.github.io/responsive-ui-summative-assignment-/
Demo Video: https://www.youtube.com

## Overview

Tedly is a simple campus planner built to help students stay on top of their academic responsibilities. Students can use it to plan assignments, projects, quizzes, and study sessions in one place.

The main goal is to make school planning easier by showing what needs to be done, when it is due, and how much time it may take.

## Features

- Add, edit, and delete academic events.
- Validate form inputs before saving.
- View records in a desktop table and mobile card layout.
- Sort records by date, title, or duration.
- Search records using regex patterns.
- Highlight matching search results.
- Save events and settings using localStorage.
- Export and import planner data as JSON.
- Track total events, total study time, top category, weekly cap, and last 7 days activity.

## Basic Wireframes

Desktop layout:

```text
Header / Logo
------------------------------------------------
Side Menu        Main Content Area
Home             Dashboard cards
Records          Records table
Add Event        Event form
Settings         Settings form
About            About text
```

Mobile layout:

```text
Logo + Menu Button
------------------------------------------------
Collapsible Menu
------------------------------------------------
Main Content Area
Dashboard cards / form / records cards
```

## Data Model

Each planner event uses this basic shape:

```js
{
  id: "sample-1",
  title: "Math Project",
  category: "Assignment",
  dueDate: "2026-07-01",
  duration: 90,
  notes: "Finish the project draft"
}
```

Settings use this basic shape:

```js
{
  reminders: "on",
  reminderTime: "1day",
  weekStart: "monday",
  timeUnit: "minutes",
  weeklyCap: 600
}
```

## Regex Rules

- Title: must not be empty or only spaces.
- Category: only letters, spaces, and hyphens are allowed.
- Due date: must match the `YYYY-MM-DD` date format.
- Duration: must be a whole number greater than zero.
- Notes: allows normal text, but blocks script-like text such as script tags, `javascript:`, `onclick=`, and `onerror=`.
- Search: the records search box compiles the typed text as a regex. Invalid regex patterns show an error message instead of crashing the app.

## Accessibility Notes

- The app uses semantic page areas such as header, navigation, main content, sections, tables, forms, and buttons.
- Important status messages use `aria-live`, including validation, search, settings, and weekly cap feedback.
- A skip link is included for keyboard users.
- The mobile menu can be opened with the keyboard and closed with Escape.
- Buttons and inputs have visible focus styles.
- Reduced motion support is included for users who prefer less animation.

## Keyboard Map

- Tab: move through links, buttons, inputs, and controls.
- Enter or Space: activate buttons.
- Escape: close the mobile menu.
- Search input: type a regex pattern to filter records.

## Project Structure

```text
index.html
demo-data.json
assets/
styles/
  style.css
  responsive.css
scripts/
  app.js
  storage.js
  state.js
  ui.js
  validators.js
  search.js
```

## Technologies Used

- HTML
- CSS
- JavaScript
- Local Storage

## Testing

Testing is mostly manual for now. Main things to check:

- Add a valid event and confirm it appears in Records and Dashboard.
- Try invalid form inputs and confirm error messages show.
- Edit an event and confirm the updated values render.
- Delete an event and confirm it is removed.
- Sort by date, title, and duration.
- Search with a normal word like `quiz`.
- Search with a regex pattern like `Assignment|Quiz`.
- Try a broken regex like `[` and confirm the app shows an error.
- Refresh the page and confirm saved events remain.
- Export JSON, then import it again.
- Test mobile menu and mobile card layout.

