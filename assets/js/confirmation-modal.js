const confirmationModal = document.querySelector("#confirmation-modal");
const cancelButton = confirmationModal?.querySelector("[data-modal-cancel]");
const confirmButton = confirmationModal?.querySelector("[data-modal-confirm]");
let confirmCallback = null;

/**
 * Clears the pending confirmation action and closes the modal.
 *
 * @returns {void}
 */
function closeConfirmationModal() {
  confirmCallback = null;
  confirmationModal?.close();
}

/**
 * Opens the confirmation modal and stores the action to run on confirmation.
 *
 * @param {Function} callback - The action to run if the user confirms.
 * @returns {void}
 */
function openConfirmationModal(callback) {
  if (!confirmationModal || typeof callback !== "function") {
    return;
  }

  confirmCallback = callback;
  confirmationModal.showModal();
}

cancelButton?.addEventListener("click", closeConfirmationModal);

confirmButton?.addEventListener("click", () => {
  const callback = confirmCallback;
  closeConfirmationModal();
  callback?.();
});

confirmationModal?.addEventListener("cancel", () => {
  confirmCallback = null;
});

confirmationModal?.addEventListener("click", (event) => {
  if (event.target === confirmationModal) {
    closeConfirmationModal();
  }
});

export { openConfirmationModal };
