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
		} else {
			main.classList.add("no-scroll");
			footer.style.opacity = 0;
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

// Provisional mientras desarrollo...
function activarSeccionDesdeInicio() {
	// Obtener todos los elementos <li> del menú del pie de página
	const menuItems = document.querySelectorAll("#footer-menu li");

	// Iterar sobre cada elemento <li> para verificar si tiene la clase .active
	menuItems.forEach((item) => {
		if (item.classList.contains("active")) {
			// Obtener el valor del atributo data-template
			const template = item.getAttribute("data-template");

			// Buscar la sección cuyo id coincida con el valor de data-template
			const section = document.getElementById(template);

			// Si la sección existe, añadir la clase .active
			if (section) {
				section.classList.add("active");
			}
		}
	});
}

// Definir la función para deshabilitar las teclas de flecha
function disableArrowKeysExceptInTextInputs() {
	const disableArrowKeys = (event) => {
		const activeElement = document.activeElement;
		const isTextInput = activeElement.tagName === "INPUT" && activeElement.type === "text";

		// Verificar si la tecla presionada es una tecla de flecha y el elemento activo no es un campo de texto
		if (!isTextInput && (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight")) {
			event.preventDefault();
		}
	};

	// Agregar el event listener para keydown
	document.addEventListener("keydown", disableArrowKeys);
}