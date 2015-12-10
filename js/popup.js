// On document load run the onLoad function
document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
  // STATUS
  if (!localStorage.status) {
    localStorage['status'] = 1; // Default value is 1 (enabled)
  }
  
  button = document.getElementById("stateButton");
  if (button != null) {
    button.innerHTML = ( localStorage.status == 1 )? "Disable" : "Enable";
    button.addEventListener("click", function() {
      // Switches between 0 and 1
      localStorage.status = 1 - localStorage.status;

      // If status is 0 then text is "Disable", if 1 then text is "Enable"
      button.innerHTML = ( localStorage.status == 1 )? "Disable" : "Enable";

      if(localStorage.status == 1){
        chrome.runtime.sendMessage({ "method" : "changeIcon", "path" : "icons/SS16.png" });
      } else {
        chrome.runtime.sendMessage({ "method" : "changeIcon", "path" : "icons/SS16D.png" });
      }
    }, false);
  }
  // OPTIONS - HIGHLIGHTING
  if (!localStorage.o_highlight) {
    localStorage['o_highlight'] = 0; // Default value is 1 (enabled)
  }
  
  o_highlight = document.getElementById("highlight");
  if (o_highlight != null) {
    o_highlight.checked = localStorage['o_highlight'];
    o_highlight.addEventListener("click", function() {
      // switches between true and false
      if (o_highlight.checked) {
        localStorage['o_highlight'] = 1;
      } else {
        localStorage['o_highlight'] = 0;
      }

      // refresh tabs
      chrome.tabs.getSelected(null, function(tab) {
        var code = 'window.location.reload();';
        chrome.tabs.executeScript(tab.id, {code: code});
      });
    }, false);
  }
}

function outputUpdate(level) {
  if (level == 0){
    document.querySelector('#level').value = "Easy";
  }
  else if (level == 1){
    document.querySelector('#level').value = "Medium";
  }
  else if (level == 2){
    document.querySelector('#level').value = "Hard";
  }
}
