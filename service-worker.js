//Create Context Menu items here. Hide the ones that depend on what the selection is (e.g. 'classic' and 'openTsDrive' depend on a Case Number)

//This function checks for the existence of a context menu item before trying to create it. This is to avoid duplicate ID errors when this javascript runs
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

//Use the createContextMenu function to create the menu item. Pass in ID and properties
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
  visible: false
});

createContextMenu("openTsDrive", {
  title: "View TSDrive Folder for case %s",
  contexts: ["selection"],
  visible: false
});

createContextMenu("copyToClipboard", {
  title: "Copy TS Drive Folder to Clipboard",
  contexts: ["selection"],
  visible: false
});

createContextMenu("viewAtlas", {
  title: "View Atlas for Site Number %s",
  contexts: ["selection"],
  visible: false
});

createContextMenu("oneView", {
  title: "View OneView for GIDB Number %s",
  contexts: ["selection"],
  visible: false
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateContextMenu") {
        const selectedText = request.selection || "";
        const caseNum = /^CS\d{7}$/;
        const siteNum = /^7\d{7}$/;
        const gidbNum = /^\d+$/;

        if (caseNum.test(selectedText)) {
            // If we've got a case number, make these menu items visible
            chrome.contextMenus.update("classic", {
                title: "Open case %s in classic view",
                contexts: ["selection"],
                visible: true // Make it visible
            });
            chrome.contextMenus.update("openTsDrive", {
                title: 'View TSDrive Folder for case %s',
                contexts: ["selection"],
                visible: true
            });
            chrome.contextMenus.update("copyToClipboard", {
                title: "Copy TS Drive Folder to Clipboard",
                contexts: ["selection"],
                visible: true
            });

            // If we previously made these visible, then hide these
            chrome.contextMenus.update("viewAtlas", { visible: false });
            chrome.contextMenus.update("oneView", { visible: false });

        } else if (siteNum.test(selectedText)) {
			// If we have a site number, make this one visible
            chrome.contextMenus.update("viewAtlas", {
                title: "View Atlas for Site Number %s",
                contexts: ["selection"],
                visible: true
            });

            // If we previously made these visible, then hide these
            chrome.contextMenus.update("classic", { visible: false });
            chrome.contextMenus.update("openTsDrive", { visible: false });
            chrome.contextMenus.update("copyToClipboard", { visible: false });
            chrome.contextMenus.update("oneView", { visible: false });

        } else if (gidbNum.test(selectedText)) {
			// If we have a GIDB number, make this one visible
            chrome.contextMenus.update("oneView", {
                title: "View OneView for GIDB Number %s",
                contexts: ["selection"],
                visible: true
            });

            // If we previously made these visible, then hide these
            chrome.contextMenus.update("classic", { visible: false });
            chrome.contextMenus.update("openTsDrive", { visible: false });
            chrome.contextMenus.update("copyToClipboard", { visible: false });
            chrome.contextMenus.update("viewAtlas", { visible: false });
        } else {
            // Otherwise hide all conditional menus if no condition is met
            chrome.contextMenus.update("classic", { visible: false });
            chrome.contextMenus.update("openTsDrive", { visible: false });
            chrome.contextMenus.update("copyToClipboard", { visible: false });
            chrome.contextMenus.update("viewAtlas", { visible: false });
            chrome.contextMenus.update("oneView", { visible: false });
        }
    }
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
   //Classic sends us over to legacy view in SN for a given case

  
if (info.menuItemId === "openAGLocatorForKeyword") {
    const keyword = info.selectionText.trim();
     if (keyword.length > 0) {
     const encodedKeyword = encodeURIComponent(keyword);
    const url = `http://toothless.unx.sas.com/aglocator/index.html#/search?=${encodeURIComponent(keyword)}`;
    chrome.tabs.create({ url });
     } else {
     console.log("No keyword provided");
     }
  
  if (info.menuItemId === "classic") {
    chrome.tabs.create({
      url: `https://sas.service-now.com/sn_customerservice_case.do?sysparm_query=number=${encodeURIComponent(info.selectionText)}`
    });
  } 
  //openTsDrive opens the web view of TS Drive for a given case
  if (info.menuItemId === "openTsDrive") {
    chrome.tabs.create({
      url: `file://isilon03smb/SASTSDrive/${encodeURIComponent(info.selectionText)}/workspace/From_Customer`
    });
  }
  //copyToClipboard copies the UNC path of TSDrive for a given case to the clipboard
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
  //viewAtlas takes a customer site number and opens the Atlas/Contract webpage
  if (info.menuItemId === "viewAtlas") {
    chrome.tabs.create({
        url: `https://atlas.na.sas.com/scripts/broker.dll?_program=saspgms.ref4.sas&_service=atlas&ref4=&Setnumid=${encodeURIComponent(info.selectionText)}` 
    })
  }
  //oneView takes a customer gidb number and opens the OneView page for it
  if (info.menuItemId === "oneView") {
    chrome.tabs.create({
        url: `https://oneview.sas.com/sites/${encodeURIComponent(info.selectionText)}/overview` 
    })
  }
  //tessa takes any selection and send it over to Tesssa to search
  if (info.menuItemId === "tessa") {
    chrome.tabs.create({
        url: `https://soul3.na.sas.com:8443/TESSA/main/searchResultList.jsp?qt=${encodeURIComponent(info.selectionText)}&qtpure=${encodeURIComponent(info.selectionText)}&isQuickSearch=&collection=all`
    })
  }
  //directory takes any selection and searches the SAS directory for that person or keyword
  if (info.menuItemId === "directory") {
    chrome.tabs.create({
        url: `https://sas-people.sas.com/?search-type=name&keyword=${encodeURIComponent(info.selectionText)}&bool=and&x=22&y=9`
    })
  }
});

