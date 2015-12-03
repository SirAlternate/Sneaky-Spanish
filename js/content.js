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
  var words = ["giraffe", "Giraffe", "species", "tallest", "living", "time","issue","year","side","people","kind","way","head","day","house","man","service","thing","friend","woman","father","life","power","child","hour","world","game","school","line","state","end","family","member","student","law","group","car","country","city","problem","community","hand","name","part","president","place","team","case","minute","week","idea","company","kid","system","body","program","information","question","back","work","parent","government","face","number","others","night","level","Mr","office","point","door","home","health","water","person","room","art","mother","war","area","history","money","party","storey","result","fact","change","month","morning","lot","reason","right","research","study","girl","book","guy","eye","food","job","moment","word","air","business","teacher"];

  // only replace words if status is 1 (SS enabled)
  if (localStatus == 1) {
    
    // get the document body
    // var body = document.body;
    // if(body == null) { // just incase
    //   console.error("ERR: document has no body");
    //   return;
    // }
    
    //HANDLEING WORDS IN FOR LOOP
    $.ajax({
      type: "GET",
      url: chrome.extension.getURL('js/dictionary.json'),
      dataType: "json",
      success: function(responseData, status){

        console.log("got the dictionary!");
        dic = responseData;
        var count = Object.keys(dic).length;
        for (var i = 0; i < words.length; i++) {
          handle(words[i], dic, function(){
            count--;
            console.log("\tcount: " + count);
          });
          if(count == 0){
            addJ("sneakyWord"); // add functionality to new elements
          }
        }
      },
      error: function(msg) {
        // there was a problem
        alert("There was a problem: " + msg.status + " " + msg.statusText);
      }
    });

    // translateFromFile("asdf");

    // goes through the list of words to replace and replaces them on the page
    // for (var i = 0; i < wordsToReplace.length; i++) {
    //   replaceWord(wordsToReplace[i][0], wordsToReplace[i][1]);
    // } 
    
    // TODO => add functionality to replaced words (should move this to another doc)
    // get a list of all changed words in the document
  }
}

function addJ(className){ 
    console.log("adding J for: " + className);
    var elements = document.getElementsByClassName(className);
    for(var i=0; i<elements.length; i++){ 
      // add click event
      elements[i].onmousedown = function(event) {
        console.log("quit it");
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

function populatePopover(element) {
  word = element.innerHTML.charAt(0).toUpperCase() + element.innerHTML.toLowerCase().slice(1);
  wordType = 'noun'; // PLACEHOLDER
  $(element).attr('data-title', word + ' (' + wordType + ')');
  $(element).attr('data-content', '<b>English:</b> ' + 'Giraffe' + '<br><b>Difficulty level:</b> ' + '3' + '<br><br><b>Times...\u00A0\u00A0\u00A0\u00A0Seen:</b> ' + '4' + '\u00A0\u00A0\u00A0\u00A0<b>Clicked:</b> ' + '1');
}

//handles a word
function handle(EWord, dic, cb){
  // translateFromAPI(EWord, function(SWord){
  //   replaceWord(EWord,SWord);
  // });
  translateFromFile(EWord, dic, function(SWord){
      replaceWord(EWord,SWord,function(){
        cb();
      });
    });
}
//translates a word from API
function translateFromAPI(EWord, cb){
  console.log("translating(A): " + EWord); 
  $.ajax({
    type: "GET",
    url: "https://glosbe.com/gapi/translate?from=eng&dest=spa&format=json&phrase="+EWord,
    dataType: "json",
    success: function(responseData, status){
      console.log("\ttranslated: " + responseData.tuc[0].phrase.text + "\tstatus: " + status);
      cb(responseData.tuc[0].phrase.text);
    },
    error: function(msg) {
      // there was a problem
      alert("There was a problem: " + msg.status + " " + msg.statusText);
    }
  });
}
function translateFromFile(Eword, dic, cb){
  cb(dic[Eword]);
  // console.log("translating(F): " + Eword);
  // $.ajax({
  //   type: "GET",
  //   url: chrome.extension.getURL('js/dictionary.json'),
  //   dataType: "json",
  //   success: function(responseData, status){
  //     console.log(responseData);
  //     console.log("\ttranslated: " + responseData[Eword] + "\tstatus: " + status);
  //     cb(responseData[Eword]);
  //   },
  //   error: function(msg) {
  //     // there was a problem
  //     alert("There was a problem: " + msg.status + " " + msg.statusText);
  //   }
  // });

//   var xhr = new XMLHttpRequest();
// xhr.open('GET', chrome.extension.getURL('script1.txt'), true);
// xhr.onreadystatechange = function()
// {
//     if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
//     {
//         //... The content has been read in xhr.responseText
//     }
// };
// xhr.send();

}

// Function for replacing given words (word1 is the word to be replaced)
function replaceWord(word1, word2, cb) {
  console.log("replacingg: " + word1);            //!//start replacing

  var element = document.createElement('em');     //create an element to embed
  element.className="sneakyWord";                 //identify the new element
  if (false) {
    $(element).attr('style', 'background-color:yellow; color:black;');
  }
  $(element).attr('data-toggle', 'popover');
  $(element).attr('data-trigger', 'focus');
  $(element).attr('data-placement', 'auto top');
  $(element).attr('data-html', 'true');
  
  var qString = "\\b" + word1 + "\\b";              //'//b' is to omit embedded words (like rather and other for the)
  var findMe = new RegExp(qString, "g");            //make regex

  var body = document.body;
  findAndReplaceDOMText(body, {                     //replace
    // preset: 'prose',
    find: findMe,
    // replace: function(portion, match) {
    //   return '[[' + portion.index + ']]';
    // }
    replace: word2,
    wrap: element
  });
  cb();
}


// For reference:
// element actions  http://www.w3schools.com/jsref/dom_obj_all.asp
// DOM manipulator  https://github.com/padolsey/findAndReplaceDOMText
// DOM article      http://james.padolsey.com/javascript/replacing-text-in-the-dom-solved/