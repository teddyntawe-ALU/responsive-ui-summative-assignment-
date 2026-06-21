// main app data is kept here while the page is open
const tedlyEvents = [];
let currentSort = "date";

// default settings before localStorage loads anything
const tedlySettings = {
  reminders: "on",
  reminderTime: "1day",
  weekStart: "monday",
  timeUnit: "minutes",
  weeklyCap: ""
};

function makeEventId() {
  // date.now is simple enough for this small project
  return "event-" + Date.now().toString();
}

function getEvents() {
  return tedlyEvents;
}

function getSettings() {
  return tedlySettings;
}

function setCurrentSort(sortType) {
  currentSort = sortType;
}

function getEventsForDisplay() {
  // sorting is done on a copied array in search.js
  return sortEvents(tedlyEvents, currentSort);
}

function addEvent(eventData) {
  const newEvent = {
    id: makeEventId(),
    title: eventData.title,
    category: eventData.category,
    dueDate: eventData.dueDate,
    duration: Number(eventData.duration),
    notes: eventData.notes
  };

  tedlyEvents.push(newEvent);
  saveToStorage();
  return newEvent;
}

/* updates the matching event instead of replacing the full list */
function updateEvent(eventId, eventData) {
  let eventFound = false;

  tedlyEvents.forEach(function (eventItem) {
    if (eventItem.id === eventId) {
      eventItem.title = eventData.title;
      eventItem.category = eventData.category;
      eventItem.dueDate = eventData.dueDate;
      eventItem.duration = Number(eventData.duration);
      eventItem.notes = eventData.notes;
      eventFound = true;
    }
  });

  if (eventFound) {
    saveToStorage();
  }

  return eventFound;
}

function deleteEvent(eventId) {
  let eventIndex = -1;

  tedlyEvents.forEach(function (eventItem, index) {
    if (eventItem.id === eventId) {
      eventIndex = index;
    }
  });

  if (eventIndex > -1) {
    tedlyEvents.splice(eventIndex, 1);
    saveToStorage();
    return true;
  }

  return false;
}

function findEvent(eventId) {
  let foundEvent = null;

  tedlyEvents.forEach(function (eventItem) {
    if (eventItem.id === eventId) {
      foundEvent = eventItem;
    }
  });

  return foundEvent;
}

// saves settings selected by the user
function updateSettings(settingsData) {
  tedlySettings.reminders = settingsData.reminders;
  tedlySettings.reminderTime = settingsData.reminderTime;
  tedlySettings.weekStart = settingsData.weekStart;
  tedlySettings.timeUnit = settingsData.timeUnit;
  tedlySettings.weeklyCap = settingsData.weeklyCap;

  saveToStorage();
}

function replaceAllData(events, settings) {
  // used when loading from localStorage or importing json
  tedlyEvents.splice(0, tedlyEvents.length);

  events.forEach(function (eventItem) {
    tedlyEvents.push({
      id: String(eventItem.id || makeEventId()),
      title: String(eventItem.title),
      category: String(eventItem.category),
      dueDate: String(eventItem.dueDate),
      duration: Number(eventItem.duration),
      notes: String(eventItem.notes || "")
    });
  });

  if (settings !== undefined && settings !== null) {
    tedlySettings.reminders = String(settings.reminders || "on");
    tedlySettings.reminderTime = String(settings.reminderTime || "1day");
    tedlySettings.weekStart = String(settings.weekStart || "monday");
    tedlySettings.timeUnit = String(settings.timeUnit || "minutes");
    tedlySettings.weeklyCap = String(settings.weeklyCap || "");
  }
}
