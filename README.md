# SAS CSM Helper

A browser extension that provides the following features for SAS ServiceNow CSM:

- Select a case number (e.g., CS1234567), right-click, and use the entries under SAS CSM Helper to:
  - Open the case in classic view
  - Open the TSDrive location for the case in your browser
  - Copy the TSDrive location to your clipboard
- Select a tech support site number (e.g., 71234567), right-click, and use the "View Atlas for site number" menu to open the site number in Atlas
- Select a person's name, right-click, and use "People Search" to search the SAS directory
- Select any text, right-click, and use the "Search TESSA for" menu to search TESSA
- Select a GIDB number (open the account from a case, on the Details tab expand Account, look for a Contact Instructions field that has the GIDB number), right-click, and use "View OneView for GIDB number"
- Expands all case email content in classic view
- **NEW** Select a keyword or product name, right click, and use **Open AG Locator** To:
  - Automatically open the AG Locator Tool
  - Autofill the selected keyword into the search bar
  -  
Basic testing has been done in Edge and Chrome.

Firefox users can try the files in the firefox directory for limited functionality.

## How to install

git clone this project or download the files to a directory on your machine.

Sideload the extension using this process:

Edge: https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading

Chrome: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked

Firefox: https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/

## Contributors

- Hunter Tweed: Redesign, added TSDrive, Atlas, OneView, People search, TESSA, and more 
- Grant Whiteheart: [Original extension](https://gitlab.sas.com/grawhi/csm-case-classic-browser-extension) with open in classic view and expand emails functionality
- Paul Thewalt: Firefox manifest fix
