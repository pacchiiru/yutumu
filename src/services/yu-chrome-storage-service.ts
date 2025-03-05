export class YuChromeStorageService {
  async getSetting<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, (items) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(items[key] ?? null);
      });
    });
  }

  async setSetting(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }
}

export const yuChromeStorageService = new YuChromeStorageService();