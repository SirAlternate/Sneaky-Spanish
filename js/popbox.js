//popbox.js
//scripts handling the right click popup 

function addJ(className){ 
    console.log("adding J for: " + className);
    var elements = document.getElementsByClassName(className);
    for(var i=0; i<elements.length; i++){ 
      // add click event
      elements[i].onmousedown = function(event) {
        // console.log("quit it");

        if (event.which == 3) {  
          rightClick($( this ).attr( "EWord" ));
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

function getClicks(EWord, cb) {
  chrome.storage.sync.get(EWord, function(data) {
          cb(data[EWord]);
        });

}

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