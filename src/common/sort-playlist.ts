import { HtmlAttributes } from '../const/html-attributes';
import { YtSelectors } from '../const/yt-selectors';
import { YuChromeSettings } from '../const/yu-chrome-settings';
import { YuNamesClasses } from '../const/yu-names-classes';
import { YuSortPlaylistTypes } from '../const/yu-sort-playlist-types';
import { yuChromeStorageService } from '../services/yu-chrome-storage-service';
import { YuLogService } from '../services/yu-log-service';
import { DomUtils } from '../utils/dom-utils';

export async function sortPlaylist(sortType: YuSortPlaylistTypes): Promise<void> {
  const container = document.querySelector(YtSelectors.PLAYLIST);
  if (!container) {
    YuLogService.error("Cannot find playlist container.");
    return;
  }

  const playlistItems: Element[] = Array.from(container.querySelectorAll(YtSelectors.PLAYLIST_SONG));
  if (playlistItems.length === 0) {
    YuLogService.warn("No playlist items found.");
    return;
  }

  const englishOnly = await yuChromeStorageService.getSetting<boolean>(YuChromeSettings.SORT_PLAYLIST_BY_ENGLISH_ONLY) || false;

  const comparators: Record<string, (a: Element, b: Element) => number> = {
    [YuSortPlaylistTypes.BY_SONG_ARTIST_AND_TITLE_ASC]: (a, b) => {
      const artistA = getSongArtist(a, englishOnly);
      const artistB = getSongArtist(b, englishOnly);
      const songTitleA = getSongTitle(a, englishOnly);
      const songTitleB = getSongTitle(b, englishOnly);
      const cmp = artistA.localeCompare(artistB);
      return cmp !== 0 ? cmp : songTitleA.localeCompare(songTitleB);
    },
    [YuSortPlaylistTypes.BY_SONG_ARTIST_AND_TITLE_DESC]: (a, b) => {
      const artistA = getSongArtist(a, englishOnly);
      const artistB = getSongArtist(b, englishOnly);
      const songTitleA = getSongTitle(a, englishOnly);
      const songTitleB = getSongTitle(b, englishOnly);
      const cmp = artistA.localeCompare(artistB);
      return cmp !== 0 ? cmp : songTitleB.localeCompare(songTitleA);
    },
    [YuSortPlaylistTypes.BY_SONG_LENGTH_ASC]: (a, b) => {
      const timeA = getSongLength(a);
      const timeB = getSongLength(b);
      return timeA - timeB;
    },
    [YuSortPlaylistTypes.BY_SONG_LENGTH_DESC]: (a, b) => {
      const timeA = getSongLength(a);
      const timeB = getSongLength(b);
      return timeB - timeA;
    },
    [YuSortPlaylistTypes.BY_SONG_TITLE_ASC]: (a, b) => {
      const songTitleA = getSongTitle(a, englishOnly);
      const songTitleB = getSongTitle(b, englishOnly);
      return songTitleA.localeCompare(songTitleB);
    },
    [YuSortPlaylistTypes.BY_SONG_TITLE_DESC]: (a, b) => {
      const songTitleA = getSongTitle(a, englishOnly);
      const songTitleB = getSongTitle(b, englishOnly);
      return songTitleB.localeCompare(songTitleA);
    }
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

export function getSongArtist(targetElement: Element, englishOnly: boolean): string {
  const artistElement = targetElement.querySelector(YtSelectors.SORT_PLAYLIST_SONG_ARTIST_SELECTOR);
  const artist = DomUtils.getAttributeValue(artistElement, HtmlAttributes.TITLE);
  return sanitizeString(artist, englishOnly);
}

export function getSongTitle(targetElement: Element, englishOnly: boolean): string {
  const titleElement = targetElement.querySelector(YtSelectors.SORT_PLAYLIST_SONG_TITLE_SELECTOR);
  const songTitle = DomUtils.getAttributeValue(titleElement, HtmlAttributes.TITLE);
  return sanitizeString(songTitle, englishOnly);
}

export function getSongLength(targetElement: Element): number {
  const lengthElement = targetElement.querySelector(YtSelectors.SORT_PLAYLIST_SONG_LENGTH_SELECTOR);
  const timeStr = DomUtils.getTextContent(lengthElement);

  if (!timeStr) {
    return 0;
  }

  const parts = timeStr.split(":").map(part => parseInt(part.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }

  return 0;
}

export function sanitizeString(str: string, englishOnly: boolean): string {
  if (!str) {
    return "";
  }
  
  // Remove all special characters including slashes and brackets
  let sanitized = str.replace(/[\p{P}\p{S}\/\\]/gu, "");
  
  // Keep only English alphanumeric characters and spaces
  if (englishOnly) {
    sanitized = sanitized.replace(/[^a-zA-Z0-9 ]/g, "");
  }
  
  return sanitized.trim();
}