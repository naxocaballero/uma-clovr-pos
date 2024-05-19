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
		if (value === "," || value === ".") {
			value = ".";
		}
		const newValue = display.value + value;
		if (isValidInput(newValue)) {
			display.value = newValue;
		}
	}

	function isValidInput(input) {
		const regex = /^\d{0,8}(\.\d{0,3})?$/;
		return regex.test(input);
	}
});
