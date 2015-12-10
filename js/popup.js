// On document load run the onLoad function
document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
  // If status field does not exist locally then create it
  if (!localStorage.status) {
    localStorage['status'] = 1; // Default value is 1 (enabled)
  }

  // Fetch button from html, update its state, and create event listener
  button = document.getElementById("stateButton");
  button.innerHTML = ( localStorage.status == 1 )? "Disable" : "Enable";
  button.addEventListener("click", toggleState, false);

}

// Function for toggling between statuses
function toggleState() {
  // Switches between 0 and 1
  localStorage.status = 1 - localStorage.status;
  
  // If status is 0 then text is "Disable", if 1 then text is "Enable"
  button.innerHTML = ( localStorage.status == 1 )? "Disable" : "Enable";

  if(localStorage.status == 1){
    chrome.runtime.sendMessage({ "method" : "changeIcon", "path" : "SS16D.png" });
  } else {
    chrome.runtime.sendMessage({ "method" : "changeIcon", "path" : "SS16.png" });
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
