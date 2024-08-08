// Create the context menu item when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "openInStermio",
        // title: "Open '%s' in Stremio",
        title: "Search in Stremio",
        contexts: ["selection"]
    });
});

// Listen for clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "openInStermio" && info.selectionText) {
        const movieName = info.selectionText.trim();
        searchMovie(movieName);
    }
});

// Search for the movie using the metadata
function searchMovie(movieName) {
    chrome.tabs.create({url: "stremio:///search?search=" + movieName});
}
