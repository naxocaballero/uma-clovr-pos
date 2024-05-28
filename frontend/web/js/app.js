document.addEventListener("DOMContentLoaded", (event) => {
	let header = document.querySelector("header");
	let main = document.querySelector("main");
	let footer = document.querySelector("footer .fondo-footer-menu");

	if (isWebClip()) {
		let footerMenu = document.querySelector("footer");
		if (footerMenu) {
			footerMenu.style.minHeight = "10vh";
		} else {
			console.log("El elemento footer .footer-menu no se encontró.");
		}
		main.classList.add("standalone");
	}

	main.addEventListener("scroll", function () {
		let scrollPosition = main.scrollTop;
		let mainHeight = main.scrollHeight;
		let containerHeight = main.clientHeight;

		//console.log(scrollPosition + ' ' + mainHeight + ' ' + containerHeight + ' == ' + (scrollPosition + containerHeight))

		if (scrollPosition > 10 && scrollPosition <= 30) {
			header.style.opacity = (scrollPosition - 10) / 15; // Cálculo de opacidad
		} else if (scrollPosition > 30) {
			header.style.opacity = 1; // Máxima opacidad
		} else {
			header.style.opacity = 0; // Restablece la opacidad
		}

		let diferencia = mainHeight - scrollPosition - containerHeight;

		//console.log(diferencia);

		if (diferencia > 10 && diferencia <= 30) {
			// Hago la transición
			footer.style.opacity = (diferencia - 10) / 15; // Cálculo de opacidad
		} else if (diferencia > 30) {
			// No hago nada
			footer.style.opacity = 1;
		} else {
			// Mantengo el cambio
			footer.style.opacity = 0;
		}
	});

	const menuItems = document.querySelectorAll(".menu li");
	const sections = document.querySelectorAll("main section");

	menuItems.forEach((item) => {
		item.addEventListener("click", function () {
			const template = this.getAttribute("data-template");
			const contentSection = document.querySelector("main section#" + template); // Seleccionar el section correcto
			const transactions = document.querySelector("#transacciones .container");

			transactions.innerHTML = "";

			// Asegúrate de que todos los sections no estén activos
			sections.forEach((i) => i.classList.remove("active"));

			// Activa la sección seleccionada
			if (contentSection) {
				contentSection.classList.add("active");

				if (template === "transacciones") {
					llamada("ajax/generateRandomTransactions.php");
				}

				mainScrollable();
			}

			menuItems.forEach((i) => i.classList.remove("active"));
			this.classList.add("active");

			// En cada llamada compruebo si el contenido requiere scroll y actuo en consecuencia.
		});
	});

	// Activa la sección visible al establecer un valor en el menú (próposito mientras desarrollo)
	activarSeccionDesdeInicio();

	// Comprueba si el contenido central es mayor que el viewport para permitir touch-action y overflow.
	mainScrollable();

	// Invocar la función deshabilitar teclas de flecha para evitar scroll indeseado por teclado.
	disableArrowKeysExceptInTextInputs();

	//observeClassChange(document.querySelector("section#transacciones"));
	llamada("ajax/generateRandomTransactions.php");
});