// makes text safe before putting it inside html
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
  // this is used for regex search highlighting
  const textValue = String(text);

  if (regex === null) {
    return escapeText(textValue);
  }

  regex.lastIndex = 0;

  return escapeText(textValue).replace(regex, function (match) {
    return "<mark>" + escapeText(match) + "</mark>";
  });
}

/* simple page switching */
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
  // these are the little red messages under inputs
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
  // after saving or cancelling, the form goes back to add mode
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
  // used when the user clicks edit
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

// desktop records table
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
  // smaller screens use cards instead of the table
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

/* dashboard numbers */
function renderDashboard(events) {
  let totalMinutes = 0;

  events.forEach(function (eventItem) {
    totalMinutes += Number(eventItem.duration);
  });

  document.querySelector("#stat-total").textContent = events.length;
  document.querySelector("#duration-stat-label").textContent = getSettings().timeUnit === "hours" ? "Total hours" : "Total minutes";
  document.querySelector("#stat-sum").textContent = formatDuration(totalMinutes);
  document.querySelector("#stat-top-category").textContent = getTopCategory(events);

  renderTrend(events);
  renderCapStatus(events);
  renderDashboardCards(events);
}

function renderDashboardCards(events) {
  // dashboard cards are just a quick preview of tasks
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
  // counts categories then keeps the largest one
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

function formatDuration(minutes) {
  // the settings page controls minutes or hours
  const settings = getSettings();

  if (settings.timeUnit === "hours") {
    return (Number(minutes) / 60).toFixed(1) + "h";
  }

  return Number(minutes) + "m";
}

function getEventDate(eventItem) {
  return new Date(eventItem.dueDate + "T00:00:00");
}

function isEventInCurrentWeek(eventItem) {
  // week start can be monday or sunday
  const settings = getSettings();
  const today = new Date();
  const eventDate = getEventDate(eventItem);
  let dayNumber = today.getDay();

  if (settings.weekStart === "monday") {
    dayNumber = dayNumber === 0 ? 6 : dayNumber - 1;
  }

  const weekStart = new Date(today);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(today.getDate() - dayNumber);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return eventDate >= weekStart && eventDate <= weekEnd;
}

function getCurrentWeekMinutes(events) {
  let weekMinutes = 0;

  events.forEach(function (eventItem) {
    if (isEventInCurrentWeek(eventItem)) {
      weekMinutes += Number(eventItem.duration);
    }
  });

  return weekMinutes;
}

function renderCapStatus(events) {
  // cap status uses aria-live from the html
  const capStatus = document.querySelector("#cap-status");
  const settings = getSettings();
  const capAmount = Number(settings.weeklyCap);
  const weekMinutes = getCurrentWeekMinutes(events);

  capStatus.classList.remove("over-cap");

  if (settings.weeklyCap === "" || capAmount === 0) {
    capStatus.textContent = "No cap set yet";
    return;
  }

  if (weekMinutes > capAmount) {
    capStatus.textContent = "Over cap: " + formatDuration(weekMinutes) + " of " + formatDuration(capAmount);
    capStatus.classList.add("over-cap");
    return;
  }

  capStatus.textContent = "This week: " + formatDuration(weekMinutes) + " of " + formatDuration(capAmount);
}

function renderTrend(events) {
  // tiny seven day bar chart
  const trendChart = document.querySelector("#trend-chart");
  const dayTotals = [0, 0, 0, 0, 0, 0, 0];
  let maxMinutes = 0;
  let trendHtml = "<div class='trend-bars'>";
  const today = new Date();

  events.forEach(function (eventItem) {
    const eventDate = getEventDate(eventItem);
    const dayDiff = Math.floor((today - eventDate) / 86400000);

    if (dayDiff >= 0 && dayDiff < 7) {
      dayTotals[6 - dayDiff] += Number(eventItem.duration);
    }
  });

  dayTotals.forEach(function (minutes) {
    if (minutes > maxMinutes) {
      maxMinutes = minutes;
    }
  });

  dayTotals.forEach(function (minutes) {
    let barHeight = 8;

    if (maxMinutes > 0) {
      barHeight = Math.max(8, Math.round((minutes / maxMinutes) * 28));
    }

    trendHtml += "<span class='trend-bar' style='height:" + barHeight + "px'></span>";
  });

  trendHtml += "</div>";
  trendChart.innerHTML = trendHtml;
}

function fillSettingsForm() {
  // puts saved settings back into the controls
  const settings = getSettings();

  document.querySelector("#notif-toggle").value = settings.reminders;
  document.querySelector("#reminder-time").value = settings.reminderTime;
  document.querySelector("#week-start").value = settings.weekStart;
  document.querySelector("#time-unit").value = settings.timeUnit;
  document.querySelector("#weekly-cap").value = settings.weeklyCap;
}

function showSettingsMessage(message) {
  document.querySelector("#settings-message").textContent = message;
}

function renderEvents() {
  // main redraw function after changes
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
