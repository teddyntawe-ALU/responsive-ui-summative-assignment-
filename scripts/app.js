//nav page interactions //

const panelLinks = document.querySelectorAll(".panel-link");
const pageSections = document.querySelectorAll(".page-section");

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
  });
});