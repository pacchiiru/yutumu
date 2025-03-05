import '../common/yu.css';
import './yue.css';

import { YuChromeActions } from '../const/yu-chrome-actions';

const reopenButton = document.getElementById("yu-id-reopen-yup") as HTMLButtonElement;
reopenButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    const tab = tabs[0];
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, { action: YuChromeActions.REOPEN_YUP });
    }
  });
});
