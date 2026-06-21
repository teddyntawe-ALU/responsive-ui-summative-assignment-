const tedlyEvents = [];
let currentSort = "date";

function makeEventId() {
  return "event-" + Date.now().toString();
}

function getEvents() {
  return tedlyEvents;
}

function setCurrentSort(sortType) {
  currentSort = sortType;
}

function getEventsForDisplay() {
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
  return newEvent;
}

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
