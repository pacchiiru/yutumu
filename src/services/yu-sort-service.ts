import { YtSelectors } from '../const/yt-selectors';
import { YuLogService } from '../services/yu-log-service';
import { HtmlAttributes } from '../const/html-attributes';
import { YuChromeSettings } from '../const/yu-chrome-settings';
import { YuNamesClasses } from '../const/yu-names-classes';
import { YuSortPlaylistTypes } from '../const/yu-sort-playlist-types';
import { yuChromeStorageService } from '../services/yu-chrome-storage-service';
import { DomUtils } from '../utils/dom-utils';

export class YuSortService {
    public async sortPlaylist(sortType: YuSortPlaylistTypes): Promise<void> {
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
                const artistA = this.getSongArtist(a, englishOnly);
                const artistB = this.getSongArtist(b, englishOnly);
                const songTitleA = this.getSongTitle(a, englishOnly);
                const songTitleB = this.getSongTitle(b, englishOnly);
                const cmp = artistA.localeCompare(artistB);
                return cmp !== 0 ? cmp : songTitleA.localeCompare(songTitleB);
            },
            [YuSortPlaylistTypes.BY_SONG_ARTIST_AND_TITLE_DESC]: (a, b) => {
                const artistA = this.getSongArtist(a, englishOnly);
                const artistB = this.getSongArtist(b, englishOnly);
                const songTitleA = this.getSongTitle(a, englishOnly);
                const songTitleB = this.getSongTitle(b, englishOnly);
                const cmp = artistA.localeCompare(artistB);
                return cmp !== 0 ? cmp : songTitleB.localeCompare(songTitleA);
            },
            [YuSortPlaylistTypes.BY_SONG_LENGTH_ASC]: (a, b) => {
                const timeA = this.getSongLength(a);
                const timeB = this.getSongLength(b);
                return timeA - timeB;
            },
            [YuSortPlaylistTypes.BY_SONG_LENGTH_DESC]: (a, b) => {
                const timeA = this.getSongLength(a);
                const timeB = this.getSongLength(b);
                return timeB - timeA;
            },
            [YuSortPlaylistTypes.BY_SONG_TITLE_ASC]: (a, b) => {
                const songTitleA = this.getSongTitle(a, englishOnly);
                const songTitleB = this.getSongTitle(b, englishOnly);
                return songTitleA.localeCompare(songTitleB);
            },
            [YuSortPlaylistTypes.BY_SONG_TITLE_DESC]: (a, b) => {
                const songTitleA = this.getSongTitle(a, englishOnly);
                const songTitleB = this.getSongTitle(b, englishOnly);
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

    public sortPlaylistSidebar() {

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

    public sortSaveToPlaylistDialog() {
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

    private getSongArtist(targetElement: Element, englishOnly: boolean): string {
        const artistElement = targetElement.querySelector(YtSelectors.SORT_PLAYLIST_SONG_ARTIST_SELECTOR);
        const artist = DomUtils.getAttributeValue(artistElement, HtmlAttributes.TITLE);
        return this.sanitizeString(artist, englishOnly);
    }

    private getSongTitle(targetElement: Element, englishOnly: boolean): string {
        const titleElement = targetElement.querySelector(YtSelectors.SORT_PLAYLIST_SONG_TITLE_SELECTOR);
        const songTitle = DomUtils.getAttributeValue(titleElement, HtmlAttributes.TITLE);
        return this.sanitizeString(songTitle, englishOnly);
    }

    private getSongLength(targetElement: Element): number {
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

    private sanitizeString(str: string, englishOnly: boolean): string {
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
}

export const yuSortService = new YuSortService();