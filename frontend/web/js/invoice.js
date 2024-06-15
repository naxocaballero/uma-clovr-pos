document.addEventListener("DOMContentLoaded", () => {
	const display = document.getElementById("display");
	const keypad = document.querySelector(".keypad");

	function isInvoiceSectionActive() {
		const invoiceSection = document.querySelector("section#invoice");
		return invoiceSection && invoiceSection.classList.contains("active");
	}

	keypad.addEventListener("click", (event) => {
		if (isInvoiceSectionActive()) {
			const key = event.target;
			if (key.classList.contains("key")) {
				const value = key.textContent;
				if (value === "Del") {
					display.textContent = "euros";
				} else {
					handleInput(value);
				}
				key.classList.add("active");
				requestAnimationFrame(() => key.classList.remove("active"));
				updatePlaceholder(display);
			}
		}
	});

	document.addEventListener("keydown", (event) => {
		if (isInvoiceSectionActive()) {
			const key = event.key;
			if (key === "Backspace" || key === "Delete" || key.toLowerCase() === "c") {
				display.textContent = "euros";
			} else if ((key >= "0" && key <= "9") || key === "." || key === ",") {
				handleInput(key);
			} else if (key === "Enter") {
				document.querySelector(".generate-button").click();
			}
			updatePlaceholder(display);
		}
	});

	document.querySelector(".generate-button").addEventListener("click", () => {
		const display = document.getElementById("display");
		let displayValue = display.textContent.trim();

		displayValue = displayValue.replace(/\./g, "").replace(/,/, ".");

		let amountEUR = parseFloat(displayValue);
		amountSATS = convertCurrency(amountEUR, "SATS", bitcoinRate);

		if (isNaN(amountEUR) || amountEUR <= 0) {
			console.error("El valor ingresado no es válido");
			return;
		}

		let invoiceData = {
			amount: parseInt(amountSATS),
			expiration: 100,
			memo: "Compra en tienda",
		};

		console.log(invoiceData);

		fetch("https://192.168.88.135:8080/invoices", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(invoiceData),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);

				// Seleccionamos los elementos
				const modal = document.getElementById("modal");
				modal.style.display = "flex";

				const h2 = modal.querySelector("h2");
				h2.innerText = "Payment Request";

				const eurContainer = modal.querySelector(".amountEUR");
				eurContainer.innerText = showAmountEUR(amountEUR);

				const satsContainer = modal.querySelector(".amountSATS");
				satsContainer.innerText = showAmountSATS(amountSATS);

				const countDown = modal.querySelector(".count-down .time");
				let countdownValue = invoiceData.expiration;
				countDown.innerText = countdownValue;

				const container = modal.querySelector("#qrcode");
				container.innerHTML = "";

				const qrCode = new QRCodeStyling({
					width: container.offsetWidth,
					height: container.offsetHeight,
					data: data.payment_request,
					type: "svg",
					imageOptions: {
						crossOrigin: "anonymous",
						margin: 0,
					},
				});
				qrCode.append(container);

				const resetQR = () => {
					countDown.innerText = "";
					container.innerHTML = "";
					clearInterval(countdownInterval);
				};

				const updateCountdown = () => {
					countdownValue -= 1;
					countDown.innerText = countdownValue;

					if (countdownValue <= 0) {
						clearInterval(countdownInterval);
						modal.style.display = "none";
					}
				};

				const qrCodeText = modal.querySelector("#qrcode-text");
				qrCodeText.innerHTML = truncatePR(data.payment_request, 30);

				// Iniciar la cuenta regresiva
				const countdownInterval = setInterval(updateCountdown, 1000);

				const closeQR = modal.querySelector(".close-qr");
				function handleCloseQR() {
					clearInterval(statusInterval);
					resetQR();
					modal.style.display = "none";
					qrResult.style.display = "none";

					h2.style.display = "block";
					eurContainer.style.display = "block";
					satsContainer.style.display = "block";
					countDown.style.display = "block";
					countDown.parentElement.style.display = "block";

					qrCodeText.style.display = "block";
					container.style.display = "block";
					closeQR.style.display = "block";

					// Cierro QR en cliente también
					let jsonData = {
						targetClientId: "cliente",
						action: "cancel"
					};

					fetch("https://192.168.88.135:3000/action", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(jsonData),
					})
						.then((response) => response.json())
						.then((data) => console.log("Response from server:", data))
						.catch((error) => console.error("Error:", error));

					// Eliminar el event listener después de usarlo
					closeQR.removeEventListener("click", handleCloseQR);
				}

				// Añade el event listener
				closeQR.addEventListener("click", handleCloseQR);

				const qrResult = modal.querySelector("#qrcode-result");

				const invoicePayed = () => {
					clearInterval(statusInterval);
					resetQR();
					h2.style.display = "none";
					eurContainer.style.display = "none";
					satsContainer.style.display = "none";
					countDown.style.display = "none";
					countDown.parentElement.style.display = "none";

					qrCodeText.style.display = "none";
					container.style.display = "none";

					qrResult.style.display = "block";

					// Cierro QR en cliente también
					let jsonData = {
						targetClientId: "cliente",
						action: "paid"
					};

					fetch("https://192.168.88.135:3000/action", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(jsonData),
					})
						.then((response) => response.json())
						.then((data) => console.log("Response from server:", data))
						.catch((error) => console.error("Error:", error));
				};

				let counter = 0;
				// Punto donde tengo que hacer polling cada 3 segundos revisando si la factura está pagada.
				const statusInterval = setInterval(async () => {
					let status = await checkInvoiceStatus(data.id);
					counter = counter + 1;
					if (status === "PAGADO") {
						invoicePayed();
					}
				}, 500);

				display.textContent = "euros";
				updatePlaceholder(display);

				//Envío los datos al puesto de cliente
				let jsonData = {
					targetClientId: "cliente",
					invoiceData: invoiceData,
					data: data,
					sats: showAmountSATS(amountSATS),
					euro: showAmountEUR(amountEUR),
					action: "payment"
				};

				fetch("https://192.168.88.135:3000/payment", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(jsonData),
				})
					.then((response) => response.json())
					.then((data) => console.log("Response from server:", data))
					.catch((error) => console.error("Error:", error));
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	});

	function updatePlaceholder(display) {
		if (display.textContent.trim() === "" || display.textContent.trim() === "euros") {
			display.classList.add("empty");
		} else {
			display.classList.remove("empty");
		}
	}

	function handleInput(value) {
		if (value === "." || value === ",") {
			value = ",";
		}

		let currentValue = display.textContent.trim().replace(/\./g, "");

		if (currentValue === "euros" || currentValue === "0") {
			currentValue = "";
		}

		if (currentValue === "0") {
			if (value === ",") {
				display.textContent = "0,";
			} else if (value >= "1" && value <= "9") {
				display.textContent = value;
			}
		} else {
			const newValue = currentValue + value;
			if (isValidInput(newValue)) {
				display.textContent = formatNumber(newValue);
			}
		}
	}

	updatePlaceholder(display);
});
