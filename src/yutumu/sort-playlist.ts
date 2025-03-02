import { YouTubeSelectors } from '../const/youtube-selectors';
import { YutumuLogMessages } from '../const/yutumu-log-messages';
import { YutumuSortPlaylistTypes } from '../const/yutumu-sort-playlist-types';
import { getAttributeValue } from '../utils/dom-utils';

export function sortPlaylist(
  sortType: YutumuSortPlaylistTypes = YutumuSortPlaylistTypes.BY_SONG_ARTIST_AND_TITLE
): void {
  const container = document.querySelector(YouTubeSelectors.PLAYLIST);
  if (!container) {
    console.warn(`${YutumuLogMessages.LOG_PREFIX} Cannot find playlist container.`);
    return;
  }

  const playlistItems: Element[] = Array.from(container.querySelectorAll(YouTubeSelectors.PLAYLIST_SONG));
  if (playlistItems.length === 0) {
    console.warn(`${YutumuLogMessages.LOG_PREFIX} No playlist items found.`);
    return;
  }

  const SONG_ARTIST_SELECTOR = ".secondary-flex-columns .flex-column";
  const SONG_TITLE_SELECTOR = ".title.ytmusic-responsive-list-item-renderer.complex-string";
  const SONG_LENGTH_SELECTOR = ".fixed-column.MUSIC_RESPONSIVE_LIST_ITEM_COLUMN_DISPLAY_PRIORITY_HIGH";
  const TITLE_ATTRIBUTE = "title";

  if (sortType === YutumuSortPlaylistTypes.BY_SONG_ARTIST_AND_TITLE) {
    playlistItems.sort((a, b) => {
      const artistAElement = a.querySelector(SONG_ARTIST_SELECTOR);
      const artistBElement = b.querySelector(SONG_ARTIST_SELECTOR);
      const trackAElement = a.querySelector(SONG_TITLE_SELECTOR);
      const trackBElement = b.querySelector(SONG_TITLE_SELECTOR);

      const artistA = artistAElement ? getAttributeValue(artistAElement, TITLE_ATTRIBUTE) : "";
      const artistB = artistBElement ? getAttributeValue(artistBElement, TITLE_ATTRIBUTE) : "";
      const trackA = trackAElement ? getAttributeValue(trackAElement, TITLE_ATTRIBUTE) : "";
      const trackB = trackBElement ? getAttributeValue(trackBElement, TITLE_ATTRIBUTE) : "";

      const artistComparison = artistA.localeCompare(artistB);
      return artistComparison !== 0 ? artistComparison : trackA.localeCompare(trackB);
    });
  } else if (sortType === YutumuSortPlaylistTypes.BY_SONG_TITLE) {
    playlistItems.sort((a, b) => {
      const trackAElement = a.querySelector(SONG_TITLE_SELECTOR);
      const trackBElement = b.querySelector(SONG_TITLE_SELECTOR);
      const trackA = trackAElement ? getAttributeValue(trackAElement, TITLE_ATTRIBUTE) : "";
      const trackB = trackBElement ? getAttributeValue(trackBElement, TITLE_ATTRIBUTE) : "";
      return trackA.localeCompare(trackB);
    });
  } else if (sortType === YutumuSortPlaylistTypes.BY_SONG_LENGTH) {
    playlistItems.sort((a, b) => {
      const lengthAElement = a.querySelector(SONG_LENGTH_SELECTOR);
      const lengthBElement = b.querySelector(SONG_LENGTH_SELECTOR);
      const lengthAString = lengthAElement ? (lengthAElement.textContent || "") : "";
      const lengthBString = lengthBElement ? (lengthBElement.textContent || "") : "";
      const timeA = parseSongLength(lengthAString);
      const timeB = parseSongLength(lengthBString);
      return timeA - timeB;
    });
  }

  // Use a document fragment to minimize reflows when reordering DOM nodes.
  const fragment = document.createDocumentFragment();
  playlistItems.forEach(item => fragment.appendChild(item));
  container.appendChild(fragment);

  // Apply a static border effect by adding the CSS class.
  playlistItems.forEach(item => {
    item.classList.add('sorted-item-highlight');
    item.addEventListener('dragend', () => {
      item.classList.remove('sorted-item-highlight');
    });
  });
}

// Helper function to convert "M:SS" into total seconds.
export function parseSongLength(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(part => parseInt(part.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}