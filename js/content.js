// Runs the onLoad function every time a page is loaded
getStatus(onLoad);

function onLoad(localStatus) {
  // List of words to replace - TODO: Should probably be in a data file
  var wordsToReplace = [
    ["the", "el"],
    ["The", "El"]
  ];

  // Only replace words if status is 1 (SS enabled)
  if (localStatus == 1) {

                                                            //!//replacing the words
    var body = document.body;                                  //get the document body
    if(body == null){
      //somethings wrong yo
      console.error("ERR: document has no body");
      return;
    }
    for (var i = 0; i < wordsToReplace.length; i++) {
      // Goes through the list of words to replace and replaces them on the page
      replaceWord(wordsToReplace[i][0], wordsToReplace[i][1], body);
    } 

                                                             //!//add functionality to replaced words (should move this to another doc)
    var elements = document.getElementsByClassName("test");     //get list of generated elements
    for(var i=0; i<elements.length; i++){
      // console.log(i);
      elements[i].onmousedown = function(event) {               //create on click event
        if (event.which == 3) {                                 //see if its a right click  
            alert("right clicked!");
        }
      }
      elements[i].setAttribute("onContextMenu","return false;");//gets rid of stupid menu thing
    }

  }

}

// Function for replacing given words (word1 is the word to be replaced)
function replaceWord(word1, word2, body) {
  console.log("replacing: " + word1);            //!//start replacing

  var element = document.createElement('span');     //create an element to embed
  element.className='test';
  
  var qString = "\\b" + word1 + "\\b";              //'//b' is to omit embedded words (like rather and other for the)
  var findMe = new RegExp(qString, "g");            //make regex

  findAndReplaceDOMText(body, {                     //replace
    // preset: 'prose',
    find: findMe,
    // replace: function(portion, match) {
    //   return '[[' + portion.index + ']]';
    // }
    replace: '[[right click me dawg]]',
    wrap: element
  });

  // document.body.innerHTML = document.body.innerHTML.replace(new RegExp(word1, "g"), word2);
}

function getStatus( callback ) {  
  chrome.runtime.sendMessage({method: "getStatus"}, function(response) {
    callback(response.status);
  });
}

//for reference 
// element actions  http://www.w3schools.com/jsref/dom_obj_all.asp
// DOM manipulator  https://github.com/padolsey/findAndReplaceDOMText
// DOM article      http://james.padolsey.com/javascript/replacing-text-in-the-dom-solved/