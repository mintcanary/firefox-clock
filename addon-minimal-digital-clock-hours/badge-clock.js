'use strict';

(function() {
	function draw(digits) {
		var canvas = document.createElement('canvas'); // Create the canvas
		canvas.width = 64;
		canvas.height = 64;
	  
		var context = canvas.getContext('2d');
	  
		if (window.matchMedia && !!window.matchMedia('(prefers-color-scheme: dark)').matches) {
			context.fillStyle = "#FFFFFF";
		} else {
			context.fillStyle = "#000000";
		}

		context.textAlign = "center";
		context.textBaseline = "middle";
		context.font = "64px Trebuchet MS";
		context.fillText(digits, 32, 32);
	  
		browser.browserAction.setIcon({
		  imageData: context.getImageData(0, 0, 64, 64)
		});
	  }

	function updateClock() {
		const date = new Date();
		const mm = date.getMinutes().toString().padStart(2, "0");
		let hour_value = date.getHours();

		const hh = hour_value.toString().padStart(2, "0");

		draw(hh);
		browser.browserAction.setTitle({title:date.toLocaleDateString()});
	}

	function getNextTimeout() {
		const now = Date.now();
		const min1 = (60 * 1000);
		const next = ((now + (min1 - 1)) / min1) | 0;
		return ((next * min1) - now) + 500; // add delay 0.5 s
	};

	function callback() {
		updateClock();
		setTimeout(callback, getNextTimeout());
	};

	callback();
})();
