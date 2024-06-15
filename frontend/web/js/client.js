function showIdle() {
	const template = document.getElementById("idle");
	const capas = document.querySelectorAll("body > div");
	capas.forEach((capa) => {
		capa.style.display = "none";
	});

	template.style.display = "flex";
}

function showPayment(data) {
	const template = document.getElementById("payment");
	const capas = document.querySelectorAll("body > div");
	capas.forEach((capa) => {
		capa.style.display = "none";
	});

	template.style.display = "flex";

	const container = template.querySelector('.qr-code');
	container.innerHTML = "";

	console.log(data.paymentRequest.payment_request)
	console.log(container.offsetWidth, container.offsetHeight)

	const qrCode = new QRCodeStyling({
		width: container.offsetWidth,
		height: container.offsetHeight,
		data: data.paymentRequest.payment_request,
		type: "svg",
		imageOptions: {
			crossOrigin: "anonymous",
			margin: 0,
		},
		dotsOptions: {
			color: "#000000", // Color de los puntos del QR
		},
		backgroundOptions: {
			color: "rgba(0, 0, 0, 0)", // Color transparente para el fondo
		}
	});
	
	qrCode.append(container);

	
}

function showPayed() {
	const template = document.getElementById("payed");
	const capas = document.querySelectorAll("body > div");
	capas.forEach((capa) => {
		capa.style.display = "none";
	});

	template.style.display = "flex";

	setTimeout(() => {
		showIdle();
	}, 5000);
}

if (!!window.EventSource) {
	const source = new EventSource("https://192.168.88.135:3000/sse?clientId=comercio");
	source.onmessage = function (event) {
		console.log("Mensaje recibido:", event.data);
	};
} else {
	console.log("Navegador no soporte SSE");
}

document.addEventListener("DOMContentLoaded", (event) => {
	showIdle();

	if (!!window.EventSource) {
		const source = new EventSource("https://192.168.88.135:3000/sse?clientId=cliente");
		source.onmessage = function (event) {
			const data = JSON.parse(event.data);

			if (data.action === "payment") {
				console.log("Muestro payment");
				// Muestro mensaje con los datos de pago y genero el QR
				showPayment(data);
			} else if (data.action === "paid") {
				console.log("Muestro paid");
				// Muestro mensaje de que la operación ha sido pagada y cierro la ventana en 5 segundos.
				showPayed();
			} else if (data.action === "cancel") {
				console.log("Muestro Idle");
				// Reseteo datos y muestro idle
				showIdle();
			} else {
			}
		};
	} else {
		console.log("Navegador no soporte SSE");
	}
});
