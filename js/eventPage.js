chrome.tabs.onActivated.addListener(tabChanged);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.method == "getStatus") {
      console.log(localStorage['status']);
      sendResponse({status: localStorage['status']});
    }
    if(request.method == "changeIcon") {
    	chrome.browserAction.setIcon({
            path: request.path,
            // tabId: sender.tab.id
        });
    }
  });


// Function called every time the current tab is changed
function tabChanged(activeInfo) {
  // TODO: Refresh the tab if the extension status has been changed
}