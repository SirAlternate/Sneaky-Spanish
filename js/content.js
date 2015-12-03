//content.js
//MAIN
//controls translation and replacement of words

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

    // FROM FILEUTIL.JS
    getDictionary(function(responseData){

      dic = Object.keys(responseData);
        var count = dic.length;

        for (var i = count-1; i >= 0; i--) {  //loop thru dictionary and handle
          handle(dic[i], responseData, function(){
            // console.log("\tcount: " + i);
            if(i == 0){
              // FROM POPBOX.JS
              addJ("sneakyWord"); // add functionality to new elements once done
            }
          });
        }

      });
  }
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
  console.log(dic[Eword].clicks);
  cb(dic[Eword].def);
}

// Function for replacing given words (word1 is the word to be replaced)
function replaceWord(word1, word2, cb) {
  // console.log("replacingg: " + word1);            //!//start replacing

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