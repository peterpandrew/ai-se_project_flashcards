import { hexToString, removeColorClasses } from "./colors.js";
import { openConfirmationModal } from "./confirmation-modal.js";

function renderDeckView(deck) {
  const deckViewSection = document.querySelector("#deck-view");
  const deckViewTitle = deckViewSection?.querySelector(".gallery__title");
  const deckViewList = deckViewSection?.querySelector(".gallery__list");
  const cardTemplate = document.querySelector("#flashcard-template");

  if (!deckViewSection || !deckViewTitle || !deckViewList || !cardTemplate) {
    return;
  }

  deckViewTitle.textContent = deck.name || "Untitled Deck";
  deckViewList.innerHTML = "";

  const colorName = hexToString(deck.color) || "green";

  function createCard(cardData) {
    const cardFragment = cardTemplate.content.cloneNode(true);
    const cardElement = cardFragment.querySelector(".flashcard");

    if (!cardElement) return null;

    const cardText = cardElement.querySelector(".flashcard__text");
    const flipButton = cardElement.querySelector(".flashcard__btn_type_flip");
    const deleteButton = cardElement.querySelector(
      ".flashcard__btn_type_delete",
    );

    let showingQuestion = true;

    function updateFace() {
      if (cardText) {
        cardText.textContent = showingQuestion
          ? cardData.question
          : cardData.answer;
      }

      // Preserve the deck's color when flipped
      removeColorClasses(cardElement);
      cardElement.classList.add("flashcard", "card", `card_color_${colorName}`);
    }

    // Flip Button Listener
    flipButton?.addEventListener("click", (evt) => {
      evt.stopPropagation();
      showingQuestion = !showingQuestion;
      flipButton.setAttribute(
        "aria-label",
        showingQuestion ? "Show answer" : "Show question",
      );
      updateFace();
    });

    // Delete Button Listener
    deleteButton?.addEventListener("click", (evt) => {
      evt.stopPropagation();
      openConfirmationModal(() => {
        if (Array.isArray(deck.cards)) {
          const cardIndex = deck.cards.indexOf(cardData);
          if (cardIndex !== -1) deck.cards.splice(cardIndex, 1);
        }
        cardElement.remove();
      });
    });

    updateFace();
    return cardElement;
  }

  if (Array.isArray(deck.cards)) {
    deck.cards.forEach((cardData) => {
      const cardEl = createCard(cardData);
      if (cardEl) {
        deckViewList.append(cardEl);
      }
    });
  }
}

export { renderDeckView };
