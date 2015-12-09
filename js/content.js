//content.js
//MAIN
//controls translation and replacement of words
getStatus(onLoad); // ensures getStatus finishes before onLoad is called

function getStatus(callback) {
  chrome.runtime.sendMessage({
    method: "getStatus"
  }, function(response) {
    callback(response.status);
  });
}

function onLoad(localStatus) {

  // console.log("writing to chrome:");
  // chrome.storage.local.set({'test1':1}, function() {
  //       // Notify that we saved.
  //       console.log('Settings saved');
  //     });
  // var thing = "dope";
  // rightClick("yo");
  // rightClick("yo");
  // rightClick("yo");

  chrome.storage.local.get('test1', function(data) {
    // Notify that we saved.
    console.log(data);
    console.log(Object.keys(data).length);
  });

  // only replace words if status is 1 (SS enabled)
  if (localStatus == 1) {

    // FROM FILEUTIL.JS
    getDictionary(function(responseData) {

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

  var qString = "\\b" + word1 + "\\b"; //'//b' is to omit embedded words (like rather and other for the)
  var findMe = new RegExp(qString, "g"); //make regex

  var body = document.body;
  findAndReplaceDOMText(body, { //replace
    find: findMe,

    replace: word2,

    wrap: element
  });
  cb();
}


// For reference:
// element actions  http://www.w3schools.com/jsref/dom_obj_all.asp
// DOM manipulator  https://github.com/padolsey/findAndReplaceDOMText
// DOM article      http://james.padolsey.com/javascript/replacing-text-in-the-dom-solved/