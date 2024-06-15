window.addEventListener("load", function () {
	if(isCordova()){
		stopCameraPreview();
	}
});

document.addEventListener("DOMContentLoaded", (event) => {
	let header = document.querySelector("header");
	let main = document.querySelector("main");
	let footer = document.querySelector("footer .fondo-footer-menu");

	if (isPWA() || isCordova()) {
		main.classList.add("standalone");
		console.log('main.classList.add("standalone"); //');
	} else if (isSafariIOS()) {
		console.log("isSafari()");
		let footerMenu = document.querySelector("footer");
		if (footerMenu) {
			footerMenu.style.minHeight = "8vh";
		} else {
			console.log("El elemento footer .footer-menu no se encontró.");
		}
	} else {
		main.classList.add("standalone");
		console.log('main.classList.add("standalone");');
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

	// Activa la sección visible al establecer un valor en el menú (próposito mientras desarrollo)
	activarSeccionDesdeInicio();

	// Comprueba si el contenido central es mayor que el viewport para permitir touch-action y overflow.
	mainScrollable();

	// Invocar la función deshabilitar teclas de flecha para evitar scroll indeseado por teclado.
	disableArrowKeysExceptInTextInputs();

	//observeClassChange(document.querySelector("section#transacciones"));
	//getTransactionsAPI("ajax/generateRandomTransactions.php");
	//getTransactionsAPI("https://192.168.88.135:8080/transactions");

	setupMenuListeners();
});
