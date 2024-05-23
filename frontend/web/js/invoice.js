function updatePlaceholder(display) {
	if (display.textContent.trim() === "" || display.textContent.trim() === "satoshis") {
		display.classList.add("empty");
	} else {
		display.classList.remove("empty");
	}
}

const display = document.getElementById("display");
const keys = document.querySelectorAll(".key");

keys.forEach((key) => {
	key.addEventListener("click", () => {

		const value = key.textContent;
		if (value === "Del") {
			display.textContent = "satoshis";
		} else {
			handleInput(value);
		}
		key.classList.add("active");
		setTimeout(() => {
			key.classList.remove("active");
		}, 10); // Remover la clase active después de 1 segundo
		updatePlaceholder(display);
	});

	key.addEventListener("touchstart", () => {
		key.classList.add("active");
	});

	key.addEventListener("touchend", () => {
		key.classList.remove("active");
	});

	key.addEventListener("touchcancel", () => {
		key.classList.remove("active");
	});
});

document.addEventListener("keydown", (event) => {
	const key = event.key;
	if (key === "Backspace" || key === "Delete" || key.toLowerCase() === "c") {
		display.textContent = "satoshis";
	} else if ((key >= "0" && key <= "9") || key === "." || key === ",") {
		handleInput(key);
	} else if (key === "Enter") {
		document.querySelector(".generate-button").click();
	}
	updatePlaceholder(display);
});

function handleInput(value) {
	if (value === "." || value === ",") {
		value = ",";
	}

	let currentValue = display.textContent.trim().replace(/\./g, "");

	// Nueva lógica para manejar la entrada del 0 inicial
	if (currentValue === "satoshis" || currentValue === "0") {
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
	// No ceros a la izquierda a menos que el número sea cero o empiece con 0 y luego un decimal
	const regex = /^(?!0\d)(\d{0,8})(,\d{0,3})?$/;
	return regex.test(input);
}

function formatNumber(input) {
	const parts = input.split(",");
	// Añadir puntos cada tres dígitos
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	return parts.join(",");
}
// Actualiza el placeholder en la carga inicial
updatePlaceholder(display);

document.querySelector(".generate-button").addEventListener("click", function () {
	const display = document.getElementById("display");
	let displayValue = display.textContent.trim();

	// Remover puntos como separadores de miles y reemplazar la coma por un punto
	displayValue = displayValue.replace(/\./g, "").replace(/,/, ".");

	let amount = parseFloat(displayValue);

	if (isNaN(amount) || amount <= 0) {
		console.error("El valor ingresado no es válido");
		return;
	}

	let invoiceData = {
		method: "createInvoice",
		payload: {
			amount: amount,
			expiration: 900, // Ejemplo de expiración en segundos (15 minutos)
			memo: "Pago de prueba", // Ejemplo de memo
		},
	};

	console.log(invoiceData);
	alert(JSON.stringify(invoiceData, null, 2));

	display.textContent = "satoshis";
	updatePlaceholder(display);

	/*
    ajax({
        method: 'POST',
        url: 'http://localhost:8080/generate-invoice', // URL de tu API en Golang
        data: invoiceData,
        timeout: 5000, // Tiempo de espera en milisegundos
        success: function(response) {
            console.log('Success:', response);
            document.getElementById('display').textContent = response.invoice; // Asume que el JSON de respuesta tiene un campo 'invoice'
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
    */
});
