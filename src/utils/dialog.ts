import { modalState } from "./modal";
import { DomClient } from "../services/domClient";

const dom = new DomClient();

type ConfirmOptions = {
  message: string;
  confirmText?: string;
  cancelText?: string;
};

type AlertOptions = {
  message: string;
  confirmText?: string;
};

type PromptOptions = {
  message: string;
  confirmText?: string;
  cancelText?: string;
};
const body = dom.getBody(document);

function openModal(modal: HTMLElement) {
    modalState(modal, body, 'open');    
}

function closeModal(modal: HTMLElement) {
  modalState(modal, body, 'close');
}

export function customConfirm({ message, confirmText = "Confirm", cancelText = "Cancel" }: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const modal = dom.getElementById(document, "confirm-dialog-modal") as HTMLElement;
    const messageElement = modal.querySelector(".confirm-dialog-message") as HTMLElement;
    const confirmBtn = modal.querySelector(".confirm-dialog-confirm") as HTMLButtonElement;
    const cancelBtn = modal.querySelector(".confirm-dialog-cancel") as HTMLButtonElement;
    const closeBtn = modal.querySelector(".close-modal") as HTMLElement;

    messageElement.textContent = message;
    confirmBtn.textContent = confirmText;
    cancelBtn.textContent = cancelText;

    const cleanup = () => {
      confirmBtn.removeEventListener("click", onConfirm);
      cancelBtn.removeEventListener("click", onCancel);
      closeBtn.removeEventListener("click", onCancel);
    };

    const onConfirm = () => {
      cleanup();
      closeModal(modal);
      resolve(true);
    };

    const onCancel = () => {
      cleanup();
      closeModal(modal);
      resolve(false);
    };

    confirmBtn.addEventListener("click", onConfirm);
    cancelBtn.addEventListener("click", onCancel);
    closeBtn.addEventListener("click", onCancel);

    openModal(modal);
  });
}

export function customAlert({ message, confirmText = "OK" }: AlertOptions): Promise<void> {
  return new Promise((resolve) => {
    const modal = document.getElementById("alert-dialog-modal") as HTMLElement;
    const msgEl = modal.querySelector(".alert-dialog-message") as HTMLElement;
    const confirmBtn = modal.querySelector(".alert-dialog-confirm") as HTMLButtonElement;
    const closeBtn = modal.querySelector(".close-modal") as HTMLElement;

    msgEl.textContent = message;
    confirmBtn.textContent = confirmText;

    const cleanup = () => {
      confirmBtn.removeEventListener("click", onConfirm);
      closeBtn.removeEventListener("click", onConfirm);
    };

    const onConfirm = () => {
      cleanup();
      closeModal(modal);
      resolve();
    };

    confirmBtn.addEventListener("click", onConfirm);
    closeBtn.addEventListener("click", onConfirm);

    openModal(modal);
  });
}

export function customPrompt({ message, confirmText = "OK", cancelText = "Cancel" }: PromptOptions): Promise<string | null> {
  return new Promise((resolve) => {
    const modal = document.getElementById("prompt-dialog-modal") as HTMLElement;
    const msgEl = modal.querySelector(".prompt-dialog-message") as HTMLElement;
    const confirmBtn = modal.querySelector(".prompt-dialog-confirm") as HTMLButtonElement;
    const cancelBtn = modal.querySelector(".prompt-dialog-cancel") as HTMLButtonElement;
    const closeBtn = modal.querySelector(".close-modal") as HTMLElement;

    // Add an input field dynamically (or you can place it in HTML if you want it permanent)
    let input = modal.querySelector("input") as HTMLInputElement;
    if (!input) {
      input = document.createElement("input");
      input.type = "text";
      modal.querySelector(".modal-content")?.insertBefore(input, modal.querySelector(".prompt-dialog-actions"));
    }

    msgEl.textContent = message;
    confirmBtn.textContent = confirmText;
    cancelBtn.textContent = cancelText;
    input.value = "";

    const cleanup = () => {
      confirmBtn.removeEventListener("click", onConfirm);
      cancelBtn.removeEventListener("click", onCancel);
      closeBtn.removeEventListener("click", onCancel);
    };

    const onConfirm = () => {
      cleanup();
      closeModal(modal);
      resolve(input.value);
    };

    const onCancel = () => {
      cleanup();
      closeModal(modal);
      resolve(null);
    };

    confirmBtn.addEventListener("click", onConfirm);
    cancelBtn.addEventListener("click", onCancel);
    closeBtn.addEventListener("click", onCancel);

    openModal(modal);
    input.focus();
  });
}
