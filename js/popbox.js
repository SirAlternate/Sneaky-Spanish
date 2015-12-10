//popbox.js
//scripts handling the right click popup 

function addJ(className){ 
    console.log("adding J for: " + className);
    var elements = document.getElementsByClassName(className);
  
    for(var i=0; i<elements.length; i++){ 
      // add click event
      elements[i].onmousedown = function(event) {
        if (event.which == 3) { 
          rightClick($( this ).attr( "EWord" ));
          // hide already-toggled popovers
          $('.sneakyWord').popover('hide');
          // populate and toggle popover
          togglePopover(this);
        }
      }
      
      // get rid of stupid menu thing
      elements[i].setAttribute("onContextMenu","return false;");
    }
}

// function getClicks(EWord, cb) {
//   chrome.storage.sync.get(EWord, function(data) {
//           cb(data[EWord]);
//         });

// }

function rightClick(EWord) {
  chrome.storage.local.get(EWord, function(data) {
    // Notify that we saved.
    if(Object.keys(data).length > 0){
      console.log("already clicked: " + data[EWord]);

      chrome.storage.local.remove(EWord, function(){
        var dataObj = {};
        dataObj[EWord] = data[EWord] + 1;    
      chrome.storage.local.set(dataObj, function() {
        // Notify that we saved.
        console.log('Settings saved for EWord: ' + EWord);
        return;
      });
      });
    } else {
      console.log("first time.");
      var dataObj = {};
      dataObj[EWord] = 1;
      chrome.storage.local.set(dataObj, function() {
            // Notify that we saved.
          console.log('Settings saved for EWord: ' + EWord);
      });
      // chrome.storage.local.get(EWord, function(data) {
      //         // Notify that we saved.
      //     console.log(data);
      //     console.log(Object.keys(data).length);
      // });
    }
  });
  // chrome.storage.local.get(EWord, function(data) {
  //         console.log(EWord + " in local: " + data);
  //         // console.log(Object.keys(data).length);

  //         if(Object.keys(data).length == 0) { //first click
  //           console.log(EWord + " clicked for the first time");
  //           chrome.storage.sync.set({EWord: 1}, function() {
  //                 console.log("wrote");
  //               });            
  //         }
  //         else {
  //           console.log(EWord + " clicked " + data[EWord] + " times.");
  //           chrome.storage.sync.set({EWord: data[EWord]+1}, function() {
  //                 console.log("wrote");
  //               }); 
  //           // cb(data[EWord]);
  //         }
  //       });
}

function togglePopover(element, callback) {
  // GET ENGLISH AND SPANISH WORDS
  SWord = capitalize($(element).attr('SWord'));
  EWord = capitalize($(element).attr('EWord'));
  
  // GET CLICK COUNT
  chrome.storage.local.get(EWord.toLowerCase(), function(data) {
    if (data[EWord.toLowerCase()] > 0) {
      clicks = data[EWord.toLowerCase()] + 1;
    } else {
      clicks = 1;
    }
  });
  
  word = SWord.toLowerCase();
  
  $.ajax({
    type: 'GET',
    url: get_dic(word, 'spanish', '2edb344b-96bd-4311-9018-2638afc4c0fd'),
    dataType: 'xml',
    success: function(data) {      
      // GET ENTRY
      entry = data.getElementById(removeDiacritics(word));
      if(entry == null) {
        entry = data.getElementById(removeDiacritics(word) + '[1]');
      }

      // GET WORD TYPE
      try {
        wordType = entry.getElementsByTagName('fl')[0].innerHTML;
      } catch(e) {
        wordType = 'err';
      }

      
      // GET EXAMPLE
      try {
        examples = entry.getElementsByTagName('example');
        if (examples.length > 1) {
          ex = examples[examples.length - 2].innerHTML;
        } else {
          ex = examples[0].innerHTML;
        }
        example = capitalize(ex); 
      } catch(e) {
        example = 'Unable to locate';
      }

      // GET SOUND FILE
      try {
        soundFile = entry.getElementsByTagName('sound')[0].innerHTML;
        audioURL = 'http://media.merriam-webster.com/audio/prons/es/me/mp3/' + soundFile.charAt(0) + '/' + soundFile.split(".")[0] + '.mp3'; 
      } catch(e) {
        audioURL = '';
      }

      // SET POPOVER TITLE
      $(element).attr('data-title', SWord + ' (' + wordType + ')');

      // SET POPOVER CONTENT
      content = "";
      if (audioURL != '') {
        content += '<a class="listen" style="background-image:url(&quot;' + chrome.extension.getURL("icons/listen.png") + '&quot;)" onclick="(new Audio(&quot;' + audioURL + '&quot;)).play()"></a>'; 
      }
      content += '<b>Translation:</b> ' + EWord;
      content += '<br><b>Ex: </b>' + example;
      content += '<br><hr><p style="text-align:center; font-size:12px;">You have clicked this word ' + clicks + ' times.</p>';
      $(element).attr('data-content', content);

      // TOGGLE POPOVER
      $(element).popover('toggle');
    }
  });
}

// returns dictionary url for parsing
function get_dic(word, dic, key) {
  xmlSource = "http://www.dictionaryapi.com/api/v1/references/" + dic + "/xml/" + removeDiacritics(word) + "?key=" + key
    
  yqlURL = [
    "https://query.yahooapis.com/v1/public/yql",
    "?q=" + encodeURIComponent("select * from xml where url='" + xmlSource + "'"),
    "&format=xml"
  ].join("");
    
  console.log('got dictionary: ' + xmlSource);
  return yqlURL;
}

// removes diacritics from a given string (needed for parsing)
function removeDiacritics(str) {
  var diacritics = [
        [/[\300-\306]/g, 'A'],
        [/[\340-\346]/g, 'a'],
        [/[\310-\313]/g, 'E'],
        [/[\350-\353]/g, 'e'],
        [/[\314-\317]/g, 'I'],
        [/[\354-\357]/g, 'i'],
        [/[\322-\330]/g, 'O'],
        [/[\362-\370]/g, 'o'],
        [/[\331-\334]/g, 'U'],
        [/[\371-\374]/g, 'u'],
        [/[\321]/g, 'N'],
        [/[\361]/g, 'n'],
        [/[\307]/g, 'C'],
        [/[\347]/g, 'c'],
    ];
    var s = str;
    for (var i = 0; i < diacritics.length; i++) {
        s = s.replace(diacritics[i][0], diacritics[i][1]);
    }
    return s;
}