__webpack_public_path__ = chrome.runtime.getURL('');
// ======================================================================================================================
// TYPECRIPT
// ----------------------------------------
// Const
// ----------------------------------------
import './const/html-attributes';
import './const/intro-js-positions';
import './const/muu-sounds';
import './const/muu-steps';
import './const/toast-messages';
import './const/toast-types';
import './const/update-intervals';
import './const/yt-selectors';
import './const/yt-url-patterns';
import './const/yu-chrome-actions';
import './const/yu-chrome-settings';
import './const/yu-names-animations';
import './const/yu-names-classes';
import './const/yu-names-css-variables';
import './const/yu-sort-playlist-types';
import './const/yup-constants';
import './const/yup-selectors-by-class-name';
import './const/yup-selectors-by-id';
// ----------------------------------------
// Models
// ----------------------------------------
import './models/tutorial-queue';
import './models/tutorial-step';
import './models/tutorial';
// ----------------------------------------
// Services
// ----------------------------------------
import './services/yu-chrome-storage-service';
import './services/yu-log-service';
import './services/yu-sort-service';
import './services/yu-toast-service';
import './services/yup-color-service';
// ----------------------------------------
// Utils
// ----------------------------------------
import './utils/dom-utils';
import './utils/svg-utils';
// ----------------------------------------
// Intro
// ----------------------------------------
import './yu-intro/yu-intro-tutorials';
import './yu-intro/yu-intro';
// ----------------------------------------
// Panel
// ----------------------------------------
import './yup/yup';
// ======================================================================================================================
// CSS
// ----------------------------------------
// Packages
// ----------------------------------------
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'intro.js/introjs.css';
// ----------------------------------------
// Common
// ----------------------------------------
import './common/yu.css';
// ----------------------------------------
// Services
// ----------------------------------------
import './services/sort-playlist.css';
import './services/toast.css';
// ----------------------------------------
// Intro
// ----------------------------------------
import './yu-intro/yu-intro.css';
// ----------------------------------------
// Panel
// ----------------------------------------
import './yup/yup-animation.css';
import './yup/yup-button.css';
import './yup/yup-dropdown.css';
import './yup/yup-header.css';
import './yup/yup-settings.css';
import './yup/yup.css';
// ======================================================================================================================
// INIT
// ----------------------------------------
// Panel
// ----------------------------------------
import { Yup } from './yup/yup';

if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', () => {
        Yup.init();
    });
} else {
    Yup.init();
}