document.addEventListener("DOMContentLoaded", (event) => {
	
	let header = document.querySelector("header");
	let main = document.querySelector("main");
	let footer = document.querySelector("footer .fondo-footer-menu");

	if (!isWebClip()) {
		let footerMenu = document.querySelector("footer");

		if (footerMenu) {
			footerMenu.style.minHeight = "8vh";
		} else {
			console.log("El elemento footer .footer-menu no se encontró.");
		}
	} else {
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

		console.log(diferencia);

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

	function changeColor(className, element) {
		const containers = document.querySelectorAll("#footer-menu em." + element);
		containers.forEach((container) => {
			const svgElement = container.querySelector("svg");
			if (svgElement) {
				svgElement.setAttribute("class", className);
			}
		});
	}

	const menuItems = document.querySelectorAll(".menu li");
	const sections = document.querySelectorAll("main section");

	menuItems.forEach((item) => {
		item.addEventListener("click", function () {
			const template = this.getAttribute("data-template");
			const contentSection = document.querySelector("main section#" + template); // Seleccionar el section correcto

			// Asegúrate de que todos los sections no estén activos
			sections.forEach((i) => i.classList.remove("active"));

			// Activa la sección seleccionada
			if (contentSection) {
				contentSection.classList.add("active");
				mainScrollable();
			}

			menuItems.forEach((i) => i.classList.remove("active"));
			this.classList.add("active");

			// En cada llamada compruebo si el contenido requiere scroll y actuo en consecuencia.
		});
	});

	if (isMainScrollable()) {
		// Se puede hacer scroll.
		console.log("se puede hacer scroll");
	} else {
		// No se puede hacer scroll. Presento los elementos estáticos y bloqueo el comportamiento de scroll.
		//main.style.touchAction = "none";
		console.log("no se puede hacer scroll");
	}

	mainScrollable();

	// Hacer clic en el primer botón "invoice"
	//document.querySelector('#footer-menu li[data-template="invoice"]').click();
});
