import interact from 'interactjs';

import { ToastTypes } from '../const/toast-types';
import { UpdateIntervals } from '../const/update-intervals';
import { YtSelectors } from '../const/yt-selectors';
import { YtUrlPatterns } from '../const/yt-url-patterns';
import { YuChromeActions } from '../const/yu-chrome-actions';
import { YuChromeSettings } from '../const/yu-chrome-settings';
import { YuNamesAnimations } from '../const/yu-names-animations';
import { YuNamesClasses } from '../const/yu-names-classes';
import { YuSortPlaylistTypes } from '../const/yu-sort-playlist-types';
import { YupConstants } from '../const/yup-constants';
import { YupSelectorsByClassName } from '../const/yup-selectors-by-class-name';
import { YupSelectorsById } from '../const/yup-selectors-by-id';
import { yuChromeStorageService } from '../services/yu-chrome-storage-service';
import { YuLogService } from '../services/yu-log-service';
import { yuSortService } from '../services/yu-sort-service';
import { yuToastService } from '../services/yu-toast-service';
import { yupColorService } from '../services/yup-color-service';
import { DomUtils } from '../utils/dom-utils';
import { SvgUtils } from '../utils/svg-utils';
import { startTutorial } from '../yu-intro/yu-intro';
import yupTemplate from './yup.html';

export class Yup {
  private sortPlaylistDialogIntervalId?: number;
  private yupId: string = "yu-id-yup";
  private yupElement: HTMLElement | null = null;
  private yupHeaderElement: HTMLElement | null = null;

  // #region Lifecycle

  constructor() {
    SvgUtils.injectSvgFilters();
  }

  public static init(): void {
    const yup = new Yup();
    yup.create();

    chrome.runtime.onMessage.addListener((message: any) => {
      if (message.action === YuChromeActions.REOPEN_YUP) {
        yup.create();
      }
    });

    const startUpdateInterval = () => {

      setInterval(() => {
        yup.updateContext();
      }, UpdateIntervals.MS_SHORT);

      setInterval(() => {
        const panelElement = yup.requireYupElement();
        if (panelElement) {
          yupColorService.updateYupBorder(panelElement);
        }
      }, UpdateIntervals.MS_LONG);

    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", startUpdateInterval);
    }
    else {
      startUpdateInterval();
    }
  }

  public create(): void {
    if (document.getElementById(this.yupId)) return;

    this.yupElement = document.createElement("div");
    this.setupTemplate();

    this.yupHeaderElement = this.yupElement.querySelector(YupSelectorsById.HEADER) as HTMLElement | null;
    this.setupPosition();
    this.setupDrag();
    this.setupResize();
    this.setupUI();
    this.setupOpenAnimation();
  }

  private updateContext(): void {
    const panel = this.requireYupElement();
    if (!panel) return;

    const url = window.location.href;
    const isPlaylistPage = YtUrlPatterns.PLAYLIST.test(url);
    const isHomePage = YtUrlPatterns.HOME.test(url);
    const elements = panel.querySelectorAll("[data-context]");

    elements.forEach((element) => {
      const context = element.getAttribute("data-context");
      const shouldBeVisible =
        (context === "playlist" && isPlaylistPage) ||
        (context === "home" && isHomePage);
      const isCurrentlyVisible = !element.classList.contains(YuNamesClasses.YUP_FADING_OUT);

      if (shouldBeVisible && !isCurrentlyVisible) {
        element.classList.remove(YuNamesClasses.YUP_FADING_OUT);
        element.classList.add(YuNamesClasses.YUP_FADING_IN);
      }
      else if (!shouldBeVisible && isCurrentlyVisible) {
        element.classList.remove(YuNamesClasses.YUP_FADING_IN);
        element.classList.add(YuNamesClasses.YUP_FADING_OUT);
      }
    });
  }

  // #endregion Lifecycle

  // #region Checks

  private requireYupElement(): HTMLElement | null {
    if (!this.yupElement) {
      YuLogService.error("Panel element not set.");
      return null;
    }
    return this.yupElement;
  }

  private requireYupHeaderElement(): HTMLElement | null {
    if (!this.yupHeaderElement) {
      YuLogService.error("Panel header element not set.");
      return null;
    }
    return this.yupHeaderElement;
  }

  // #endregion Checks

  // #region Setup

  private setupTemplate(): void {
    const panel = this.requireYupElement();
    if (!panel) return;

    panel.id = this.yupId;
    panel.className = YuNamesClasses.YUP;
    const bannerUrl: string = chrome.runtime.getURL("assets/images/banner_medium.webp");
    panel.innerHTML = yupTemplate.replace("{{BANNER_URL}}", bannerUrl);
    document.body.appendChild(panel);
  }

  private setupPosition(): void {
    const panel = this.requireYupElement();
    if (!panel) return;

    const openTargetX = DomUtils.getElementOffsetWidth(YtSelectors.SIDEBAR) + YupConstants.POS_PADDING;
    const openTargetY = DomUtils.getElementOffsetHeight(YtSelectors.NAVBAR) + YupConstants.POS_PADDING;
    panel.style.transform = `translate(${openTargetX}px, ${openTargetY}px)`;
    panel.setAttribute("data-x", `${openTargetX}`);
    panel.setAttribute("data-y", `${openTargetY}`);
  }

  private setupDrag(): void {
    const panel = this.requireYupElement();
    const panelHeader = this.requireYupHeaderElement();
    if (!panel || !panelHeader) return;

    interact(panelHeader).draggable({
      listeners: {
        move: (event) => {
          const currentX = parseFloat(panel.getAttribute("data-x") || "0");
          const currentY = parseFloat(panel.getAttribute("data-y") || "0");
          const x = currentX + event.dx;
          const y = currentY + event.dy;
          panel.style.transform = `translate(${x}px, ${y}px)`;
          panel.setAttribute("data-x", x.toString());
          panel.setAttribute("data-y", y.toString());
        },
        start: () => {
          document.body.style.userSelect = "none";
        },
        end: () => {
          document.body.style.userSelect = "";
        }
      }
    });
  }

  private setupResize(): void {
    const panel = this.requireYupElement();
    if (!panel) return;

    interact(panel).resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move: (event) => {
          const target = event.target as HTMLElement;
          target.style.width = `${event.rect.width}px`;
          target.style.height = `${event.rect.height}px`;
          let x = parseFloat(target.getAttribute("data-x") || "0");
          let y = parseFloat(target.getAttribute("data-y") || "0");
          x += event.deltaRect.left;
          y += event.deltaRect.top;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x.toString());
          target.setAttribute("data-y", y.toString());
        },
        start: () => {
          document.body.style.userSelect = "none";
        },
        end: () => {
          document.body.style.userSelect = "";
        }
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: YupConstants.MIN_WIDTH, height: YupConstants.MIN_HEIGHT },
          max: { width: YupConstants.MAX_WIDTH, height: YupConstants.MAX_HEIGHT }
        })
      ],
      inertia: true
    });
  }

  private setupUI(): void {
    this.setupSettingsButtonAndView();
    this.setupHelpButton();
    this.setupMinimizeButton();
    this.setupCloseButton();
    this.setupSortPlaylist();
  }

  private setupOpenAnimation(): void {
    const panel = this.requireYupElement();
    if (!panel) return;

    const currentTransform = window.getComputedStyle(panel).transform;
    panel.style.setProperty("--initial-transform", currentTransform);
    panel.classList.add(YuNamesClasses.YUP_OPENING);

    panel.addEventListener("animationend", function openHandler(e: AnimationEvent) {
      if (e.animationName === YuNamesAnimations.YUP_OPEN) {
        yuToastService.showToastOverElement(ToastTypes.OPEN, panel);
        panel.removeEventListener("animationend", openHandler);
        panel.classList.remove(YuNamesClasses.YUP_OPENING);
      }
    });
  }

  // #endregion Setup

  // #region UI

  private setupSettingsButtonAndView(): void {
    const panel = this.requireYupElement();
    if (!panel) return;

    const settingsButton = panel.querySelector(YupSelectorsById.SETTINGS_BUTTON) as HTMLButtonElement | null;
    const backButton = panel.querySelector(YupSelectorsById.SETTINGS_BACK_BUTTON) as HTMLButtonElement | null;
    const mainView = panel.querySelector(YupSelectorsById.MAIN_VIEW) as HTMLElement | null;
    const settingsView = panel.querySelector(YupSelectorsById.SETTINGS_VIEW) as HTMLElement | null;
    const toggleSortPlaylistByEnglishOnly = panel.querySelector(YupSelectorsById.SETTING_SORT_PLAYLIST_BY_ENGLISH_ONLY) as HTMLInputElement | null;
    const toggleSortSidebar = panel.querySelector(YupSelectorsById.SETTING_SORT_PLAYLIST_SIDEBAR) as HTMLInputElement | null;
    const toggleSortSaveToPlaylistDialog = panel.querySelector(YupSelectorsById.SETTING_SORT_SAVE_TO_PLAYLIST_DIALOG) as HTMLInputElement | null;

    if (settingsButton && backButton && mainView && settingsView) {
      settingsButton.addEventListener("click", () => this.toggleView(mainView, settingsView));
      backButton.addEventListener("click", () => this.toggleView(settingsView, mainView));
    }

    if (toggleSortPlaylistByEnglishOnly) {
      toggleSortPlaylistByEnglishOnly.addEventListener("change", async (e) => {
        const enabled = (e.target as HTMLInputElement).checked;
        await this.updateSortPlaylistByEnglishOnly(enabled);
      });

      (async () => {
        try {
          const enabled = await yuChromeStorageService.getSetting<boolean>(YuChromeSettings.SORT_PLAYLIST_BY_ENGLISH_ONLY);
          toggleSortPlaylistByEnglishOnly.checked = Boolean(enabled);
        }
        catch (err) {
          YuLogService.error(`Error loading setting: ${err}`);
        }
      })();
    }

    if (toggleSortSidebar) {
      toggleSortSidebar.addEventListener("change", async (e) => {
        const enabled = (e.target as HTMLInputElement).checked;
        await this.updateSortSidebar(enabled);
      });

      (async () => {
        try {
          const enabled = await yuChromeStorageService.getSetting<boolean>(YuChromeSettings.SORT_PLAYLIST_SIDEBAR);
          toggleSortSidebar.checked = Boolean(enabled);
          if (enabled) {
            yuSortService.sortPlaylistSidebar();
          }
        }
        catch (err) {
          YuLogService.error(`Error loading setting: ${err}`);
        }
      })();
    }

    if (toggleSortSaveToPlaylistDialog) {
      toggleSortSaveToPlaylistDialog.addEventListener("change", async (e) => {
        const enabled = (e.target as HTMLInputElement).checked;
        await this.updateSortSaveToPlaylistDialog(enabled);
      });

      (async () => {
        try {
          const setting = await yuChromeStorageService.getSetting<boolean>(YuChromeSettings.SORT_SAVE_TO_PLAYLIST_DIALOG);
          const enabled = Boolean(setting);
          toggleSortSaveToPlaylistDialog.checked = enabled;
          await this.updateSortSaveToPlaylistDialog(enabled);
        }
        catch (err) {
          YuLogService.error(`Error loading setting: ${err}`);
        }
      })();
    }
  }

  private toggleView = (hideEl: HTMLElement, showEl: HTMLElement) => {
    hideEl.classList.add(YuNamesClasses.YU_HIDDEN);
    showEl.classList.remove(YuNamesClasses.YU_HIDDEN);
  };

  private updateSortPlaylistByEnglishOnly = async (enabled: boolean) => {
    try {
      await yuChromeStorageService.setSetting(
        YuChromeSettings.SORT_PLAYLIST_BY_ENGLISH_ONLY,
        enabled
      );
      YuLogService.log(`Sort Playlist by English only setting saved: ${enabled}`);
    }
    catch (err) {
      YuLogService.error(`Error saving setting: ${err}`);
    }
  };

  private updateSortSidebar = async (enabled: boolean) => {
    try {
      await yuChromeStorageService.setSetting(
        YuChromeSettings.SORT_PLAYLIST_SIDEBAR,
        enabled,
        enabled ? yuSortService.sortPlaylistSidebar : undefined
      );
      YuLogService.log(`Sort Playlist Sidebar setting saved: ${enabled}`);
    }
    catch (err) {
      YuLogService.error(`Error saving setting: ${err}`);
    }
  };

  private updateSortSaveToPlaylistDialog = async (enabled: boolean) => {
    try {
      await yuChromeStorageService.setSetting(YuChromeSettings.SORT_SAVE_TO_PLAYLIST_DIALOG, enabled);
      YuLogService.log(`Sort Save to Playlist Dialog setting saved: ${enabled}`);
      if (enabled) {
        if (!this.sortPlaylistDialogIntervalId) {
          this.sortPlaylistDialogIntervalId = window.setInterval(() => {
            yuSortService.sortSaveToPlaylistDialog();
          }, UpdateIntervals.MS_LONG);
        }
      }
      else {
        if (this.sortPlaylistDialogIntervalId) {
          clearInterval(this.sortPlaylistDialogIntervalId);
          this.sortPlaylistDialogIntervalId = undefined;
        }
      }
    }
    catch (err) {
      YuLogService.error(`Error saving setting: ${err}`);
    }
  };

  private setupHelpButton(): void {
    const panel = this.requireYupElement();
    if (!panel) return;

    const helpButton = panel.querySelector(YupSelectorsById.HELP_BUTTON) as HTMLElement | null;
    if (helpButton) {
      helpButton.addEventListener("click", startTutorial);
    }
  }

  private setupMinimizeButton(): void {
    const panel = this.requireYupElement();
    if (!panel) return;

    const minimizeButton = panel.querySelector(YupSelectorsById.MINIMIZE_BUTTON) as HTMLElement | null;
    if (!minimizeButton) return;

    minimizeButton.addEventListener("click", () => {
      const minimizeTargetX = window.innerWidth - (YupConstants.MIN_WIDTH + DomUtils.getScrollbarWidth() + YupConstants.POS_PADDING);
      const minimizeTargetY = DomUtils.getElementOffsetHeight(YtSelectors.NAVBAR) + YupConstants.POS_PADDING;
      const computedStyle = window.getComputedStyle(panel);

      panel.style.setProperty("--initial-transform", computedStyle.transform);
      panel.classList.add(YuNamesClasses.YUP_MINIMIZING_OUT);
      yuToastService.showToastOverElement(ToastTypes.MINIMIZE, panel);

      panel.addEventListener("animationend", function outHandler(e: AnimationEvent) {
        if (e.animationName === YuNamesAnimations.YUP_MINIMIZE_OUT) {
          panel.removeEventListener("animationend", outHandler);
          panel.style.width = `${YupConstants.MIN_WIDTH}px`;
          panel.style.height = `${YupConstants.MIN_HEIGHT}px`;
          panel.style.transform = `translate(${minimizeTargetX}px, ${minimizeTargetY}px)`;
          panel.setAttribute("data-x", minimizeTargetX.toString());
          panel.setAttribute("data-y", minimizeTargetY.toString());
          panel.style.setProperty("--target-transform", `translate(${minimizeTargetX}px, ${minimizeTargetY}px)`);
          panel.classList.remove(YuNamesClasses.YUP_MINIMIZING_OUT);
          panel.classList.add(YuNamesClasses.YUP_MINIMIZING_IN);

          panel.addEventListener("animationend", function inHandler(e: AnimationEvent) {
            if (e.animationName === YuNamesAnimations.YUP_MINIMIZE_IN) {
              panel.removeEventListener("animationend", inHandler);
              panel.classList.remove(YuNamesClasses.YUP_MINIMIZING_IN);
            }
          });
        }
      });
    });
  }

  private setupCloseButton(): void {
    const panel = this.requireYupElement();
    if (!panel) return;

    const closeButton = panel.querySelector(YupSelectorsById.CLOSE_BUTTON) as HTMLElement | null;
    if (!closeButton) return;

    closeButton.addEventListener("click", () => {
      const computedStyle = window.getComputedStyle(panel);
      panel.style.setProperty("--initial-transform", computedStyle.transform);
      yuToastService.showToastOverElement(ToastTypes.CLOSE, panel);
      panel.classList.add(YuNamesClasses.YUP_CLOSING);

      panel.addEventListener("animationend", () => {
        panel.remove();
      }, { once: true });
    });
  }

  private setupSortPlaylist(): void {
    const panel = this.requireYupElement();
    if (!panel) return;

    const sortPlaylistButton = panel.querySelector(YupSelectorsById.SORT_PLAYLIST_BUTTON) as HTMLButtonElement | null;
    const sortOptionsMenu = panel.querySelector(YupSelectorsById.SORT_PLAYLIST_OPTIONS) as HTMLDivElement | null;
    const closeOpenIcon = sortPlaylistButton?.querySelector(YupSelectorsByClassName.BUTTON_CLOSE_OPEN_ICON) as HTMLSpanElement | null;
    
    if (!sortPlaylistButton || !sortOptionsMenu || !closeOpenIcon) return;
    
    sortPlaylistButton.addEventListener("click", () => {
      sortOptionsMenu.classList.toggle(YuNamesClasses.YU_HIDDEN);
      if (sortOptionsMenu.classList.contains(YuNamesClasses.YU_HIDDEN)) {
        closeOpenIcon.textContent = "➕";
      } 
      else {
        closeOpenIcon.textContent = "➖";
      }
    });

    const sortOptions: { selector: string; sortType: YuSortPlaylistTypes }[] = [
      { selector: YupSelectorsById.SORT_PLAYLIST_ARTIST_AND_SONG_TITLE_DEFAULT_OPTION, sortType: YuSortPlaylistTypes.BY_SONG_ARTIST_AND_TITLE_ASC },
      { selector: YupSelectorsById.SORT_PLAYLIST_ARTIST_AND_SONG_TITLE_ASC_OPTION, sortType: YuSortPlaylistTypes.BY_SONG_ARTIST_AND_TITLE_ASC },
      { selector: YupSelectorsById.SORT_PLAYLIST_ARTIST_AND_SONG_TITLE_DESC_OPTION, sortType: YuSortPlaylistTypes.BY_SONG_ARTIST_AND_TITLE_DESC },
      { selector: YupSelectorsById.SORT_PLAYLIST_SONG_TITLE_DEFAULT_OPTION, sortType: YuSortPlaylistTypes.BY_SONG_TITLE_ASC },
      { selector: YupSelectorsById.SORT_PLAYLIST_SONG_TITLE_ASC_OPTION, sortType: YuSortPlaylistTypes.BY_SONG_TITLE_ASC },
      { selector: YupSelectorsById.SORT_PLAYLIST_SONG_TITLE_DESC_OPTION, sortType: YuSortPlaylistTypes.BY_SONG_TITLE_DESC },
      { selector: YupSelectorsById.SORT_PLAYLIST_SONG_LENGTH_DEFAULT_OPTION, sortType: YuSortPlaylistTypes.BY_SONG_LENGTH_ASC },
      { selector: YupSelectorsById.SORT_PLAYLIST_SONG_LENGTH_ASC_OPTION, sortType: YuSortPlaylistTypes.BY_SONG_LENGTH_ASC },
      { selector: YupSelectorsById.SORT_PLAYLIST_SONG_LENGTH_DESC_OPTION, sortType: YuSortPlaylistTypes.BY_SONG_LENGTH_DESC },
    ];

    sortOptions.forEach(({ selector, sortType }) => {
      const optionButton = panel.querySelector(selector);
      optionButton?.addEventListener("click", () => {
        yuSortService.sortPlaylist(sortType);
        yuToastService.showToastOverElement(ToastTypes.PLAYLIST_SORT, panel);
      });
    });
  }

  // #endregion UI
}
