import { YouTubeSelectors } from '../const/youtube-selectors';
import { YouTubeUrlPatterns } from '../const/youtube-url-patterns';
import { YutumuPanelConstants } from '../const/yutumu-panel-constants';
import { ToastActions } from '../const/yutumu-panel-toast-actions';
import { getElementOffsetHeight, getElementOffsetWidth } from '../utils/dom-utils';
import { injectSvgFilters } from '../utils/inject-svg-filters';
import { showToastOverElement } from '../yutumu-panel-toast/yutumu-panel-toast';
import { bindUIButtonActions, setupDragAndDrop, setupResizable } from './yutumu-panel-events';
import panelTemplate from './yutumu-panel.html';

export class YutumuPanel {
  private panelElement: HTMLElement | null = null;

  constructor() {
    injectSvgFilters();
  }

  public createPanel(): void {

    // Prevent duplicate panel
    if (document.getElementById('yutumu')) return;

    const panel = document.createElement('div');
    panel.id = "yutumu";
    panel.className = "yutumu-panel";
    const bannerUrl: string = chrome.runtime.getURL("assets/images/banner_medium.webp");
    panel.innerHTML = panelTemplate.replace('{{BANNER_URL}}', bannerUrl);
    document.body.appendChild(panel);
    this.panelElement = panel;

    // Positioning: next to sidebar, below navbar
    const openTargetX = getElementOffsetWidth(YouTubeSelectors.SIDEBAR) + YutumuPanelConstants.POS_PADDING;
    const openTargetY = getElementOffsetHeight(YouTubeSelectors.NAVBAR) + YutumuPanelConstants.POS_PADDING;
    panel.style.transform = `translate(${openTargetX}px, ${openTargetY}px)`;
    panel.setAttribute('data-x', `${openTargetX}`);
    panel.setAttribute('data-y', `${openTargetY}`);

    // Initialize panel drag, resize, and button clicks
    const header = panel.querySelector('.yutumu-panel-header') as HTMLElement | null;
    if (header) {
      setupDragAndDrop(panel, header);
    }
    setupResizable(panel);
    bindUIButtonActions(panel);

    // Open animation
    const currentTransform = window.getComputedStyle(panel).transform;
    panel.style.setProperty('--initial-transform', currentTransform);
    panel.classList.add('opening');
    panel.addEventListener('animationend', function openHandler(e: AnimationEvent) {
      if (e.animationName === "yutumu-panel-open") {
        showToastOverElement(ToastActions.OPEN, panel);
        panel.removeEventListener('animationend', openHandler);
        panel.classList.remove('opening');
      }
    });
  }

  // Reopen Panel
  public static init(): void {
    const yutumuPanel = new YutumuPanel();
    yutumuPanel.createPanel();
    chrome.runtime.onMessage.addListener((message: any) => {
      if (message.action === "reopen_yutumu_panel") {
        yutumuPanel.createPanel();
      }
    });
  }
}

function updatePanelContext() {
  const url = window.location.href;
  const isPlaylistPage = YouTubeUrlPatterns.PLAYLIST.test(url);
  const isHomePage = YouTubeUrlPatterns.HOME.test(url);
  const elements = document.querySelectorAll("[data-context]");

  elements.forEach((element) => {
    const context = element.getAttribute("data-context");
    const shouldBeVisible =
      (context === "playlist" && isPlaylistPage) ||
      (context === "home" && isHomePage);

    const isCurrentlyVisible = !element.classList.contains("fadeOut");

    if (shouldBeVisible && !isCurrentlyVisible) {
      element.classList.remove("fadeOut");
      element.classList.add("fadeIn");
    } 
    else if (!shouldBeVisible && isCurrentlyVisible) {
      element.classList.remove("fadeIn");
      element.classList.add("fadeOut");
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    updatePanelContext();
    setInterval(updatePanelContext, 2000);
  });
} 
else {
  updatePanelContext();
  setInterval(updatePanelContext, 2000);
}