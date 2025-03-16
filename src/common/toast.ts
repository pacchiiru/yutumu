import { ToastMessages } from '../const/toast-messages';
import { ToastAction } from '../const/toast-types';

export function showToastOverElement(action: ToastAction, targetElement: HTMLElement): void {
  const messages = ToastMessages[action];
  if (!messages.length) return;

  const message = messages[Math.floor(Math.random() * messages.length)];
  const toast = document.createElement("div");
  toast.className = "yu-cl-toast";
  toast.textContent = message;

  // Calculate placement based on target element's bounding rectangle
  const rect = targetElement.getBoundingClientRect();
  toast.style.left = `${rect.left + rect.width / 2 - 100}px`;
  toast.style.top = `${rect.top - 60}px`;

  document.body.appendChild(toast);

  toast.addEventListener("animationend", () => {
    toast.remove();
  });
}
 