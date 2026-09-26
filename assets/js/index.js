import { decks } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";

const deckTemplate = document.querySelector("#card-template");
const deckList = document.querySelector("#home .gallery__list");
const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const practiceButton = deckViewSection?.querySelector(".gallery__practice-btn");
let currentDeck = null;
const carouselSection = document.querySelector("#carousel");
const aboutSection = document.querySelector("#about");
const notFoundSection = document.querySelector("#not-found");
const mainContent = document.querySelector(".page__main-content");
const header = document.querySelector(".header");
const footer = document.querySelector(".footer");

const sections = [
  homeSection,
  deckViewSection,
  carouselSection,
  aboutSection,
  notFoundSection,
].filter(Boolean);

practiceButton?.addEventListener("click", () => {
  if (currentDeck) {
    window.location.hash = `#carousel/${currentDeck.id}`;
  }
});

function createDeckEl(item) {
  const deckClone = deckTemplate.content.cloneNode(true);
  const deckEl = deckClone.querySelector(".card");
  const deckTitle = deckClone.querySelector(".card__title");
  const deckCount = deckClone.querySelector(".card__count");
  const deleteButton = deckClone.querySelector(".card__btn_type_delete");
  const colorName = hexToString(item.color) || "green";

  removeColorClasses(deckEl);
  deckEl.classList.add(`card_color_${colorName}`);

  deckTitle.textContent = item.name;
  deckCount.textContent = `${item.cards.length}`;
  deckCount.setAttribute("aria-label", `Open ${item.name} flashcard deck`);

  deckCount?.addEventListener("click", () => {
    currentDeck = item;
    window.location.hash = `#deck/${item.id}`;
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

  if (currentHash.startsWith("#deck-view")) {
    const deckId = currentHash.split("/")[1] || decks[0]?.id;
    const deck = decks.find((item) => item.id === deckId);

    if (!deck) {
      sections.forEach((section) => {
        section.hidden = section !== notFoundSection;
        if (section === carouselSection) section.style.display = "none";
      });
      return;
    }

    currentDeck = deck;
    renderDeckView(deck);
    mainContent?.classList.remove("page__main-content_location_carousel");
    if (deckViewSection) deckViewSection.style.display = "block";
    sections.forEach((section) => {
      const isDeckView = section === deckViewSection;
      section.hidden = !isDeckView;
      if (section === carouselSection) section.style.display = "none";
      if (section === notFoundSection) section.hidden = true;
    });
    window.scrollTo(0, 0);
    return;
  } else if (currentHash.startsWith("#deck/")) {
    const deckId = currentHash.split("/")[1];
    const deck = decks.find((item) => item.id === deckId);

    if (!deck) {
      sections.forEach((section) => {
        section.hidden = section !== notFoundSection;
        if (section === carouselSection) section.style.display = "none";
        if (section === deckViewSection) section.hidden = true;
      });
      return;
    }

    currentDeck = deck;
    renderDeckView(deck);
    mainContent?.classList.remove("page__main-content_location_carousel");
    sections.forEach((section) => {
      section.hidden = section !== deckViewSection;
      if (section === carouselSection) section.style.display = "none";
    });
    if (deckViewSection) deckViewSection.style.display = "block";
    window.scrollTo(0, 0);
    return;
  }

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
    if (deckViewSection) deckViewSection.hidden = true;

    sections.forEach((section) => {
      section.hidden = section !== carouselSection;
      if (section === deckViewSection) section.hidden = true;
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

  if (deckViewSection) deckViewSection.hidden = true;
  sections.forEach((section) => {
    const shouldShowDeckView =
      section === deckViewSection && targetSection === deckViewSection;
    const shouldShowCurrent = section === targetSection;
    section.hidden = !shouldShowCurrent && !shouldShowDeckView;
    if (section === carouselSection) section.style.display = "none";
    if (section === deckViewSection) section.style.display = "block";
    if (section === deckViewSection && targetSection !== deckViewSection) {
      section.hidden = true;
    }
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
