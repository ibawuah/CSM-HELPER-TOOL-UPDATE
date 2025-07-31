// Function to create or update context menu items dynamically
function createContextMenu(id, properties) {
  chrome.contextMenus.update(id, properties, () => {
    if (chrome.runtime.lastError) {
      // Menu item with the given ID doesn't exist, so create it
      chrome.contextMenus.create({ id: id, ...properties });
    } else {
      // Menu item already exists (updated successfully)
      console.log(`Menu item with ID "${id}" already exists.`);
    }
  });
}

// Create initial context menu items
createContextMenu("openAGLocatorForKeyword", {
  title: "Open AG Locator for selection: %s",
  contexts: ["selection"],
});

createContextMenu("tessa", {
  title: "Search TESSA for selection: %s",
  contexts: ["selection"],
});

createContextMenu("directory", {
  title: "People Search for %s",
  contexts: ["selection"],
});

createContextMenu("classic", {
  title: "Open case %s in classic view",
  contexts: ["selection"],
  visible: false, // Initially hidden
});

createContextMenu("openTsDrive", {
  title: "View TSDrive Folder for case %s",
  contexts: ["selection"],
  visible: false, // Initially hidden
});

createContextMenu("copyToClipboard", {
  title: "Copy TS Drive Folder to Clipboard",
  contexts: ["selection"],
  visible: false, // Initially hidden
});

createContextMenu("viewAtlas", {
  title: "View Atlas for Site Number %s",
  contexts: ["selection"],
  visible: false, // Initially hidden
});

createContextMenu("oneView", {
  title: "View OneView for GIDB Number %s",
  contexts: ["selection"],
  visible: false, // Initially hidden
});

// Listen for messages to update the visibility of context menus based on selected text
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateContextMenu") {
    const selectedText = request.selection || "";
    const caseNum = /^CS\d{7}$/;
    const siteNum = /^7\d{7}$/;
    const gidbNum = /^\d+$/;

    if (caseNum.test(selectedText)) {
      // Case number detected: show related menu items
      chrome.contextMenus.update("classic", { visible: true });
      chrome.contextMenus.update("openTsDrive", { visible: true });
      chrome.contextMenus.update("copyToClipboard", { visible: true });

      // Hide unrelated menu items
      chrome.contextMenus.update("viewAtlas", { visible: false });
      chrome.contextMenus.update("oneView", { visible: false });
    } else if (siteNum.test(selectedText)) {
      // Site number detected: show related menu items
      chrome.contextMenus.update("viewAtlas", { visible: true });

      // Hide unrelated menu items
      chrome.contextMenus.update("classic", { visible: false });
      chrome.contextMenus.update("openTsDrive", { visible: false });
      chrome.contextMenus.update("copyToClipboard", { visible: false });
      chrome.contextMenus.update("oneView", { visible: false });
    } else if (gidbNum.test(selectedText)) {
      // GIDB number detected: show related menu items
      chrome.contextMenus.update("oneView", { visible: true });

      // Hide unrelated menu items
      chrome.contextMenus.update("classic", { visible: false });
      chrome.contextMenus.update("openTsDrive", { visible: false });
      chrome.contextMenus.update("copyToClipboard", { visible: false });
      chrome.contextMenus.update("viewAtlas", { visible: false });
    } else {
      // Hide all if no relevant selection type is found
      chrome.contextMenus.update("classic", { visible: false });
      chrome.contextMenus.update("openTsDrive", { visible: false });
      chrome.contextMenus.update("copyToClipboard", { visible: false });
      chrome.contextMenus.update("viewAtlas", { visible: false });
      chrome.contextMenus.update("oneView", { visible: false });
    }
  }
});

// Handle context menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log(`Clicked menu item: ${info.menuItemId}`);
  console.log(`Selected text: ${info.selectionText}`);

  if (info.menuItemId === "openAGLocatorForKeyword") {
    const keyword = info.selectionText.trim();
    if (keyword.length > 0) {
      const url = `http://toothless.unx.sas.com/aglocator/index.html?search=${encodeURIComponent(keyword)}`;
      chrome.tabs.create({ url });
    } else {
      console.log("No keyword provided for AG Locator.");
    }
  }

  if (info.menuItemId === "classic") {
    chrome.tabs.create({
      url: `https://sas.service-now.com/sn_customerservice_case.do?sysparm_query=number=${encodeURIComponent(info.selectionText)}`
    });
  }

  if (info.menuItemId === "openTsDrive") {
    chrome.tabs.create({
      url: `file://isilon03smb/SASTSDrive/${encodeURIComponent(info.selectionText)}/workspace/From_Customer`
    });
  }

  if (info.menuItemId === "copyToClipboard") {
    const path = `\\\\isilon03smb\\SASTSDrive\\${info.selectionText}\\workspace\\From_Customer`;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (text) => {
        navigator.clipboard.writeText(text);
      },
      args: [path]
    });
  }

  if (info.menuItemId === "viewAtlas") {
    chrome.tabs.create({
      url: `https://atlas.na.sas.com/scripts/broker.dll?_program=saspgms.ref4.sas&_service=atlas&ref4=&Setnumid=${encodeURIComponent(info.selectionText)}`
    });
  }

  if (info.menuItemId === "oneView") {
    chrome.tabs.create({
      url: `https://oneview.sas.com/sites/${encodeURIComponent(info.selectionText)}/overview`
    });
  }

  if (info.menuItemId === "tessa") {
    chrome.tabs.create({
      url: `https://soul3.na.sas.com:8443/TESSA/main/searchResultList.jsp?qt=${encodeURIComponent(info.selectionText)}&qtpure=${encodeURIComponent(info.selectionText)}&isQuickSearch=&collection=all`
    });
  }

  if (info.menuItemId === "directory") {
    chrome.tabs.create({
      url: `https://sas-people.sas.com/?search-type=name&keyword=${encodeURIComponent(info.selectionText)}&bool=and&x=22&y=9`
    });

