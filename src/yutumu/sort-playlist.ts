import { YouTubeSelectors } from '../const/youtube-selectors';
import { YutumuSortPlaylistTypes } from '../const/yutumu-sort-playlist-types';
import { YutumuLogMessages } from '../const/yutumu-log-messages';
import { getAttributeValue } from '../utils/dom-utils';

export function sortPlaylist(sortType: YutumuSortPlaylistTypes = YutumuSortPlaylistTypes.BY_ARTIST_AND_TITLE): void {

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

  const SONG_ARTIST_SELECTOR = ".secondary-flex-columns .flex-column.style-scope";
  const SONG_TITLE_SELECTOR = ".title.style-scope.ytmusic-responsive-list-item-renderer.complex-string";
  const TITLE_ATTRIBUTE = "title";

  if (sortType === YutumuSortPlaylistTypes.BY_ARTIST_AND_TITLE) {

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
  }

  // Use a document fragment to minimize reflows when reordering DOM nodes
  const fragment = document.createDocumentFragment();
  playlistItems.forEach(item => fragment.appendChild(item));
  container.appendChild(fragment);

  // Apply static-y border effect by adding the CSS class
  playlistItems.forEach(item => {
    item.classList.add('sorted-item-highlight');
    item.addEventListener('dragend', () => {
      item.classList.remove('sorted-item-highlight');
    });
  });
}
