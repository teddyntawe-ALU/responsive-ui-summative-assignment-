// title cannot be blank or only spaces
function validateTitle(title) {
  const titlePattern = /^\S(?:.*\S)?$/;

  if (titlePattern.test(title)) {
    return "";
  }

  return "Please enter a title.";
}

/* category is letters with spaces or hyphens */
function validateCategory(category) {
  const categoryPattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

  if (categoryPattern.test(category)) {
    return "";
  }

  return "Use letters, spaces, or hyphens only.";
}

function validateDueDate(dueDate) {
  // expected format is yyyy-mm-dd
  const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  if (datePattern.test(dueDate)) {
    return "";
  }

  return "Use the format YYYY-MM-DD.";
}

function validateDuration(duration) {
  // whole number above zero
  const durationPattern = /^[1-9]\d*$/;

  if (durationPattern.test(duration)) {
    return "";
  }

  return "Enter a whole number above 0.";
}

function validateNotes(notes) {
  // notes can be empty, but not script looking text
  const notesPattern = /^[A-Za-z0-9\s.,!?'"():;\-]*$/;
  const scriptPattern = /<\s*script|javascript:|onerror\s*=|onclick\s*=/i;

  if (scriptPattern.test(notes)) {
    return "Notes cannot contain script-like text.";
  }

  if (notesPattern.test(notes)) {
    return "";
  }

  return "Notes can only use normal text characters.";
}

function validateEventForm(eventData) {
  // return all errors at once so the user can fix them together
  const errors = {
    title: validateTitle(eventData.title),
    category: validateCategory(eventData.category),
    dueDate: validateDueDate(eventData.dueDate),
    duration: validateDuration(eventData.duration),
    notes: validateNotes(eventData.notes)
  };

  return errors;
}

function hasValidationErrors(errors) {
  // beginner style check, very clear on purpose
  let hasErrors = false;

  if (errors.title !== "") {
    hasErrors = true;
  }

  if (errors.category !== "") {
    hasErrors = true;
  }

  if (errors.dueDate !== "") {
    hasErrors = true;
  }

  if (errors.duration !== "") {
    hasErrors = true;
  }

  if (errors.notes !== "") {
    hasErrors = true;
  }

  return hasErrors;
}
