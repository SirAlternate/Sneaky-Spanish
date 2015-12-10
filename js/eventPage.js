chrome.tabs.onActivated.addListener(tabChanged);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.method == "getStatus") {
      console.log(localStorage['status']);
      sendResponse(localStorage['status']);
    }
    if(request.method == "getO_highlight") {
      sendResponse(localStorage['o_highlight']);
    }
    if(request.method == "changeIcon") {
      chrome.tabs.getSelected(null, function(tab) {
        var code = 'window.location.reload();';
        chrome.tabs.executeScript(tab.id, {code: code});
      });
    	chrome.browserAction.setIcon({
            path: request.path,
            // tabId: sender.tab.id
        });
    }
    if(request.method == "refresh") {
      chrome.tabs.getSelected(null, function(tab) {
        var code = 'window.location.reload();';
        chrome.tabs.executeScript(tab.id, {code: code});
      });
    }
  });


// Function called every time the current tab is changed
function tabChanged(activeInfo) {
  // TODO: Refresh the tab if the extension status has been changed
}