const fetchedDecks = [];

/**
 * Retrieves a deck object by its ID from the fetched decks array.
 *
 * @param {string} deckId - The unique identifier of the deck to retrieve.
 * @returns {object|undefined} The deck object if found, or undefined otherwise.
 */
function getDeckByID(deckId) {
  return fetchedDecks.find((deck) => String(deck._id) === String(deckId));
}

export { fetchedDecks, getDeckByID };
