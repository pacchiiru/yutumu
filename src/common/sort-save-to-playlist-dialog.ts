import { YuLogService } from '../services/yu-log-service';

export function sortSaveToPlaylistDialog() {
  // Find all dialogs
  const dialogs = Array.from(document.querySelectorAll('tp-yt-paper-dialog'));

  // Look for a dialog that contains a <yt-formatted-string> with "Save to playlist"
  const targetDialog = dialogs.find(dialog =>
    Array.from(dialog.querySelectorAll('yt-formatted-string')).some(
      el => el.textContent?.trim() === 'Save to playlist'
    )
  );
  
  if (!targetDialog) {
    return;
  }

  // Query the playlist container inside the dialog
  const playlistContainer = targetDialog.querySelector('#playlists');
  if (!playlistContainer) {
    YuLogService.error("Playlist container not found in Save to Playlist dialog.");
    return;
  }

  // Get all playlist option elements
  const playlistOptions = Array.from(
    playlistContainer.querySelectorAll('ytmusic-playlist-add-to-option-renderer')
  );
  if (playlistOptions.length === 0) return;

  // Sort the options based on the title text from the "#title" element
  const sortedOptions = playlistOptions.sort((a, b) => {
    const titleA = (a.querySelector('#title')?.textContent || "").trim().toLowerCase();
    const titleB = (b.querySelector('#title')?.textContent || "").trim().toLowerCase();
    return titleA.localeCompare(titleB);
  });

  // Remove all existing children and append sorted options
  while (playlistContainer.firstChild) {
    playlistContainer.removeChild(playlistContainer.firstChild);
  }
  sortedOptions.forEach(option => playlistContainer.appendChild(option));
}
