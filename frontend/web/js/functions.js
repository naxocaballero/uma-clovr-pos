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

function getElementDimensions(element) {
	if (!element) {
		console.error("Elemento no encontrado");
		return null;
	}

	let wasHidden = false;
	const originalStyle = {};

	if (getComputedStyle(element).display === "none") {
		wasHidden = true;
		// Guardar los estilos originales
		originalStyle.position = element.style.position;
		originalStyle.visibility = element.style.visibility;
		originalStyle.display = element.style.display;

		// Aplicar estilos temporales
		element.style.position = "absolute";
		element.style.visibility = "hidden";
		element.style.display = "block";
	}

	// Obtener dimensiones
	const styles = getComputedStyle(element);
	const dimensions = {
		width: element.offsetWidth,
		height: element.offsetHeight,
		scrollHeight: element.scrollHeight,
		marginTop: parseFloat(styles.marginTop),
		marginBottom: parseFloat(styles.marginBottom),
		totalHeight: element.offsetHeight + parseFloat(styles.marginTop) + parseFloat(styles.marginBottom),
	};

	// Restaurar los estilos originales
	if (wasHidden) {
		element.style.position = originalStyle.position;
		element.style.visibility = originalStyle.visibility;
		element.style.display = originalStyle.display;
	}

	return dimensions;
}

function scrollToElement(item) {
	// Obtener la posición del elemento clicado en relación con la ventana y el contenedor <main>
	const itemRect = item.getBoundingClientRect();
	const main = document.querySelector("main");
	const header = document.querySelector("header");
	const footer = document.querySelector("footer");
	const actions = item.closest(".item").querySelector(".item-actions"); // Ajusta esto según la estructura de tu HTML

	const mainRect = main.getBoundingClientRect();
	const headerBottom = header.getBoundingClientRect().bottom;
	const footerTop = footer.getBoundingClientRect().top;

	// Calcular la altura adicional del contenido expandido
	const expandedHeight = actions ? actions.scrollHeight : 0;

	let scrollAmount = 0;

	//console.log("top: " + itemRect.top + "(" + headerBottom + ")", "bottom: " + itemRect.bottom + "(" + footerTop + ")", expandedHeight);

	if (item.closest(".item").classList.contains("active")) {
		if (itemRect.top < headerBottom + 16) {
			// Si el elemento está por encima del límite superior calculado
			scrollAmount = main.scrollTop + itemRect.top - (headerBottom + 16);
			main.scrollTo({
				top: scrollAmount,
				behavior: "smooth",
			});
			//console.log("itemRect.top < headerBottom + 8", headerBottom + 8, item.closest(".item").classList.contains("active"));
		} else if (itemRect.bottom > footerTop - 8) {
			// Si el elemento está por debajo del límite inferior calculado
			if (window.getComputedStyle(item.closest(".item").querySelector("video")).display === "none") {
				// Calcular la cantidad de desplazamiento
				scrollAmount = main.scrollTop + itemRect.bottom - footerTop + expandedHeight + 16;
				main.scrollTo({
					top: scrollAmount,
					behavior: "smooth",
				});
				//console.log("itemRect.bottom > footerTop - 8", footerTop - 8, "y abro video", window.getComputedStyle(item.closest(".item").querySelector("video")).display);
			} else {
				// Si el video está visible
				const viewportHeight = window.innerHeight;
				const itemCenter = itemRect.top + itemRect.height / 2;
				const offset = itemCenter - viewportHeight / 2;

				scrollAmount = main.scrollTop + offset;
				main.scrollTo({
					top: scrollAmount,
					behavior: "smooth",
				});
				//console.log("itemRect.bottom > footerTop - 8", footerTop - 8, "video visible", window.getComputedStyle(item.closest(".item").querySelector("video")).display);
			}
		} else if (itemRect.bottom > footerTop - expandedHeight - 16) {
			// Calcular la cantidad de desplazamiento
			scrollAmount = main.scrollTop + itemRect.bottom - footerTop + expandedHeight + 16;
			main.scrollTo({
				top: scrollAmount,
				behavior: "smooth",
			});
			//console.log("itemRect.bottom > footerTop - expandedHeight + 8", footerTop - expandedHeight, item.closest(".item").classList.contains("active"));
		} else {
			//console.log("item activo, pero no realizo scroll");
		}
	} else {
		if (itemRect.top < headerBottom + 8) {
			// Si el elemento está por encima del límite superior calculado
			scrollAmount = main.scrollTop + itemRect.top - (headerBottom + 8);
			main.scrollTo({
				top: scrollAmount,
				behavior: "smooth",
			});
			//console.log("1 => ", item.closest(".item").classList.contains("active"));
		}
	}
}

function getCompProp(element, property) {
	if (!(element instanceof HTMLElement)) {
		throw new Error("El primer parámetro debe ser un elemento del DOM.");
	}

	const computedStyle = window.getComputedStyle(element);
	return computedStyle.getPropertyValue(property);
}

function getTransactionsAPI(url) {
	const spinner = document.getElementById("spinner");
	const container = document.getElementById("transactions-container");

	container.style.transition = "none";
	container.style.opacity = 0;

	// Mostrar el spinner
	spinner.style.display = "block";

	// Llamada AJAX para obtener los datos desde PHP
	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			const newContent = generateRandomTransactions(data);

			// Próposito exclusivo para la demo, que pueda verse el loader en movimiento. Modificar el valor del timeout
			setTimeout(() => {
				// Ocultar el spinner
				spinner.style.display = "none";

				// Actualizar el contenido del contenedor con fade-in
				container.style.opacity = 0;
				container.innerHTML = newContent;
				container.style.transition = "opacity 1s";
				container.style.opacity = 1;

				// Añadir eventos a los nuevos elementos del DOM
				addEventListeners();

				// Compruebo el tamaño del nuevo main actualizado y decido si activar scroll o no
				mainScrollable();
			}, 1);
		})
		.catch((error) => console.error("Error al cargar los datos:", error));
}

function generateRandomTransactions(transactions) {
	let html = "";
	transactions.forEach((transaction) => {
		const { typeKey, status, typeName, idTx, title, date, amount } = transaction;

		let actions = "";
		switch (status) {
			case "confirmed":
				if (typeKey === "payment") {
					actions += `
                                <div class="action-info"></div>
                                    <div class="action-refund">
										<div class="refund-options">
											<span>Devolución</span>
											<div class="refund-options-buttons">
												<button class="paste-pr"><em></em></button>
												<button class="qr-pr"><em></em></button>
											</div>
                                        </div>
                            
                                        <div class="payment-request">
											Payment Request
											<span></span>
										</div>
                                        
                                        <div class="capture-container">
                                            <video class="video"></video>
											<button class="cancel-capture">Cancelar</button>
                                        </div>

										<div class="action-buttons">
                                            <button class="confirm-pay">Confirmar</button>
                                            <button class="cancel-pay">Cancelar</button>
                                        </div>

										

                                    </div>
                                </div>
                                `;
				} else if (typeKey === "refund") {
					actions += '<div class="action-info"></div>';
				}
				break;
			case "pending":
				if (typeKey === "payment") {
					actions += '<div class="action-info"></div>';
				} else if (typeKey === "refund") {
					actions += '<div class="action-info"></div>';
				}
				break;
			case "expired":
				actions += '<div class="action-info"></div>';
				break;
			default:
				break;
		}

		html += `
				<div class="item ${typeKey} ${status}">
					<div class="item-container">
						<div class="item-status"></div>
						<div class="item-info">
							<h3>${typeName} <span>${idTx}</span></h3>
							<span class="item-memo">${title}</span>
							<span class="item-date">${new Date(date * 1000).toLocaleDateString()}</span>
						</div>
						<div class="item-amount">${amount} €</div>
					</div>
					<div class="item-actions">
						${actions}
					</div>
				</div>
			`;
	});
	return html;
}
