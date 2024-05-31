document.addEventListener("DOMContentLoaded", () => {
	const display = document.getElementById("display");
	const keypad = document.querySelector(".keypad");

	keypad.addEventListener("click", (event) => {
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
	});

	document.addEventListener("keydown", (event) => {
		const key = event.key;
		if (key === "Backspace" || key === "Delete" || key.toLowerCase() === "c") {
			display.textContent = "euros";
		} else if ((key >= "0" && key <= "9") || key === "." || key === ",") {
			handleInput(key);
		} else if (key === "Enter") {
			document.querySelector(".generate-button").click();
		}
		updatePlaceholder(display);
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
			amount: amountSATS,
			expiration: 60,
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

				const eurContainer = modal.querySelector(".amountEUR");
				eurContainer.innerText = showAmountEUR(amountEUR);

                const satsContainer = modal.querySelector(".amountSATS");
				satsContainer.innerText = showAmountSATS(amountSATS);

				const countDown = modal.querySelector(".count-down .time");
				let countdownValue = invoiceData.expiration;
				countDown.innerText = countdownValue;

				const container = modal.querySelector("#qrcode");
				container.innerHTML = ""; // Limpiar el contenedor antes de generar un nuevo QR

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
				closeQR.addEventListener("click", () => {
					modal.style.display = "none";
					resetQR();
				});

				// Punto donde tengo que hacer polling cada 3 segundos revisando si la factura está pagada.
			})
			.catch((error) => {
				console.error("Error:", error);
			});

		display.textContent = "euros";
		updatePlaceholder(display);
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

	updatePlaceholder(display);
});
