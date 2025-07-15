document.addEventListener("selectionchange", () => {
  const selection = window.getSelection().toString().trim();
  
  if (selection) {
    console.log("Selected text:", selection);
    if (chrome.runtime?.id) {
    // Send the selected text to the background script
    chrome.runtime.sendMessage({ action: "updateContextMenu", selection });
   }  
  }
});
