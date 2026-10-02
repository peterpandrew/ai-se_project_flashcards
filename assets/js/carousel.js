import { hexToString, removeColorClasses } from "./colors.js";

function getCarouselTitleString(deck, cardIndex) {
  return `${deck.name} · ${cardIndex + 1}/${deck.cards.length}`;
}

function renderCarouselView(deck) {
  const carousel = document.querySelector(".carousel");
  const deckView = document.querySelector("#deck-view");

  if (deckView) {
    deckView.hidden = true;
  }

  if (!carousel || !deck) {
    return;
  }

  const carouselTitle = carousel.querySelector(".carousel__title");
  const carouselCard = carousel.querySelector(".carousel__card");
  const carouselCardText = carousel.querySelector(".carousel__card-text");
  const flipButton = carousel.querySelector(".carousel__btn_type_flip");
  const leftButton = carousel.querySelector(".carousel__btn_type_left");
  const rightButton = carousel.querySelector(".carousel__btn_type_right");
  let currentIndex = 0;
  let showingQuestion = true;

  function updateDisplay() {
    const currentCard = deck.cards[currentIndex];

    if (!currentCard || !carouselCardText || !carouselCard) {
      return;
    }

    if (carouselTitle) {
      carouselTitle.textContent = getCarouselTitleString(deck, currentIndex);
    }

    const colorName = hexToString(deck.color) || "green";
    removeColorClasses(carouselCard);
    removeColorClasses(carouselCardText);

    if (showingQuestion) {
      carouselCardText.textContent = currentCard.question;
      carouselCardText.classList.add(`carousel__card_color_${colorName}`);
    } else {
      carouselCardText.textContent = currentCard.answer;
      carouselCardText.classList.add("carousel__card_color_white");
    }

    if (leftButton) {
      leftButton.classList.toggle("carousel__btn_disabled", currentIndex === 0);
    }

    if (rightButton) {
      rightButton.classList.toggle(
        "carousel__btn_disabled",
        currentIndex === deck.cards.length - 1,
      );
    }
  }

  if (carouselCard) {
    carouselCard.dataset.deckId = deck.id;
  }

  if (leftButton) {
    leftButton.onclick = () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        showingQuestion = true;
        updateDisplay();
      }
    };
  }

  if (rightButton) {
    rightButton.addEventListener("click", () => {
      if (currentIndex < deck.cards.length - 1) {
        currentIndex += 1;
        showingQuestion = true;
        updateDisplay();
      }
    });
  }

  if (flipButton) {
    flipButton.addEventListener("click", () => {
      showingQuestion = !showingQuestion;
      updateDisplay();
    });
    flipButton.setAttribute("aria-label", "Flip card");
  }

  updateDisplay();
}

export { renderCarouselView };
