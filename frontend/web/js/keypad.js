document.addEventListener("DOMContentLoaded", (event) => {
	const display = document.getElementById("display");
	const keys = document.querySelectorAll(".key");

	keys.forEach((key) => {
		key.addEventListener("click", () => {
			const value = key.textContent;
			if (value === "C") {
				display.value = "";
			} else {
				const newValue = display.value + value;
				if (isValidInput(newValue)) {
					display.value = newValue;
				}
			}
		});
	});

	function isValidInput(input) {
		const regex = /^\d{0,8}(\.\d{0,3})?$/;
		return regex.test(input);
	}
});
