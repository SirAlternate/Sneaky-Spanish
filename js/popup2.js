// popup2.js

document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
	chrome.storage.local.get(null,function(data) {
		console.log(data);
		var clickCount = 0;
		for (var prop in data) {
			clickCount += data[prop];
		  console.log("obj." + prop + " = " + data[prop]);
		}
		console.log(clickCount);
		$('#uniqueCount').html(Object.keys(data).length);
		$('#clickCount').html(clickCount);
		
	});
}

