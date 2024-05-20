document.addEventListener("DOMContentLoaded", (event) => {
	const display = document.getElementById("display");
	const keys = document.querySelectorAll(".key");

	keys.forEach((key) => {
		key.addEventListener("click", () => {
			const value = key.textContent;
			if (value === "C") {
				display.value = "";
			} else {
				handleInput(value);
			}
			key.classList.add("active");
			setTimeout(() => {
				key.classList.remove("active");
			}, 10); // Remover la clase active después de 1 segundo
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
			display.value = "";
		} else if ((key >= "0" && key <= "9") || key === "." || key === ",") {
			handleInput(key);
		}
	});

	function handleInput(value) {
		if (value === "." || value === ",") {
			value = ",";
		}

		const currentValue = display.value.replace(/\./g, "");

		// Nueva lógica para manejar la entrada del 0 inicial
		if (currentValue === "0") {
			if (value === ",") {
				display.value = "0,";
			} else if (value >= "1" && value <= "9") {
				display.value = value;
			}
		} else {
			const newValue = currentValue + value;
			if (isValidInput(newValue)) {
				display.value = formatNumber(newValue);
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
});
