import { modalState, addEventListenerToModal } from "./modal";
import { DomClient } from "../scripts/services/domClient";

const dom = new DomClient();

type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

type AlertOptions = {
  title: string;
  message: string;
  confirmText?: string;
};

type PromptOptions = {
  title: string;
  message: string;
  inputPlaceholder?: string;
  inputLabel?: string;
  confirmText?: string;
  cancelText?: string;
};
const body = dom.getBody(document);

function openModal(modal: HTMLElement) {
    modalState(modal, body, 'open');
    addEventListenerToModal(modal, body);
}

function closeModal(modal: HTMLElement) {
  modalState(modal, body, 'close');
}

export function customConfirm({ title, message, confirmText = "Confirm", cancelText = "Cancel" }: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const modal = dom.getElementById(document, "confirm-dialog-modal") as HTMLElement;
    const titleElement = modal.querySelector(".confirm-dialog-title") as HTMLElement;
    const messageElement = modal.querySelector(".confirm-dialog-message") as HTMLElement;
    const confirmBtn = modal.querySelector(".dialog-confirm") as HTMLButtonElement;
    const cancelBtn = modal.querySelector(".dialog-cancel") as HTMLButtonElement;
    const closeBtn = modal.querySelector(".close-modal") as HTMLElement;
    
    titleElement.textContent = title;
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

export function customAlert({ title, message, confirmText = "OK" }: AlertOptions): Promise<void> {
  return new Promise((resolve) => {
    const modal = document.getElementById("alert-dialog-modal") as HTMLElement;
    const titleEl = modal.querySelector(".alert-dialog-title") as HTMLElement;
    const msgEl = modal.querySelector(".alert-dialog-message") as HTMLElement;
    const confirmBtn = modal.querySelector(".dialog-confirm") as HTMLButtonElement;
    const closeBtn = modal.querySelector(".close-modal") as HTMLElement;

    titleEl.textContent = title;
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

export function customPrompt({ title, message, inputPlaceholder = "Deine Eingabe", inputLabel = "Eingabe:", confirmText = "OK", cancelText = "Abbrechen" }: PromptOptions): Promise<string | null> {
  return new Promise((resolve) => {
    const modal = document.getElementById("prompt-dialog-modal") as HTMLElement;
    const titleEl = modal.querySelector(".prompt-dialog-title") as HTMLElement;
    const msgEl = modal.querySelector(".prompt-dialog-message") as HTMLElement;
    const confirmBtn = modal.querySelector(".dialog-confirm") as HTMLButtonElement;
    const cancelBtn = modal.querySelector(".dialog-cancel") as HTMLButtonElement;
    const closeBtn = modal.querySelector(".close-modal") as HTMLElement;

    const input = modal.querySelector(".prompt-dialog-input") as HTMLInputElement;
    const inputLabelEl = modal.querySelector(".prompt-dialog-input-label") as HTMLElement;

    inputLabelEl.textContent = inputLabel;
    input.placeholder = inputPlaceholder;
    input.value = "";
    titleEl.textContent = title;
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

