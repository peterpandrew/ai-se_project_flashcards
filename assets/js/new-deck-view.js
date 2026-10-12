import { decks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const form = document.querySelector("#new-deck-form");
const submitBtn = form?.querySelector(".new-deck-view__submit");
const textarea = form?.querySelector(".new-deck-view__textarea");
const errorModal = document.querySelector("#error-modal");
const errorModalCloseButton = errorModal?.querySelector(
  ".modal__close-button",
);
const errorModalMessage = errorModal?.querySelector(".modal__error");

errorModalCloseButton?.addEventListener("click", () => {
  errorModal?.classList.remove("modal_visible");
});

function showError(message) {
  if (!errorModal || !errorModalMessage) {
    throw new Error("Error modal elements were not found.");
  }
  errorModalMessage.textContent = message;
  errorModal.classList.add("modal_visible");
}

function validateName(name) {
  if (typeof name !== "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
  if (!color) return "#64d583";
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}

function disableSubmitBtn() {
  if (submitBtn) {
    submitBtn.disabled = false;
  }
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(form));
  const jsonData = parseJSON(textarea.value);
  if (jsonData === null) {
    showError("Please enter valid JSON for your deck.");
    return;
  }
  if (typeof jsonData !== "object" || Array.isArray(jsonData)) {
    showError("Your deck must be a JSON object with a name and cards.");
    return;
  }
  const name = validateName(jsonData.name);
  if (name === null) {
    showError("Your deck name must be a string between 2 and 80 characters.");
    return;
  }
  if (!Array.isArray(jsonData.cards)) {
    showError("Your deck's cards field must be an array.");
    return;
  }

  const colorValue = normalizeColor(formData["deck-color"]);
  if (
    typeof jsonData.color === "string" &&
    jsonData.color.toLowerCase() !== colorValue
  ) {
    showError(
      "The color in your JSON must match the color selected in the picker.",
    );
    return;
  }

  const id = `${slugify(name)}-${Date.now()}`;

  decks.push({
    id,
    color: colorValue,
    name,
    cards: jsonData.cards,
  });

  window.location.hash = `#deck/${id}`;
});

export { disableSubmitBtn };
