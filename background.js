let currentTabId = null;
let currentDomain = null;
let startTime = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await switchTab(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    switchTab(tabId);
  }
});

async function switchTab(tabId) {
  if (currentDomain && startTime) {
    const duration = Date.now() - startTime;
    chrome.storage.local.get([currentDomain], (result) => {
      const total = result[currentDomain] || 0;
      chrome.storage.local.set({ [currentDomain]: total + duration });
    });
  }

  chrome.tabs.get(tabId, (tab) => {
    const url = new URL(tab.url || "");
    currentDomain = url.hostname;
    startTime = Date.now();
    currentTabId = tabId;
  });
}

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    switchTab(null); // user left Chrome
  } else if (currentTabId !== null) {
    switchTab(currentTabId);
  }
});
