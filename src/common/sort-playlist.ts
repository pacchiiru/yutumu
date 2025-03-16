import { YtSelectors } from '../const/yt-selectors';
import { YuNamesClasses } from '../const/yu-names-classes';
import { YuSortPlaylistTypes } from '../const/yu-sort-playlist-types';
import { YuLogService } from '../services/yu-log-service';
import { DomUtils } from '../utils/dom-utils';
import { yuChromeStorageService } from '../services/yu-chrome-storage-service';
import { YuChromeSettings } from '../const/yu-chrome-settings';

export async function sortPlaylist(sortType: YuSortPlaylistTypes): Promise<void> {
  const container = document.querySelector(YtSelectors.PLAYLIST);
  if (!container) {
    YuLogService.warn("Cannot find playlist container.");
    return;
  }

  const playlistItems: Element[] = Array.from(container.querySelectorAll(YtSelectors.PLAYLIST_SONG));
  if (playlistItems.length === 0) {
    YuLogService.warn("No playlist items found.");
    return;
  }

  const englishOnly = await yuChromeStorageService.getSetting<boolean>(YuChromeSettings.SORT_PLAYLIST_BY_ENGLISH_ONLY) || false;

  function sanitizeString(str: string): string {
    if (!str) return "";
    
    // Remove all special characters including slashes and brackets
    let sanitized = str.replace(/[\p{P}\p{S}\/\\]/gu, "");
    
    if (englishOnly) {
      // Keep only English alphanumeric characters and spaces
      sanitized = sanitized.replace(/[^a-zA-Z0-9 ]/g, "");
    }
    
    return sanitized.trim();
  }

  const SONG_ARTIST_SELECTOR = ".secondary-flex-columns .flex-column";
  const SONG_TITLE_SELECTOR = ".title.ytmusic-responsive-list-item-renderer.complex-string";
  const SONG_LENGTH_SELECTOR = ".fixed-column.MUSIC_RESPONSIVE_LIST_ITEM_COLUMN_DISPLAY_PRIORITY_HIGH";
  const TITLE_ATTRIBUTE = "title";

  const comparators: Record<string, (a: Element, b: Element) => number> = {
    [YuSortPlaylistTypes.BY_SONG_ARTIST_AND_TITLE_ASC]: (a, b) => {
      const artistA = sanitizeString(DomUtils.getAttributeValue(a.querySelector(SONG_ARTIST_SELECTOR), TITLE_ATTRIBUTE));
      const artistB = sanitizeString(DomUtils.getAttributeValue(b.querySelector(SONG_ARTIST_SELECTOR), TITLE_ATTRIBUTE));
      const trackA = sanitizeString(DomUtils.getAttributeValue(a.querySelector(SONG_TITLE_SELECTOR), TITLE_ATTRIBUTE));
      const trackB = sanitizeString(DomUtils.getAttributeValue(b.querySelector(SONG_TITLE_SELECTOR), TITLE_ATTRIBUTE));
      const cmp = artistA.localeCompare(artistB);
      return cmp !== 0 ? cmp : trackA.localeCompare(trackB);
    },
    [YuSortPlaylistTypes.BY_SONG_ARTIST_AND_TITLE_DESC]: (a, b) => {
      const artistA = sanitizeString(DomUtils.getAttributeValue(a.querySelector(SONG_ARTIST_SELECTOR), TITLE_ATTRIBUTE));
      const artistB = sanitizeString(DomUtils.getAttributeValue(b.querySelector(SONG_ARTIST_SELECTOR), TITLE_ATTRIBUTE));
      const trackA = sanitizeString(DomUtils.getAttributeValue(a.querySelector(SONG_TITLE_SELECTOR), TITLE_ATTRIBUTE));
      const trackB = sanitizeString(DomUtils.getAttributeValue(b.querySelector(SONG_TITLE_SELECTOR), TITLE_ATTRIBUTE));
      const cmp = artistB.localeCompare(artistA);
      return cmp !== 0 ? cmp : trackB.localeCompare(trackA);
    },
    [YuSortPlaylistTypes.BY_SONG_TITLE_ASC]: (a, b) => {
      const trackA = sanitizeString(DomUtils.getAttributeValue(a.querySelector(SONG_TITLE_SELECTOR), TITLE_ATTRIBUTE));
      const trackB = sanitizeString(DomUtils.getAttributeValue(a.querySelector(SONG_TITLE_SELECTOR), TITLE_ATTRIBUTE));
      return trackA.localeCompare(trackB);
    },
    [YuSortPlaylistTypes.BY_SONG_TITLE_DESC]: (a, b) => {
      const trackA = sanitizeString(DomUtils.getAttributeValue(a.querySelector(SONG_TITLE_SELECTOR), TITLE_ATTRIBUTE));
      const trackB = sanitizeString(DomUtils.getAttributeValue(a.querySelector(SONG_TITLE_SELECTOR), TITLE_ATTRIBUTE));
      return trackB.localeCompare(trackA);
    },
    [YuSortPlaylistTypes.BY_SONG_LENGTH_ASC]: (a, b) => {
      const lengthAString = DomUtils.getTextContent(a.querySelector(SONG_LENGTH_SELECTOR));
      const lengthBString = DomUtils.getTextContent(a.querySelector(SONG_LENGTH_SELECTOR));
      const timeA = parseSongLength(lengthAString);
      const timeB = parseSongLength(lengthBString);
      return timeA - timeB;
    },
    [YuSortPlaylistTypes.BY_SONG_LENGTH_DESC]: (a, b) => {
      const lengthAString = DomUtils.getTextContent(a.querySelector(SONG_LENGTH_SELECTOR));
      const lengthBString = DomUtils.getTextContent(a.querySelector(SONG_LENGTH_SELECTOR));
      const timeA = parseSongLength(lengthAString);
      const timeB = parseSongLength(lengthBString);
      return timeB - timeA;
    },
  };

  const comparator = comparators[sortType];
  if (!comparator) {
    YuLogService.warn(`Unknown sort type: ${sortType}`);
    return;
  }
  playlistItems.sort(comparator);

  const fragment = document.createDocumentFragment();
  playlistItems.forEach(item => fragment.appendChild(item));
  container.appendChild(fragment);

  playlistItems.forEach(item => {
    item.classList.add(YuNamesClasses.YU_SORT_PLAYLIST_SONG_HIGHLIGHT);
    item.addEventListener("dragend", () => {
      item.classList.remove(YuNamesClasses.YU_SORT_PLAYLIST_SONG_HIGHLIGHT);
    });
  });
}

export function parseSongLength(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map(part => parseInt(part.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}
