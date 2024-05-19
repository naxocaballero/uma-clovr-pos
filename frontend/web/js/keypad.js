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
			}, 500);
		});

		key.addEventListener("touchstart", () => {
			key.classList.add("active");
		});

		key.addEventListener("touchend", () => {
			setTimeout(() => {
				key.classList.remove("active");
			}, 500);
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
		const currentValue = display.value.replace(/\./g, ''); // Remove existing dots for easier processing
		const newValue = currentValue + value;

		if (isValidInput(newValue)) {
			display.value = formatNumber(newValue);
		}
	}

	function isValidInput(input) {
		// No leading zeros unless the number is zero or starts with 0, and then a decimal
		const regex = /^(?!0\d)(\d{0,8})(,\d{0,3})?$/;
		return regex.test(input);
	}

	function formatNumber(input) {
		const parts = input.split(",");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		return parts.join(",");
	}
});
