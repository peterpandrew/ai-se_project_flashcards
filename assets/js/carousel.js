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

  if (!carousel || !deck || !deck.cards || deck.cards.length === 0) {
    return;
  }

  const carouselTitle = carousel.querySelector(".carousel__title");
  const carouselCard = carousel.querySelector(".carousel__card");
  const carouselCardText = carousel.querySelector(".carousel__card-text");

  let leftBtn = carousel.querySelector(".carousel__btn_type_left");
  let rightBtn = carousel.querySelector(".carousel__btn_type_right");
  let flipBtn = carousel.querySelector(".carousel__btn_type_flip");

  // Reset event listeners by cloning button nodes
  if (leftBtn) {
    const cleanLeft = leftBtn.cloneNode(true);
    leftBtn.parentNode.replaceChild(cleanLeft, leftBtn);
    leftBtn = cleanLeft;
  }
  if (rightBtn) {
    const cleanRight = rightBtn.cloneNode(true);
    rightBtn.parentNode.replaceChild(cleanRight, rightBtn);
    rightBtn = cleanRight;
  }
  if (flipBtn) {
    const cleanFlip = flipBtn.cloneNode(true);
    flipBtn.parentNode.replaceChild(cleanFlip, flipBtn);
    flipBtn = cleanFlip;
  }

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

    if (leftBtn) {
      leftBtn.classList.toggle("carousel__btn_disabled", currentIndex === 0);
    }

    if (rightBtn) {
      rightBtn.classList.toggle(
        "carousel__btn_disabled",
        currentIndex === deck.cards.length - 1,
      );
    }
  }

  if (carouselCard) {
    carouselCard.dataset.deckId = deck.id;
  }

  if (leftBtn) {
    leftBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        showingQuestion = true;
        updateDisplay();
      }
    });
  }

  if (rightBtn) {
    rightBtn.addEventListener("click", () => {
      if (currentIndex < deck.cards.length - 1) {
        currentIndex += 1;
        showingQuestion = true;
        updateDisplay();
      }
    });
  }

  if (flipBtn) {
    flipBtn.addEventListener("click", () => {
      showingQuestion = !showingQuestion;
      updateDisplay();
    });
    flipBtn.setAttribute("aria-label", "Flip card");
  }

  updateDisplay();
}

export { renderCarouselView };
