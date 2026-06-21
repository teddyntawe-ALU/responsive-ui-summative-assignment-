// turns what the user typed into a regex safely
function makeSearchRegex(searchText) {
  const cleanSearch = searchText.trim();

  if (cleanSearch === "") {
    return {
      regex: null,
      error: ""
    };
  }

  try {
    // g = all matches, i = case insensitive
    return {
      regex: new RegExp(cleanSearch, "gi"),
      error: ""
    };
  } catch (error) {
    return {
      regex: null,
      error: "Search pattern is not valid regex."
    };
  }
}

function eventMatchesSearch(eventItem, regex) {
  // search checks all the important event fields together
  const eventText = eventItem.title + " " +
    eventItem.category + " " +
    eventItem.dueDate + " " +
    eventItem.duration + " " +
    eventItem.notes;

  regex.lastIndex = 0;
  return regex.test(eventText);
}

function filterEventsBySearch(events, regex) {
  // empty search means show everything
  const filteredEvents = [];

  if (regex === null) {
    return events;
  }

  events.forEach(function (eventItem) {
    if (eventMatchesSearch(eventItem, regex)) {
      filteredEvents.push(eventItem);
    }
  });

  return filteredEvents;
}

function sortEvents(events, sortType) {
  // slice copies the list so the original state is not messed up
  const sortedEvents = events.slice();

  sortedEvents.sort(function (firstEvent, secondEvent) {
    if (sortType === "title") {
      return firstEvent.title.localeCompare(secondEvent.title);
    }

    if (sortType === "amount") {
      return Number(secondEvent.duration) - Number(firstEvent.duration);
    }

    return firstEvent.dueDate.localeCompare(secondEvent.dueDate);
  });

  return sortedEvents;
}
