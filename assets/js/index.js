import { decks } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

const deckTemplate = document.querySelector("#deck-template");
const deckList = document.querySelector(".decks__list");
const homeSection = document.querySelector("#home");
const carouselSection = document.querySelector("#carousel");
const aboutSection = document.querySelector("#about");
const notFoundSection = document.querySelector("#not-found");
const mainContent = document.querySelector(".page__main-content");
const header = document.querySelector(".header");
const footer = document.querySelector(".footer");

const sections = [
  homeSection,
  carouselSection,
  aboutSection,
  notFoundSection,
].filter(Boolean);

function createDeckEl(item) {
  const deckClone = deckTemplate.content.cloneNode(true);
  const deckEl = deckClone.querySelector(".deck");
  const deckLink = deckClone.querySelector(".deck__link");
  const deckTitle = deckClone.querySelector(".deck__title");
  const deckCount = deckClone.querySelector(".deck__count");
  const deleteButton = deckClone.querySelector(".deck__delete");
  const colorName = hexToString(item.color) || "green";

  removeColorClasses(deckEl);
  deckEl.classList.add(`deck_color_${colorName}`);

  // Set explicit hash including item ID
  deckLink.href = `#carousel/${item.id}`;

  deckTitle.textContent = item.name;
  deckCount.textContent = `${item.cards.length}`;

  deleteButton?.addEventListener("click", () => {
    deckEl.remove();
  });

  return deckClone;
}

function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  deckList.prepend(deckEl);
}

function renderView() {
  const currentHash = window.location.hash || "#home";

  if (currentHash.startsWith("#carousel")) {
    const deckId = currentHash.split("/")[1] || decks[0]?.id;
    const deck = decks.find((item) => item.id === deckId);

    if (!deck) {
      if (header) header.hidden = false;
      if (footer) footer.hidden = false;
      sections.forEach((section) => {
        section.hidden = section !== notFoundSection;
        if (section === carouselSection) section.style.display = "none";
      });
      return;
    }

    renderCarouselView(deck);
    mainContent?.classList.add("page__main-content_location_carousel");

    // Hide home/decks, show ONLY carousel
    sections.forEach((section) => {
      section.hidden = section !== carouselSection;
    });
    carouselSection.style.display = "flex";

    window.scrollTo(0, 0);
    return;
  }

  mainContent?.classList.remove("page__main-content_location_carousel");

  const targetSection =
    currentHash === "#home"
      ? homeSection
      : currentHash === "#about"
        ? aboutSection
        : notFoundSection;

  sections.forEach((section) => {
    section.hidden = section !== targetSection;
    if (section === carouselSection) section.style.display = "none";
  });
}

if (deckTemplate && deckList) {
  deckList.querySelector(".deck")?.remove();
  decks.forEach(renderDeckEl);
}

if (homeSection && carouselSection && aboutSection && notFoundSection) {
  window.addEventListener("hashchange", renderView);
  window.addEventListener("DOMContentLoaded", renderView);
}
