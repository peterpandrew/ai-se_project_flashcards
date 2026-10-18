const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";
const headers = {
  "Content-Type": "application/json",
  Authorization: "01a15010-9217-7286-8f66-0dbec4531155",
};

/**
 * Parses a successful API response as JSON or rejects with its HTTP status.
 *
 * @param {Response} response - The response returned by fetch.
 * @returns {Promise<unknown>} The parsed response body.
 */
function processResponse(response) {
  if (response.ok) {
    return response.json();
  }

  return Promise.reject(`Error: ${response.status}`);
}

/**
 * Retrieves all decks from the API.
 *
 * @returns {Promise<Array<object>>} The fetched decks.
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Deletes a deck by its database ID.
 *
 * @param {string} deckId - The ID of the deck to delete.
 * @returns {Promise<unknown>} The parsed API response.
 */
function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

/**
 * Creates a deck through the API.
 *
 * @param {{name: string, color: string, cards: Array<object>}} deckData - The deck data to create.
 * @returns {Promise<object>} The created deck, including its database ID.
 */
function addDeck(deckData) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    headers,
    body: JSON.stringify(deckData),
  }).then(processResponse);
}

export { getDecks, deleteDeck, addDeck };
