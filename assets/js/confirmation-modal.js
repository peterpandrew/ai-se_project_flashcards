const confirmationModal = document.querySelector("#confirmation-modal");
const cancelButton = confirmationModal?.querySelector("[data-modal-cancel]");
const confirmButton = confirmationModal?.querySelector("[data-modal-confirm]");
let confirmCallback = null;

function closeConfirmationModal() {
  confirmCallback = null;
  confirmationModal?.close();
}

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
