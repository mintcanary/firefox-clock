'use strict';

(function() {
	let defaultFillColor = "#000000";

	if (window.matchMedia && !!window.matchMedia('(prefers-color-scheme: dark)').matches) {
		defaultFillColor = "#FFFFFF";
	}

	let fillColor = defaultFillColor;
	let timeFormat = 24;

	function draw(digits) {
		var canvas = document.createElement('canvas'); // Create the canvas
		canvas.width = 64;
		canvas.height = 64;
	  
		var context = canvas.getContext('2d');
	  
		context.fillStyle = fillColor;
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.font = "56px system-ui";
		context.fillText(digits, 32, 32);
	  
		browser.browserAction.setIcon({
		  imageData: context.getImageData(0, 0, 64, 64)
		});
	}

	function updateClock() {
		const date = new Date();
		const mm = date.getMinutes().toString().padStart(2, "0");
		let hour_value;

		if(timeFormat == 12) {
			hour_value = date.getHours() % 12 || 12;  // 12h instead of 24h
		} else {
			hour_value = date.getHours();
		}

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

	async function init() {
		const themeInfo = await browser.theme.getCurrent();
		const options = await browser.storage.sync.get();

		if (themeInfo.colors) {
			fillColor = themeInfo.colors.icons;
		}

		if(options.format) {
			timeFormat = options.format;
		}

		callback();
	}

	function handleTheme(updateInfo) {
		if (updateInfo.theme.colors) {
			fillColor = updateInfo.theme.colors.icons;
		} else {
			fillColor = defaultFillColor;
		}

		callback();
	}

	function handleOptions(updateInfo) {
		if(updateInfo.format) {
			timeFormat = updateInfo.format.newValue;
		}

		callback();
	}

	init();

	browser.theme.onUpdated.addListener(handleTheme);
	browser.storage.sync.onChanged.addListener(handleOptions);
})();
