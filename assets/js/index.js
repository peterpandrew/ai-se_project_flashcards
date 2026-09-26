import { decks } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

const deckTemplate = document.querySelector("#card-template");
const deckList = document.querySelector(".gallery__list");
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
  const deckEl = deckClone.querySelector(".card");
  const deckTitle = deckClone.querySelector(".card__title");
  const deckCount = deckClone.querySelector(".card__count");
  const deleteButton = deckClone.querySelector(".card__delete");
  const colorName = hexToString(item.color) || "green";

  removeColorClasses(deckEl);
  deckEl.classList.add(`card_color_${colorName}`);

  deckTitle.textContent = item.name;
  deckCount.textContent = `${item.cards.length}`;
  deckCount.setAttribute("aria-label", `Open ${item.name} flashcard deck`);

  deckCount?.addEventListener("click", () => {
    window.location.hash = `#carousel/${item.id}`;
  });

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
  deckList.querySelector(".card")?.remove();
  decks.forEach(renderDeckEl);
}

if (homeSection && carouselSection && aboutSection && notFoundSection) {
  window.addEventListener("hashchange", renderView);
  window.addEventListener("DOMContentLoaded", renderView);
}
