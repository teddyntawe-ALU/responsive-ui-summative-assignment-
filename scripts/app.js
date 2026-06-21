//nav page interactions //

const panelLinks = document.querySelectorAll(".panel-link");
const pageSections = document.querySelectorAll(".page-section");
const menuToggle = document.querySelector("#menu-toggle");
const sidePanel = document.querySelector("#side-panel");

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

    // hide every section, then show the one that matches the clicked link
    pageSections.forEach(function (section) {
      if (section.id === targetPage) {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    });

    // remove active state from all links, then add it back to the one clicked
    panelLinks.forEach(function (item) {
      item.classList.remove("active");
    });
    link.classList.add("active");
    closeMobileMenu();
  });
});

setupMobileMenu();
