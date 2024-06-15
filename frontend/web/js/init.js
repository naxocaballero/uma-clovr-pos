const body = "body";
const head = "head";
const start = "start";
const end = "end";

function loadScript(url, parentElementSelector, position, callback) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	script.defer = true;
	script.onload = callback;

	var parentElement = document.querySelector(parentElementSelector);

	if (parentElement) {
		if (position === "start") {
			parentElement.insertBefore(script, parentElement.firstChild);
		} else {
			// Por defecto, añadir al final
			parentElement.appendChild(script);
		}
	} else {
		console.error('El elemento con el selector "' + parentElementSelector + '" no se encuentra.');
	}
}

function isPWA() {
	return window.matchMedia("(display-mode: standalone)").matches;
}

function isSafariIOS() {
	return /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent);
}

function isCordova() {
	return typeof window.cordova !== "undefined";
}

function detectEnvironment() {
	if (isPWA()) {
		// Código específico para PWA
		console.log("Estamos en una PWA.");

		loadScript("js/transaccionesPWA.js", body, end, function () {
			console.log("js/transaccionesPWA.js");
		});
	} else if (isSafariIOS()) {
		// Código específico para Safari iOS
		console.log("Estamos en Safari iOS.");

		loadScript("js/transaccionesPWA.js", body, end, function () {
			console.log("js/transaccionesPWA.js");
		});

		loadScript("js/imagePWA.js", body, end, function () {
			console.log("js/imagePWA.js");
		});
	} else {
		// Código para Cordova
		console.log("Estamos en otro entorno. Cargamos Cordova.");
		loadScript("js/cordova.js", head, start, function () {
			console.log("js/cordoba.js");

			loadScript("js/transaccionesCordova.js", body, end, function () {
				console.log("js/transaccionesCordova.js");
			});
		});
	}
}

detectEnvironment();
