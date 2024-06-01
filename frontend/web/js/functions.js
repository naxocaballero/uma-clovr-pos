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
	fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Error en la respuesta de la red");
			}
			return response.json(); // Convertir la respuesta a JSON
		})
		.then((data) => {
			const newContent = generateTransactionsList(data);

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

				// Obtener el campo de texto y los elementos de transacciones
				const buscarInput = document.getElementById("buscar");
				const transacciones = document.querySelectorAll("div.item");

				// Función para buscar y filtrar las transacciones
				function buscarTransacciones() {
					const textoBusqueda = buscarInput.value.toLowerCase();

					transacciones.forEach((transaccion) => {
						const rhash = transaccion.getAttribute("data-rhash").toLowerCase();

						if (rhash.startsWith(textoBusqueda)) {
							transaccion.style.display = ""; // Mostrar el elemento
						} else {
							transaccion.style.display = "none"; // Ocultar el elemento
						}
					});
				}

				// Añadir un event listener al campo de texto para detectar cada keydown
				buscarInput.addEventListener("keyup", buscarTransacciones);
			}, 0);
		})
		.catch((error) => console.error("Error al cargar los datos:", error));
}

function generateTransactionsList(transactions) {
	let html = "";
	transactions.forEach((transaction) => {
		let { refund_id, status, ID, memo, creation_date, amount, r_hash } = transaction;
		let typeName = "";

		if (refund_id === 0) {
			typeKey = "payment";
			typeName = "Venta";
		} else if (refund_id > 0) {
			typeKey = "refund";
			typeName = "Devolución";
		} else {
			typeKey = "";
			typeName = "Sin estado";
		}

		switch (status) {
			case "PAGADO":
				status = "confirmed";
				break;
			case "PENDIENTE":
				status = "pending";
				break;
			case "DEVUELTA":
				status = "refunded";
				break;
			default:
				break;
		}

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
			case "refunded":
				actions += '<div class="action-info"></div>';
				break;
			default:
				break;
		}

		html += `
				<div class="item ${typeKey} ${status}" data-id="${ID}" data-rhash="${r_hash}">
					<div class="item-container">
						<div class="item-status"></div>
						<div class="item-info">
							<h3>${typeName} <span>${ID}</span></h3>
							<span class="item-memo">${memo}</span>
							<span class="item-date">${convertirFecha(creation_date)}</span>
						</div>
						<div class="item-amount">${convertCurrency(amount, "EUR", bitcoinRate)} €<br><span>${showAmountSATS(amount)} s</span></div>
					</div>
					<div class="item-actions">
						${actions}
					</div>
				</div>
			`;
	});
	return html;
}

function setupMenuListeners() {
	const menuItems = document.querySelectorAll(".menu li");
	const sections = document.querySelectorAll("main section");

	menuItems.forEach((item) => {
		// Asegurarse de que el event listener solo se añade una vez
		if (!item.hasListener) {
			item.addEventListener("click", function () {
				const template = this.getAttribute("data-template");
				const contentSection = document.querySelector("main section#" + template); // Seleccionar el section correcto
				const transactions = document.querySelector("#transacciones .container");
				const buscarInput = document.getElementById('buscar');

				transactions.innerHTML = "";

				// Asegúrate de que todos los sections no estén activos
				sections.forEach((i) => i.classList.remove("active"));
				buscarInput.value = "";

				// Activa la sección seleccionada
				if (contentSection) {
					contentSection.classList.add("active");

					if (template === "transacciones") {
						//getTransactionsAPI("ajax/generateRandomTransactions.php");
						getTransactionsAPI("https://192.168.88.135:8080/transactions");
					}

					mainScrollable();
				}

				menuItems.forEach((i) => i.classList.remove("active"));
				this.classList.add("active");

				// En cada llamada compruebo si el contenido requiere scroll y actuo en consecuencia.
			});
			item.hasListener = true; // Marcamos el ítem para evitar agregar múltiples listeners
		}
	});
}

let bitcoinRate = 64000;

function convertCurrency(amount, targetCurrency, bitcoinRate) {
	const SATOSHIS_PER_BITCOIN = 100000000; // 1 BTC = 100,000,000 satoshis
	let result;

	if (targetCurrency === "EUR") {
		// Convertir de satoshis a euros
		result = (amount / SATOSHIS_PER_BITCOIN) * bitcoinRate;
		return result.toFixed(2); // Formatear a dos decimales
	} else if (targetCurrency === "SATS") {
		// Convertir de euros a satoshis
		result = (amount / bitcoinRate) * SATOSHIS_PER_BITCOIN;
		return result.toFixed(0); // Formatear a cero decimales
	} else {
		throw new Error("Moneda de destino no válida. Use 'EUR' o 'SATS'.");
	}
}

function truncatePR(str, maxLength) {
	// Verificar si el PR necesita ser truncado
	if (str.length <= maxLength) {
		return str;
	}

	// Calcular la longitud de la primera y segunda parte del PR truncado
	const halfLength = Math.floor((maxLength - 3) / 2);
	const firstPart = str.slice(0, halfLength);
	const secondPart = str.slice(-halfLength);

	// Retornar el PR truncado con '...'
	return `${firstPart} ... ${secondPart}`;
}

function convertirFecha(fechaISO) {
	// Crear un objeto Date a partir de la cadena ISO
	let fecha = new Date(fechaISO);

	// Obtener las partes de la fecha
	let dia = String(fecha.getDate()).padStart(2, "0");
	let mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses comienzan en 0
	let anio = fecha.getFullYear();
	let horas = String(fecha.getHours()).padStart(2, "0");
	let minutos = String(fecha.getMinutes()).padStart(2, "0");
	let segundos = String(fecha.getSeconds()).padStart(2, "0");

	// Formatear la fecha en el formato deseado
	return `${dia}-${mes}-${anio} ${horas}:${minutos}:${segundos}`;
}

async function checkInvoiceStatus(id) {
	try {
		let invoiceData = { id: id };

		const response = await fetch("https://192.168.88.135:8080/transaction", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(invoiceData),
		});

		if (!response.ok) {
			throw new Error("Error en la respuesta de la red");
		}

		const data = await response.json();
		return data.status; // Asegúrate de que 'status' sea la propiedad correcta
	} catch (error) {
		console.error("Error al verificar el estado de la factura:", error);
		return null;
	}
}

function isValidInput(input) {
	const regex = /^(?!0\d)(\d{0,5})(,\d{0,2})?$/;
	return regex.test(input);
}

function formatNumber(input) {
	const parts = input.split(",");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	return parts.join(",");
}

function showAmountEUR(input) {
	// Asegura que el input sea tratado como un número y conviértelo a una cadena con dos decimales
	let number = parseFloat(input).toFixed(2);

	// Divide la cadena en la parte entera y la parte decimal
	let parts = number.split(".");

	// Formatea la parte entera con puntos como separadores de miles
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

	// Une la parte entera y la parte decimal con una coma
	return parts.join(",");
}

function showAmountSATS(input) {
	// Asegura que el input sea tratado como un número y conviértelo a una cadena
	let number = parseFloat(input).toFixed(0).toString();

	// Formatea la parte entera con puntos como separadores de miles
	number = number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

	return number;
}

function extractLightningData(data) {
    data = data.toLowerCase();

    const regex = /(lnbcrt[a-z0-9]+)/;
    const match = data.match(regex);

    if (match && match[1]) {
        return match[1];
    }

    return '';
}