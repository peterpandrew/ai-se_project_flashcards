import { hexToString, removeColorClasses } from "./colors.js";

function renderDeckView(deck) {
  const deckViewSection = document.querySelector("#deck-view");
  const deckViewTitle = deckViewSection?.querySelector(".gallery__title");
  const deckViewList = deckViewSection?.querySelector(".gallery__list");
  const cardTemplate = document.querySelector("#flashcard-template");

  if (!deckViewSection || !deckViewTitle || !deckViewList || !cardTemplate) {
    return;
  }

  console.log("Rendering deck view:", deck);
  deckViewTitle.textContent = deck.name;
  deckViewList.innerHTML = "";

  const colorName = hexToString(deck.color) || "green";

  function createCard(cardData) {
    const cardFragment = cardTemplate.content.cloneNode(true);
    const cardElement = cardFragment.querySelector(".flashcard");
    const cardText = cardFragment.querySelector(".flashcard__text");
    const flipButton = cardFragment.querySelector(".flashcard__flip-btn");
    let showingQuestion = true;

    function updateFace() {
      cardText.textContent = showingQuestion
        ? cardData.question
        : cardData.answer;
      removeColorClasses(cardElement);
      cardElement.classList.add(
        `card_color_${showingQuestion ? colorName : "white"}`,
      );
    }

    flipButton.addEventListener("click", () => {
      showingQuestion = !showingQuestion;
      flipButton.setAttribute(
        "aria-label",
        showingQuestion ? "Show answer" : "Show question",
      );
      updateFace();
    });

    updateFace();
    return cardFragment;
  }

  function renderCard(cardData) {
    const cardElement = createCard(cardData);
    deckViewList.append(cardElement);
  }

  deck.cards.forEach(renderCard);
}

export { renderDeckView };
