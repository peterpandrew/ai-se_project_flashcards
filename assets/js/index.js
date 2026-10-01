import { decks } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { openConfirmationModal } from "./confirmation-modal.js";

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

const footerMobileActions = document.querySelector(".footer__mobile-actions");
const footerPracticeBtn = document.querySelector(
  ".gallery__practice-btn_location_footer",
);

const sections = [
  homeSection,
  deckViewSection,
  carouselSection,
  aboutSection,
  notFoundSection,
].filter(Boolean);

function showView(currentSection, display) {
  sections.forEach((section) => {
    section.style.display = "";
    section.hidden = section !== currentSection;
  });

  if (currentSection) {
    currentSection.style.display = display;
  }
}

function updateMobileFooter(viewMode) {
  if (!footerMobileActions) return;

  if (viewMode === "deck") {
    footerMobileActions.classList.add("footer__mobile-actions_deck");
    footerMobileActions.classList.remove("footer__mobile-actions_home");
  } else {
    footerMobileActions.classList.add("footer__mobile-actions_home");
    footerMobileActions.classList.remove("footer__mobile-actions_deck");
  }
}

function startPractice() {
  if (currentDeck) {
    window.location.hash = `#carousel/${currentDeck.id}`;
  }
}

practiceButton?.addEventListener("click", startPractice);
footerPracticeBtn?.addEventListener("click", startPractice);

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
  deckCount.textContent = `${item.cards.length} cards`;
  deckCount.setAttribute("aria-label", `Open ${item.name} flashcard deck`);

  deckEl.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("card__btn_type_delete")) return;
    currentDeck = item;
    window.location.hash = `#deck/${item.id}`;
  });

  deleteButton?.addEventListener("click", (evt) => {
    evt.stopPropagation();
    openConfirmationModal(() => {
      const deckIndex = decks.indexOf(item);
      if (deckIndex !== -1) decks.splice(deckIndex, 1);
      deckEl.remove();
    });
  });

  return deckClone;
}

function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  const newCardBtnItem = deckList.querySelector(
    "li:has(.gallery__new-card-btn)",
  );
  if (newCardBtnItem) {
    deckList.insertBefore(deckEl, newCardBtnItem);
  } else {
    deckList.prepend(deckEl);
  }
}

function renderView() {
  const currentHash = window.location.hash || "#home";

  if (
    currentHash.startsWith("#deck-view") ||
    currentHash.startsWith("#deck/")
  ) {
    const deckId = currentHash.split("/")[1] || decks[0]?.id;
    const deck = decks.find((item) => item.id === deckId);

    if (!deck) {
      updateMobileFooter("home");
      showView(notFoundSection, "block");
      return;
    }

    currentDeck = deck;
    renderDeckView(deck);
    mainContent?.classList.remove("page__main-content_location_carousel");
    showView(deckViewSection, "block");
    updateMobileFooter("deck");
    window.scrollTo(0, 0);
    return;
  }

  if (currentHash.startsWith("#carousel")) {
    const deckId = currentHash.split("/")[1] || decks[0]?.id;
    const deck = decks.find((item) => item.id === deckId);

    if (!deck) {
      if (header) header.hidden = false;
      if (footer) footer.hidden = false;
      updateMobileFooter("home");
      showView(notFoundSection, "block");
      return;
    }

    renderCarouselView(deck);
    mainContent?.classList.add("page__main-content_location_carousel");
    showView(carouselSection, "flex");
    updateMobileFooter("deck");

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

  showView(targetSection, "block");
  updateMobileFooter("home");
}

if (deckTemplate && deckList) {
  deckList.querySelectorAll(".card").forEach((el) => el.remove());
  decks.forEach(renderDeckEl);
}

if (homeSection && carouselSection && aboutSection && notFoundSection) {
  window.addEventListener("hashchange", renderView);
  window.addEventListener("DOMContentLoaded", renderView);
}
