//fileUtil.js
//scripts handling reading and writing from the dictionary

//get the dictionary as a js object
function getDictionary(level, cb) {
  var url;
  if(level == 0){
    url = 'js/resources/easydictionary.json';
  }	
  else {
    url = 'js/resources/dictionary.json';
  }
  
	$.ajax({
      type: "GET",
      url: chrome.extension.getURL(url),
      dataType: "json",
      success: function(responseData, status){
        console.log("got the dictionary!");
        cb(responseData);
      },
      error: function(msg) {
        // there was a problem
        alert("There was a problem: " + msg.status + " " + msg.statusText);
      }
    });
}