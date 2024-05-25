function isWebClip() {
	return window.navigator.standalone;
}

function isMainScrollable() {
	let main = document.querySelector("main");
	return main.scrollHeight > main.clientHeight;
}

function mainScrollable() {
	function measureScrollHeight() {
		return new Promise((resolve) => {
			requestAnimationFrame(() => {
				let main = document.querySelector("main");
				resolve({
					scrollHeight: main.scrollHeight,
					clientHeight: main.clientHeight,
				});
			});
		});
	}

	measureScrollHeight().then(({ scrollHeight, clientHeight }) => {
		let main = document.querySelector("main");
		let footer = document.querySelector("footer .fondo-footer-menu");

		console.log(scrollHeight + " > " + clientHeight);

		if (scrollHeight > clientHeight) {
			main.classList.remove("no-scroll");
			footer.style.opacity = 1;
			console.log("si");
		} else {
			main.classList.add("no-scroll");
			footer.style.opacity = 0;
			console.log("no");
		}
	});
}

function loadScript(url) {
	let script = document.createElement("script");
	script.type = "text/javascript";
	script.defer = true;

	if (script.readyState) {
		//IE
		script.onreadystatechange = function () {
			if (script.readyState == "loaded" || script.readyState == "complete") {
				script.onreadystatechange = null;
			}
		};
	} else {
		script.onload = function () {};
	}

	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

function unloadScript(url) {
	let scripts = document.getElementsByTagName("script");
	for (let i = scripts.length - 1; i >= 0; i--) {
		if (scripts[i].src.includes(url)) {
			scripts[i].parentNode.removeChild(scripts[i]);
		}
	}
}
