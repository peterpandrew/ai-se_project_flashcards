import { fetchedDecks, getDeckByID } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { openConfirmationModal } from "./confirmation-modal.js";
import { disableSubmitBtn, showError } from "./new-deck-view.js";
import { getDecks, deleteDeck } from "./api.js";

const deckTemplate = document.querySelector("#card-template");
const deckList = document.querySelector("#home .gallery__list");
const newDeckButton = document.querySelector("#home .gallery__new-card-btn");
const footerNewDeckButton = document.querySelector(
  ".footer__btn_type_new-card",
);
const homeSection = document.querySelector("#home");
const newDeckSection = document.querySelector("#new-deck-view");
const deckViewSection = document.querySelector("#deck-view");
const practiceButton = deckViewSection?.querySelector(".gallery__practice-btn");
let currentDeck = null;
const carouselSection = document.querySelector("#carousel");
const aboutSection = document.querySelector("#about");
const notFoundSection = document.querySelector("#not-found");
const mainContent = document.querySelector(".page__main-content");
const header = document.querySelector(".header");
const footer = document.querySelector(".footer");

// Mobile Footer Elements
const footerMobileActions = document.querySelector(".footer__mobile-actions");
const footerPracticeBtn = document.querySelector(".footer__btn_type_practice");

const sections = [
  homeSection,
  newDeckSection,
  deckViewSection,
  carouselSection,
  aboutSection,
  notFoundSection,
].filter(Boolean);

/**
 * Displays one view section and hides the other registered sections.
 *
 * @param {HTMLElement|null} currentSection - The section to display.
 * @param {string} display - The CSS display value for the active section.
 * @returns {void}
 */
function showView(currentSection, display) {
  sections.forEach((section) => {
    section.style.display = "";
    section.hidden = section !== currentSection;
  });

  if (currentSection) {
    currentSection.style.display = display;
  }
}

/**
 * Updates the mobile footer's classes for the current view mode.
 *
 * @param {string} viewMode - "deck" to show deck actions, otherwise home actions.
 * @returns {void}
 */
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

/**
 * Navigates to practice mode for the currently selected deck.
 *
 * @returns {void}
 */
function startPractice() {
  if (currentDeck) {
    window.location.hash = `#carousel/${currentDeck._id}`;
  }
}

practiceButton?.addEventListener("click", startPractice);
footerPracticeBtn?.addEventListener("click", startPractice);

/**
 * Creates a deck list item and attaches its navigation and delete actions.
 *
 * @param {object} item - The deck represented by the element.
 * @returns {HTMLElement|null} The deck element, or null if its template is invalid.
 */
function createDeckEl(item) {
  if (!deckTemplate) return null;

  const deckClone = deckTemplate.content.cloneNode(true);
  const deckEl = deckClone.querySelector(".card");

  if (!deckEl) return null;

  const deckTitle = deckEl.querySelector(".card__title");
  const deckCount = deckEl.querySelector(".card__count");
  const deleteButton = deckEl.querySelector(".card__btn_type_delete");
  const colorName = hexToString(item.color) || "green";

  removeColorClasses(deckEl);
  deckEl.classList.add("card", `card_color_${colorName}`);

  if (deckTitle) deckTitle.textContent = item.name;
  if (deckCount) {
    deckCount.textContent = `${item.cards.length} cards`;
    deckCount.setAttribute("aria-label", `Open ${item.name} flashcard deck`);
  }

  // Clicking on the deck navigates to deck view (#deck/:id)
  deckEl.addEventListener("click", (evt) => {
    if (evt.target.closest(".card__btn_type_delete")) return;
    currentDeck = item;
    window.location.hash = `#deck/${item._id}`;
  });

  deleteButton?.addEventListener("click", (evt) => {
    evt.stopPropagation();
    openConfirmationModal(() => {
      deleteDeck(item._id)
        .then(() => {
          const deckIndex = fetchedDecks.indexOf(item);
          if (deckIndex !== -1) fetchedDecks.splice(deckIndex, 1);
          deckEl.remove();
        })
        .catch(showError);
    });
  });

  return deckEl;
}

/**
 * Adds a rendered deck element to the home deck list.
 *
 * @param {object} item - The deck to render and add.
 * @returns {void}
 */
function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  if (!deckEl || !deckList) return;

  const newDeckBtnItem = deckList
    .querySelector(".gallery__new-card-btn")
    ?.closest("li");

  if (newDeckBtnItem) {
    deckList.insertBefore(deckEl, newDeckBtnItem);
  } else {
    deckList.appendChild(deckEl);
  }
}

/**
 * Navigates to the new-deck view.
 *
 * @returns {void}
 */
function openNewDeckView() {
  window.location.hash = "#new-deck";
}

newDeckButton?.addEventListener("click", openNewDeckView);
footerNewDeckButton?.addEventListener("click", openNewDeckView);

/**
 * Displays the view corresponding to the current URL hash.
 *
 * @returns {void}
 */
function router() {
  const currentHash = window.location.hash || "#home";

  if (
    currentHash.startsWith("#deck-view") ||
    currentHash.startsWith("#deck/")
  ) {
    const deckId = currentHash.split("/")[1] || fetchedDecks[0]?._id;
    const deck = getDeckByID(deckId);

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
    const deckId =
      currentHash.split("/")[1] || currentDeck?._id || fetchedDecks[0]?._id;
    const deck = getDeckByID(deckId);

    if (!deck) {
      if (header) header.hidden = false;
      if (footer) footer.hidden = false;
      updateMobileFooter("home");
      showView(notFoundSection, "block");
      return;
    }

    currentDeck = deck;
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
      : currentHash === "#new-deck" || currentHash === "#new-deck-view"
        ? newDeckSection
        : currentHash === "#about"
          ? aboutSection
          : notFoundSection;

  if (currentHash === "#new-deck" || currentHash === "#new-deck-view") {
    disableSubmitBtn();
  }

  showView(targetSection, "block");
  updateMobileFooter("home");
}

if (
  homeSection &&
  newDeckSection &&
  carouselSection &&
  aboutSection &&
  notFoundSection
) {
  window.addEventListener("DOMContentLoaded", () => {
    if (deckList) {
      deckList.querySelectorAll(".card").forEach((el) => el.remove());
    }
    window.addEventListener("hashchange", router);

    getDecks()
      .then((decks) => {
        fetchedDecks.push(...decks);
        decks.forEach(renderDeckEl);
      })
      .catch(showError)
      .finally(() => {
        router();
      });
  });
}
