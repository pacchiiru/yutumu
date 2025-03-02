import interact from 'interactjs';

import { YouTubeSelectors } from '../const/youtube-selectors';
import { YutumuPanelConstants } from '../const/yutumu-panel-constants';
import { ToastActions } from '../const/yutumu-panel-toast-actions';
import { YutumuSortPlaylistTypes } from '../const/yutumu-sort-playlist-types';
import { getElementOffsetHeight, getScrollbarWidth } from '../utils/dom-utils';
import { startTutorial } from '../yutumu-intro/yutumu-intro';
import { showToastOverElement } from '../yutumu-panel-toast/yutumu-panel-toast';
import { sortPlaylist } from '../yutumu/sort-playlist';

// Drag Panel
export function setupDragAndDrop(panel: HTMLElement, header: HTMLElement): void {
  interact(header).draggable({
    listeners: {
      move(event) {
        const currentX = parseFloat(panel.getAttribute('data-x') || "0");
        const currentY = parseFloat(panel.getAttribute('data-y') || "0");
        const x = currentX + event.dx;
        const y = currentY + event.dy;
        panel.style.transform = `translate(${x}px, ${y}px)`;
        panel.setAttribute('data-x', x.toString());
        panel.setAttribute('data-y', y.toString());
      },

      start() {
        document.body.style.userSelect = "none";
      },

      end() {
        document.body.style.userSelect = "";
      }
    }
  });
}

// Resize Panel
export function setupResizable(panel: HTMLElement): void {
  interact(panel).resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
      move(event) {
        const target = event.target as HTMLElement;
        target.style.width = `${event.rect.width}px`;
        target.style.height = `${event.rect.height}px`;
        let x = parseFloat(target.getAttribute('data-x') || "0");
        let y = parseFloat(target.getAttribute('data-y') || "0");
        x += event.deltaRect.left;
        y += event.deltaRect.top;
        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x.toString());
        target.setAttribute('data-y', y.toString());
      },

      start() {
        document.body.style.userSelect = "none";
      },

      end() {
        document.body.style.userSelect = "";
      }
    },
    modifiers: [
      interact.modifiers.restrictSize({
        min: { width: YutumuPanelConstants.MIN_WIDTH, height: YutumuPanelConstants.MIN_HEIGHT },
        max: { width: YutumuPanelConstants.MAX_WIDTH, height: YutumuPanelConstants.MAX_HEIGHT }
      })
    ],
    inertia: true
  });
}

export function bindUIButtonActions(panel: HTMLElement): void {

  // Click Help
  const helpButton = panel.querySelector('#yutumu-help-button') as HTMLElement | null;
  if (helpButton) {
    helpButton.addEventListener('click', () => {
      startTutorial();
    });
  }

  // Click Minimize
  const minimizeButton = panel.querySelector('#yutumu-minimize-button') as HTMLElement | null;
  if (minimizeButton) {
    minimizeButton.addEventListener('click', () => {

      // Positioning: right side, below navbar
      const minimizePanelWidth = YutumuPanelConstants.MIN_WIDTH;
      const minimizePanelHeight = YutumuPanelConstants.MIN_HEIGHT;
      const minimizeTargetX = window.innerWidth - (minimizePanelWidth + getScrollbarWidth() + YutumuPanelConstants.POS_PADDING);
      const minimizeTargetY = getElementOffsetHeight(YouTubeSelectors.NAVBAR) + YutumuPanelConstants.POS_PADDING;
      const computedStyle = window.getComputedStyle(panel);
      panel.style.setProperty('--initial-transform', computedStyle.transform);
      panel.classList.add('minimizing-out');

      showToastOverElement(ToastActions.MINIMIZE, panel);

      panel.addEventListener('animationend', function outHandler(e: AnimationEvent) {
        if (e.animationName === "minimize-out") {
          panel.removeEventListener('animationend', outHandler);
          panel.style.width = `${minimizePanelWidth}px`;
          panel.style.height = `${minimizePanelHeight}px`;
          panel.style.transform = `translate(${minimizeTargetX}px, ${minimizeTargetY}px)`;
          panel.setAttribute('data-x', minimizeTargetX.toString());
          panel.setAttribute('data-y', minimizeTargetY.toString());
          panel.style.setProperty('--target-transform', `translate(${minimizeTargetX}px, ${minimizeTargetY}px)`);

          panel.classList.remove('minimizing-out');
          panel.classList.add('minimizing-in');

          panel.addEventListener('animationend', function inHandler(e: AnimationEvent) {
            if (e.animationName === "minimize-in") {
              panel.removeEventListener('animationend', inHandler);
              panel.classList.remove('minimizing-in');
            }
          });
        }
      });
    });
  }

  // Click Close
  const closeButton = panel.querySelector('#yutumu-close-button') as HTMLElement | null;
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      const computedStyle = window.getComputedStyle(panel);
      panel.style.setProperty('--initial-transform', computedStyle.transform);

      showToastOverElement(ToastActions.CLOSE, panel);

      panel.classList.add('closing');
      panel.addEventListener('animationend', () => {
        panel.remove();
      }, { once: true });
    });
  }

  // Click Sort Playlist
  const sortPlaylistButton = document.getElementById('yutumu-sort-playlist-button') as HTMLButtonElement;
  const sortOptionsMenu = document.querySelector('.yutumu-sort-options') as HTMLDivElement;

  // Toggle dropdown menu on sort button click
  sortPlaylistButton.addEventListener('click', () => {
    sortOptionsMenu.classList.toggle('hidden');
  });

  // Attach event listeners to each sort option button
  document.getElementById('sort-by-artist')?.addEventListener('click', () => {
    sortPlaylist(YutumuSortPlaylistTypes.BY_SONG_ARTIST_AND_TITLE);
    showToastOverElement(ToastActions.PLAYLIST_SORT, panel);
    sortOptionsMenu.classList.add('hidden');
  });

  document.getElementById('sort-by-title')?.addEventListener('click', () => {
    sortPlaylist(YutumuSortPlaylistTypes.BY_SONG_TITLE);
    showToastOverElement(ToastActions.PLAYLIST_SORT, panel);
    sortOptionsMenu.classList.add('hidden');
  });

  document.getElementById('sort-by-length')?.addEventListener('click', () => {
    sortPlaylist(YutumuSortPlaylistTypes.BY_SONG_LENGTH);
    showToastOverElement(ToastActions.PLAYLIST_SORT, panel);
    sortOptionsMenu.classList.add('hidden');
  });
}