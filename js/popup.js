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
  //DIFICULTY
  setSlider();


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
  chrome.storage.local.set({"SSlevel" : Number(level)}, function() {
    if (level == 0){
      document.querySelector('#level').value = "Giraffe";
    }
    else if (level == 1){
      document.querySelector('#level').value = "Medium";
    }
    else if (level == 2){
      document.querySelector('#level').value = "Hard";
    }

    // chrome.runtime.sendMessage({ "method" : "refresh"});
  });
}

function setSlider() {
  chrome.storage.local.get("SSlevel",function(data){
    console.log(data);
    var level = data.SSlevel;
    if (level == 0){
      document.querySelector('#level').value = "Giraffe";
      $('#sliderBox').html('<input type="range" min="0" max="2" value="0" id="slider" step="1">')
    }
    else if (level == 1){
      document.querySelector('#level').value = "Medium";
      $('#sliderBox').html('<input type="range" min="0" max="2" value="1" id="slider" step="1">')
    }
    else if (level == 2){
      document.querySelector('#level').value = "Hard";
      $('#sliderBox').html('<input type="range" min="0" max="2" value="2" id="slider" step="1">')
    }
    $("#slider").mousemove( function(e){
      outputUpdate($(this).val());
    });
  });
}
