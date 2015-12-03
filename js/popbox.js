//popbox.js
//scripts handling the right click popup 

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