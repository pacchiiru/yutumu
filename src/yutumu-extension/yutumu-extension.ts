import '../yutumu/yutumu.css';
import './yutumu-extension.css';

const reopenButton = document.getElementById('reopenYutumuPanel') as HTMLButtonElement;
reopenButton.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    const tab = tabs[0];
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, { action: "reopen_yutumu_panel" });
    }
  });
});
