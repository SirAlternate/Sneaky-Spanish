//fileUtil.js
//scripts handling reading and writing from the dictionary

//get the dictionary as a js object
function getDictionary(cb) {	
	$.ajax({
      type: "GET",
      url: chrome.extension.getURL('js/resources/dictionary.json'),
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