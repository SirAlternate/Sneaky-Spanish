getStatus(onLoad); // ensures getStatus finishes before onLoad is called

function getStatus( callback ) {  
  chrome.runtime.sendMessage({method: "getStatus"}, function(response) {
    callback(response.status);
  });
}

function onLoad(localStatus) {
  // list of words to replace
  var wordsToReplace = [
    ["giraffe", "jirafa"],
    ["Giraffe", "Jirafa"]
  ];

  // only replace words if status is 1 (SS enabled)
  if (localStatus == 1) {
    
    // get the document body
    var body = document.body;
    if(body == null) { // just incase
      console.error("ERR: document has no body");
      return;
    }
    
    // goes through the list of words to replace and replaces them on the page
    for (var i = 0; i < wordsToReplace.length; i++) {
      replaceWord(wordsToReplace[i][0], wordsToReplace[i][1], body);
    } 
    
    // TODO => add functionality to replaced words (should move this to another doc)
    // get a list of all changed words in the document
    var elements = document.getElementsByClassName("sneakyWord");
    for(var i=0; i<elements.length; i++){ 
      // add click event
      elements[i].onmousedown = function(event) {
        if (event.which == 3) {  
          // hide already-toggled popovers
          $('.sneakyWord').popover('hide');
          // populate and toggle popover
          populatePopover(this);
          $(this).popover('toggle');
        }
      }
      // get rid of stupid menu thing
      elements[i].setAttribute("onContextMenu","return false;");
    }
    
    // body click event for hiding popovers
    $('body').on('click', function(e) {
      if($(e.target).data('toggle') !== 'popover') {
        $('[data-toggle="popover"]').popover('hide');
      }
    })

  }

}

function populatePopover(element) {
  word = element.innerHTML.charAt(0).toUpperCase() + element.innerHTML.toLowerCase().slice(1);
  wordType = 'noun'; // PLACEHOLDER
  $(element).attr('data-title', word + ' (' + wordType + ')');
  $(element).attr('data-content', '<b>English:</b> ' + 'Giraffe' + '<br><b>Difficulty level:</b> ' + '3' + '<br><br><b>Times...\u00A0\u00A0\u00A0\u00A0Seen:</b> ' + '4' + '\u00A0\u00A0\u00A0\u00A0<b>Clicked:</b> ' + '1');
}

// Function for replacing given words (word1 is the word to be replaced)
function replaceWord(word1, word2, body) {
  console.log("replacing: " + word1);            //!//start replacing

  var element = document.createElement('em');     //create an element to embed
  element.className='sneakyWord';
  if (false) {
    $(element).attr('style', 'background-color:yellow; color:black;');
  }
  $(element).attr('data-toggle', 'popover');
  $(element).attr('data-trigger', 'focus');
  $(element).attr('data-placement', 'auto top');
  $(element).attr('data-html', 'true');
  
  var qString = "\\b" + word1 + "\\b";              //'//b' is to omit embedded words (like rather and other for the)
  var findMe = new RegExp(qString, "g");            //make regex

  findAndReplaceDOMText(body, {                     //replace
    // preset: 'prose',
    find: findMe,
    // replace: function(portion, match) {
    //   return '[[' + portion.index + ']]';
    // }
    replace: word2,
    wrap: element
  });
}

// For reference:
// element actions  http://www.w3schools.com/jsref/dom_obj_all.asp
// DOM manipulator  https://github.com/padolsey/findAndReplaceDOMText
// DOM article      http://james.padolsey.com/javascript/replacing-text-in-the-dom-solved/