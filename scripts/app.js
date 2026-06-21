//nav page interactions //

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

function closeMobileMenu() {
  if (sidePanel !== null && menuToggle !== null) {
    sidePanel.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
}

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

panelLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    const targetPage = link.getAttribute("data-page");

    showPage(targetPage);
    closeMobileMenu();
  });
});

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
    } else {
      button.classList.remove("active-sort");
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

sortButtons.forEach(function (button) {
  button.addEventListener("click", handleSortClick);
});

setupMobileMenu();
setActiveSortButton("date");
renderEvents();
