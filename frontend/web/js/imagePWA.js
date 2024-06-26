function iosImagePWA(t, e = "white") {
	if ("string" != typeof t || 0 === t.length) throw Error("Invalid icon URL provided");
	let i = screen.width,
		a = screen.height,
		h = window.devicePixelRatio || 1,
		n = document.createElement("canvas"),
		l = document.createElement("canvas"),
		r = n.getContext("2d"),
		d = l.getContext("2d"),
		o = new Image();
	(o.onerror = function () {
		throw Error("Failed to load icon image");
	}),
		(o.src = t),
		(o.onload = function () {
			let t = o.width / (3 / h),
				g = o.height / (3 / h);
			(n.width = i * h), (l.height = n.width), (n.height = a * h), (l.width = n.height), (r.fillStyle = e), (d.fillStyle = e), r.fillRect(0, 0, n.width, n.height), d.fillRect(0, 0, l.width, l.height);
			let c = (n.width - t) / 2,
				p = (n.height - g) / 2,
				s = (l.width - t) / 2,
				w = (l.height - g) / 2;
			r.drawImage(o, c, p, t, g), d.drawImage(o, s, w, t, g);
			let m = n.toDataURL("image/png"),
				u = l.toDataURL("image/png"),
				f = document.createElement("link");
			f.setAttribute("rel", "apple-touch-startup-image"), f.setAttribute("media", "screen and (orientation: portrait)"), f.setAttribute("href", m), document.head.appendChild(f);
			let A = document.createElement("link");
			A.setAttribute("rel", "apple-touch-startup-image"), A.setAttribute("media", "screen and (orientation: landscape)"), A.setAttribute("href", u), document.head.appendChild(A);
		});
}

function initializeSplashScreen() {
	iosImagePWA("img/icons/logo-splash.png", "#7f47dd");
	console.log("Genero splash screen para PWA.");
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeSplashScreen);
} else {
	initializeSplashScreen();
}
