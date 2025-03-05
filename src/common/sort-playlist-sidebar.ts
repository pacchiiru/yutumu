import { YtSelectors } from '../const/yt-selectors';
import { YuLogService } from '../services/yu-log-service';

export function sortPlaylistSidebar() {

  // Select the container
  const container = document.querySelector(YtSelectors.PLAYLIST_SIDEBAR);
  if (!container) {
    YuLogService.error("Playlist container not found.");
    return;
  }

  // Collect all playlist entries as an array
  const entries = Array.from(container.querySelectorAll("ytmusic-guide-entry-renderer"));

  // Sort the entries alphabetically based on the title text
  entries.sort((a, b) => {
    const titleAElement = a.querySelector(".title");
    const titleBElement = b.querySelector(".title");

    const titleA = titleAElement && titleAElement.textContent
      ? titleAElement.textContent.trim().toUpperCase()
      : "";
    const titleB = titleBElement && titleBElement.textContent
      ? titleBElement.textContent.trim().toUpperCase()
      : "";
    return titleA.localeCompare(titleB);
  });

  // Remove all existing children from the container without using innerHTML
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Append the sorted entries back to the container
  entries.forEach(entry => container.appendChild(entry));
}