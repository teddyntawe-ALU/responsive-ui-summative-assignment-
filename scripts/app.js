// page buttons and form elements
const panelLinks = document.querySelectorAll(".panel-link");
const menuToggle = document.querySelector("#menu-toggle");
const sidePanel = document.querySelector("#side-panel");
const eventForm = document.querySelector("#event-form");
const cancelButton = document.querySelector("#form-cancel-button");
const recordsTableBody = document.querySelector("#records-table-body");
const recordCardList = document.querySelector("#record-card-list");
const searchInput = document.querySelector("#search-input");
const sortButtons = document.querySelectorAll(".sort-button");
const durationInput = document.querySelector("#event-duration");
const weeklyCapInput = document.querySelector("#weekly-cap");
const settingsSaveButton = document.querySelector("#settings-save");
const exportButton = document.querySelector("#export-data");
const importInput = document.querySelector("#import-data");

// closes the phone menu after clicking a page
function closeMobileMenu() {
  if (sidePanel !== null && menuToggle !== null) {
    sidePanel.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
}

/* mobile menu setup */
function setupMobileMenu() {
  if (menuToggle !== null && sidePanel !== null) {
    menuToggle.addEventListener("click", function () {
      const menuIsOpen = sidePanel.classList.contains("menu-open");

      if (menuIsOpen) {
        sidePanel.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
      } else {
        sidePanel.classList.add("menu-open");
        menuToggle.setAttribute("aria-expanded", "true");
      }
    });
  }
}

function handleKeyboardShortcuts(event) {
  // esc closes the mobile menu if it is open
  if (event.key === "Escape") {
    closeMobileMenu();
  }
}

// nav page interactions
panelLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    const targetPage = link.getAttribute("data-page");

    showPage(targetPage);
    closeMobileMenu();
  });
});

// gets all form values and trims spaces
function getFormData() {
  return {
    title: document.querySelector("#event-name").value.trim(),
    category: document.querySelector("#event-category").value.trim(),
    dueDate: document.querySelector("#event-date").value.trim(),
    duration: document.querySelector("#event-duration").value.trim(),
    notes: document.querySelector("#event-notes").value.trim()
  };
}

function keepDurationNumbersOnly() {
  // this makes sure duration stays as numbers, simple but it works
  durationInput.value = durationInput.value.replace(/\D/g, "");
}

function keepCapNumbersOnly() {
  // same idea as duration, cap should only be numbers
  weeklyCapInput.value = weeklyCapInput.value.replace(/\D/g, "");
}

// save or update an event depending on hidden id
function handleFormSubmit(event) {
  event.preventDefault();

  const eventId = document.querySelector("#event-id").value;
  const eventData = getFormData();
  const errors = validateEventForm(eventData);

  setFieldErrors(errors);

  if (hasValidationErrors(errors)) {
    return;
  }

  if (eventId === "") {
    addEvent(eventData);
  } else {
    updateEvent(eventId, eventData);
  }

  resetEventForm();
  renderEvents();
  showPage("records");
}

// when edit is clicked, put the old info back in the form
function handleEditClick(eventId) {
  const eventItem = findEvent(eventId);

  if (eventItem !== null) {
    fillEventForm(eventItem);
    showPage("add-event");
  }
}

function handleDeleteClick(eventId) {
  const userConfirmed = confirm("Delete this event?");

  if (userConfirmed) {
    deleteEvent(eventId);
    renderEvents();
    resetEventForm();
  }
}

/* edit and delete buttons are made by javascript,
   so the click is handled from their parent containers */
function handleRecordActions(event) {
  const clickedButton = event.target;
  const eventId = clickedButton.getAttribute("data-id");

  if (eventId === null) {
    return;
  }

  if (clickedButton.classList.contains("row-edit-button")) {
    handleEditClick(eventId);
  }

  if (clickedButton.classList.contains("row-delete-button")) {
    handleDeleteClick(eventId);
  }
}

function handleSearchInput() {
  // rerender records each time the search box changes
  renderEvents();
}

function setActiveSortButton(sortType) {
  sortButtons.forEach(function (button) {
    if (button.getAttribute("data-sort") === sortType) {
      button.classList.add("active-sort");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.classList.remove("active-sort");
      button.setAttribute("aria-pressed", "false");
    }
  });
}

function handleSortClick(event) {
  const sortType = event.target.getAttribute("data-sort");

  if (sortType !== null) {
    setCurrentSort(sortType);
    setActiveSortButton(sortType);
    renderEvents();
  }
}

// collecting the settings inputs in one place makes saving easier
function getSettingsFormData() {
  return {
    reminders: document.querySelector("#notif-toggle").value,
    reminderTime: document.querySelector("#reminder-time").value,
    weekStart: document.querySelector("#week-start").value,
    timeUnit: document.querySelector("#time-unit").value,
    weeklyCap: document.querySelector("#weekly-cap").value.trim()
  };
}

function handleSettingsSave() {
  updateSettings(getSettingsFormData());
  renderEvents();
  showSettingsMessage("Settings saved.");
}

// export makes a json file from current app data
function exportPlannerData() {
  const appData = {
    events: getEvents(),
    settings: getSettings()
  };
  const dataText = JSON.stringify(appData, null, 2);
  const dataBlob = new Blob([dataText], { type: "application/json" });
  const downloadLink = document.createElement("a");

  downloadLink.href = URL.createObjectURL(dataBlob);
  downloadLink.download = "tedly-data.json";
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);
  showSettingsMessage("Export file created.");
}

function importPlannerData(event) {
  // file reader is used because the file is selected from the browser
  const selectedFile = event.target.files[0];
  const reader = new FileReader();

  if (selectedFile === undefined) {
    return;
  }

  reader.addEventListener("load", function () {
    try {
      const importedData = JSON.parse(reader.result);

      if (!isValidImportData(importedData)) {
        showSettingsMessage("Import failed. Check the JSON format.");
        return;
      }

      replaceAllData(importedData.events, importedData.settings);
      saveToStorage();
      fillSettingsForm();
      renderEvents();
      showSettingsMessage("Import finished.");
    } catch (error) {
      showSettingsMessage("Import failed. File was not valid JSON.");
    }
  });

  reader.readAsText(selectedFile);
  importInput.value = "";
}

// event listeners start here
if (eventForm !== null) {
  eventForm.addEventListener("submit", handleFormSubmit);
}

if (cancelButton !== null) {
  cancelButton.addEventListener("click", resetEventForm);
}

if (recordsTableBody !== null) {
  recordsTableBody.addEventListener("click", handleRecordActions);
}

if (recordCardList !== null) {
  recordCardList.addEventListener("click", handleRecordActions);
}

if (searchInput !== null) {
  searchInput.addEventListener("input", handleSearchInput);
}

if (durationInput !== null) {
  durationInput.addEventListener("input", keepDurationNumbersOnly);
}

if (weeklyCapInput !== null) {
  weeklyCapInput.addEventListener("input", keepCapNumbersOnly);
}

if (settingsSaveButton !== null) {
  settingsSaveButton.addEventListener("click", handleSettingsSave);
}

if (exportButton !== null) {
  exportButton.addEventListener("click", exportPlannerData);
}

if (importInput !== null) {
  importInput.addEventListener("change", importPlannerData);
}

document.addEventListener("keydown", handleKeyboardShortcuts);

sortButtons.forEach(function (button) {
  button.addEventListener("click", handleSortClick);
});

// app starts here
setupMobileMenu();
setActiveSortButton("date");
loadFromStorage();
fillSettingsForm();
renderEvents();
