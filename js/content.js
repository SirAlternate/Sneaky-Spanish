//content.js
//MAIN
//controls translation and replacement of words
getStatus(onLoad); // ensures getStatus finishes before onLoad is called

function getStatus(callback) {
  chrome.runtime.sendMessage({
    method: "getStatus"
  }, function(response) {
    callback(response);
  });
  
  chrome.runtime.sendMessage({
    method: "getO_highlight"
  }, function(response) {
    highlight = response;
  });
}

function onLoad(localStatus) {
  // only replace words if status is 1 (SS enabled)
  if (localStatus == 1) {

    chrome.storage.local.get("SSlevel", function(levelData) {
      console.log(levelData);  
    // FROM FILEUTIL.JS
    getDictionary(levelData.SSlevel, function(responseData) {

      dic = Object.keys(responseData);
      var count = dic.length;

      for (var i = count - 1; i >= 0; i--) { //loop thru dictionary and handle
        handle(dic[i], responseData, function() {
          // console.log("\tcount: " + i);
          if (i == 0) {
            // FROM POPBOX.JS
            addJ("sneakyWord"); // add functionality to new elements once done
          }
        });
      }
      
      // body click event for hiding popovers
      $('body').on('click', function(e) {
        if(!$(e.target).is('.popover-content') && !$(e.target).parents('.popover-content').is('.popover-content')) {
          if($(e.target).data('toggle') !== 'popover') {
            $('[data-toggle="popover"]').popover('hide');
          }
        }
      });
    });
    });
  }
}

//handles a word
function handle(EWord, dic, cb) {
  translateFromFile(EWord, dic, function(SWord) {
    replaceWord(EWord, SWord, function() {
      cb();
    });
  });
}

function translateFromFile(Eword, dic, cb) {
  cb(dic[Eword].def);
}

// Function for replacing given words (word1 is the word to be replaced)
function replaceWord(word1, word2, cb) {
  var element = document.createElement('span'); //create an element to embed
  element.className = "sneakyWord"; //identify the new element

  $(element).attr('data-toggle', 'popover');
  $(element).attr('data-trigger', 'focus');
  $(element).attr('data-container', 'body');
  $(element).attr('data-placement', 'auto top');
  $(element).attr('data-html', 'true');
  $(element).attr('EWord', word1);
  $(element).attr('SWord', word2);
  
  if (highlight == 1) {
    $(element).attr('style', 'color: black; background-color: yellow');
  }

  var qString = "\\b" + word1 + "\\b"; //'//b' is to omit embedded words (like rather and other for the)
  var findMe = new RegExp(qString, "g"); //make regex
  
  var body = document.body;
  findAndReplaceDOMText(body, { //replace
    find: findMe,

    replace: word2,

    wrap: element
  });
  
//  var qString2 = "\\b" + word1.charAt(0).toUpperCase() + word1.slice(1) + "\\b";
//  var findMe2 = new RegExp(qString2, "g"); //make regex
//  findAndReplaceDOMText(body, { //replace
//    find: findMe2,
//
//    replace: word2,
//
//    wrap: element
//  });
  cb();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
// For reference:
// element actions  http://www.w3schools.com/jsref/dom_obj_all.asp
// DOM manipulator  https://github.com/padolsey/findAndReplaceDOMText
// DOM article      http://james.padolsey.com/javascript/replacing-text-in-the-dom-solved/