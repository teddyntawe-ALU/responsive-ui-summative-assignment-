function escapeText(text) {
  const textValue = String(text);

  return textValue
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlightText(text, regex) {
  const textValue = String(text);

  if (regex === null) {
    return escapeText(textValue);
  }

  regex.lastIndex = 0;

  return escapeText(textValue).replace(regex, function (match) {
    return "<mark>" + escapeText(match) + "</mark>";
  });
}

function showPage(pageId) {
  const panelLinks = document.querySelectorAll(".panel-link");
  const pageSections = document.querySelectorAll(".page-section");

  pageSections.forEach(function (section) {
    if (section.id === pageId) {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
  });

  panelLinks.forEach(function (link) {
    if (link.getAttribute("data-page") === pageId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function setFieldErrors(errors) {
  document.querySelector("#event-name-error").textContent = errors.title;
  document.querySelector("#event-category-error").textContent = errors.category;
  document.querySelector("#event-date-error").textContent = errors.dueDate;
  document.querySelector("#event-duration-error").textContent = errors.duration;
  document.querySelector("#event-notes-error").textContent = errors.notes;
}

function clearFieldErrors() {
  const errors = {
    title: "",
    category: "",
    dueDate: "",
    duration: "",
    notes: ""
  };

  setFieldErrors(errors);
}

function resetEventForm() {
  document.querySelector("#event-id").value = "";
  document.querySelector("#event-name").value = "";
  document.querySelector("#event-category").value = "";
  document.querySelector("#event-date").value = "";
  document.querySelector("#event-duration").value = "";
  document.querySelector("#event-notes").value = "";
  document.querySelector("#form-heading").textContent = "Add Event";
  document.querySelector("#form-submit-button").textContent = "Save Event";
  clearFieldErrors();
}

function fillEventForm(eventItem) {
  document.querySelector("#event-id").value = eventItem.id;
  document.querySelector("#event-name").value = eventItem.title;
  document.querySelector("#event-category").value = eventItem.category;
  document.querySelector("#event-date").value = eventItem.dueDate;
  document.querySelector("#event-duration").value = eventItem.duration;
  document.querySelector("#event-notes").value = eventItem.notes;
  document.querySelector("#form-heading").textContent = "Edit Event";
  document.querySelector("#form-submit-button").textContent = "Update Event";
  clearFieldErrors();
}

function renderTableRows(events, regex) {
  const tableBody = document.querySelector("#records-table-body");
  let tableHtml = "";

  events.forEach(function (eventItem) {
    tableHtml += "<tr>";
    tableHtml += "<td>" + highlightText(eventItem.title, regex) + "</td>";
    tableHtml += "<td>" + highlightText(eventItem.category, regex) + "</td>";
    tableHtml += "<td>" + highlightText(eventItem.dueDate, regex) + "</td>";
    tableHtml += "<td>" + highlightText(eventItem.duration, regex) + "</td>";
    tableHtml += "<td>";
    tableHtml += "<button class='row-edit-button' type='button' data-id='" + escapeText(eventItem.id) + "'>Edit</button>";
    tableHtml += "<button class='row-delete-button' type='button' data-id='" + escapeText(eventItem.id) + "'>Delete</button>";
    tableHtml += "</td>";
    tableHtml += "</tr>";
  });

  tableBody.innerHTML = tableHtml;
}

function renderRecordCards(events, regex) {
  const cardList = document.querySelector("#record-card-list");
  let cardHtml = "";

  events.forEach(function (eventItem) {
    cardHtml += "<div class='record-card'>";
    cardHtml += "<h3 class='record-card-title'>" + highlightText(eventItem.title, regex) + "</h3>";
    cardHtml += "<p class='record-card-meta'>" + highlightText(eventItem.category, regex) + " | Due " + highlightText(eventItem.dueDate, regex) + " | " + highlightText(eventItem.duration, regex) + " minutes</p>";
    cardHtml += "<div class='record-card-actions'>";
    cardHtml += "<button class='row-edit-button' type='button' data-id='" + escapeText(eventItem.id) + "'>Edit</button>";
    cardHtml += "<button class='row-delete-button' type='button' data-id='" + escapeText(eventItem.id) + "'>Delete</button>";
    cardHtml += "</div>";
    cardHtml += "</div>";
  });

  cardList.innerHTML = cardHtml;
}

function renderDashboard(events) {
  let totalMinutes = 0;

  events.forEach(function (eventItem) {
    totalMinutes += Number(eventItem.duration);
  });

  document.querySelector("#stat-total").textContent = events.length;
  document.querySelector("#stat-sum").textContent = totalMinutes;
  document.querySelector("#stat-top-category").textContent = getTopCategory(events);

  renderDashboardCards(events);
}

function renderDashboardCards(events) {
  const emptyDashboard = document.querySelector("#empty-dashboard");
  const eventCards = document.querySelector("#event-cards");
  let cardHtml = "";

  if (events.length === 0) {
    emptyDashboard.style.display = "flex";
    eventCards.style.display = "none";
    eventCards.innerHTML = "";
    return;
  }

  events.forEach(function (eventItem) {
    cardHtml += "<div class='event-card'>";
    cardHtml += "<span class='card-tag'>" + escapeText(eventItem.category) + "</span>";
    cardHtml += "<h3 class='card-title'>" + escapeText(eventItem.title) + "</h3>";
    cardHtml += "<p class='card-detail'>Due " + escapeText(eventItem.dueDate) + "</p>";
    cardHtml += "</div>";
  });

  emptyDashboard.style.display = "none";
  eventCards.style.display = "grid";
  eventCards.innerHTML = cardHtml;
}

function getTopCategory(events) {
  const categoryCounts = {};
  let topCategory = "None yet";
  let topCount = 0;

  events.forEach(function (eventItem) {
    if (categoryCounts[eventItem.category] === undefined) {
      categoryCounts[eventItem.category] = 0;
    }

    categoryCounts[eventItem.category] += 1;

    if (categoryCounts[eventItem.category] > topCount) {
      topCategory = eventItem.category;
      topCount = categoryCounts[eventItem.category];
    }
  });

  return topCategory;
}

function renderEvents() {
  const events = getEventsForDisplay();
  const emptyRecords = document.querySelector("#empty-records");
  const tableWrapper = document.querySelector("#records-table-wrapper");
  const cardList = document.querySelector("#record-card-list");
  const searchInput = document.querySelector("#search-input");
  const searchError = document.querySelector("#search-error");
  const searchResult = makeSearchRegex(searchInput.value);

  if (searchError !== null) {
    searchError.textContent = searchResult.error;
  }

  if (searchResult.error !== "") {
    renderTableRows([], null);
    renderRecordCards([], null);
    emptyRecords.style.display = "flex";
    tableWrapper.style.display = "none";
    cardList.style.display = "none";
    return;
  }

  const filteredEvents = filterEventsBySearch(events, searchResult.regex);

  renderTableRows(filteredEvents, searchResult.regex);
  renderRecordCards(filteredEvents, searchResult.regex);
  renderDashboard(events);

  if (filteredEvents.length === 0) {
    emptyRecords.style.display = "flex";
    tableWrapper.style.display = "none";
    cardList.style.display = "none";
  } else {
    emptyRecords.style.display = "none";
    tableWrapper.style.display = "";
    cardList.style.display = "";
  }
}
