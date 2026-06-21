// key used in the browser localStorage
const STORAGE_KEY = "tedlyPlannerData";

function saveToStorage() {
  // put events and settings together so import/export is simpler
  const appData = {
    events: getEvents(),
    settings: getSettings()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function loadFromStorage() {
  // if there is nothing saved yet the app just starts empty
  const savedText = localStorage.getItem(STORAGE_KEY);

  if (savedText === null) {
    return false;
  }

  try {
    const savedData = JSON.parse(savedText);

    if (isValidImportData(savedData)) {
      replaceAllData(savedData.events, savedData.settings);
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}

/* checks one event before allowing imported data */
function isValidEventData(eventItem) {
  if (eventItem === null || typeof eventItem !== "object") {
    return false;
  }

  if (validateTitle(String(eventItem.title)) !== "") {
    return false;
  }

  if (validateCategory(String(eventItem.category)) !== "") {
    return false;
  }

  if (validateDueDate(String(eventItem.dueDate)) !== "") {
    return false;
  }

  if (validateDuration(String(eventItem.duration)) !== "") {
    return false;
  }

  if (validateNotes(String(eventItem.notes || "")) !== "") {
    return false;
  }

  return true;
}

function isValidImportData(data) {
  // basic check for the shape of the json file
  let validData = true;

  if (data === null || typeof data !== "object") {
    return false;
  }

  if (!Array.isArray(data.events)) {
    return false;
  }

  data.events.forEach(function (eventItem) {
    if (!isValidEventData(eventItem)) {
      validData = false;
    }
  });

  return validData;
}
