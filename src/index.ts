// ======================================================================================================================
// YUTUMU CHROME EXTENSION - ENTRY POINT
// ======================================================================================================================
// ======================================================================================================================
// IMPORTS - TYPECRIPT
// ======================================================================================================================
// ----------------------------------------
// Import Constants
// ----------------------------------------
import './const/youtube-selectors';
import './const/youtube-url-patterns';
import './const/yutumu-intro-positions';
import './const/yutumu-log-messages';
import './const/yutumu-muu-sounds';
import './const/yutumu-muu-steps';
import './const/yutumu-panel-constants';
import './const/yutumu-panel-toast-actions';
import './const/yutumu-panel-toast-messages';
import './const/yutumu-panel-selectors';
import './const/yutumu-sort-playlist-types';
// ----------------------------------------
// Import Utilities
// ----------------------------------------
import './utils/dom-utils';
import './utils/inject-svg-filters';
// ----------------------------------------
// Import Yutumu
// ----------------------------------------
import './yutumu/sort-playlist';
import './yutumu-intro/yutumu-intro-tutorials';
import './yutumu-intro/yutumu-intro';
import './yutumu-panel/yutumu-panel';
import './yutumu-panel-toast/yutumu-panel-toast';
// ======================================================================================================================
// IMPORTS - CSS
// ======================================================================================================================
// ----------------------------------------
// Import Intro.js
// ----------------------------------------
import 'intro.js/introjs.css';
// ----------------------------------------
// Import Yutumu
// ----------------------------------------
import './yutumu/yutumu.css';
import './yutumu/sort-playlist.css';
import './yutumu-intro/yutumu-intro.css';
import './yutumu-panel/yutumu-panel-animation.css';
import './yutumu-panel/yutumu-panel.css';
import './yutumu-panel-toast/yutumu-panel-toast.css';
// ======================================================================================================================
// INITIALIZE PANEL
// ======================================================================================================================
import { YutumuPanel } from './yutumu-panel/yutumu-panel';

if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', () => {
        YutumuPanel.init();
    });
} else {
    YutumuPanel.init();
}