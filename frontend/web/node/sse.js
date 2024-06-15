const https = require("https");
const fs = require("fs");
const url = require("url");

// Rutas a los archivos de certificado SSL
const options = {
	key: fs.readFileSync("server.key"),
	cert: fs.readFileSync("server.crt"),
};

const clients = {};

const server = https.createServer(options, (req, res) => {
	const queryObject = url.parse(req.url, true).query;

	// Manejo de solicitudes preflight (OPTIONS)
	if (req.method === "OPTIONS") {
		res.writeHead(204, {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, GET, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
			"Access-Control-Max-Age": 86400,
		});
		res.end();
		return;
	}

	if (req.url.startsWith("/sse")) {
		res.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
			"Access-Control-Allow-Origin": "*", // Permite peticiones de cualquier origen
		});

		const clientId = queryObject.clientId;
		clients[clientId] = res;

		console.log(`Client connected: ${clientId}`);

		req.on("close", () => {
			console.log(`Client disconnected: ${clientId}`);
			delete clients[clientId];
		});
	} else if (req.url.startsWith("/payment") && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});
		req.on("end", () => {
			try {
				const jsonData = JSON.parse(body);
				const targetClientId = jsonData.targetClientId;
				const invoiceData = jsonData.invoiceData; //es json
				const paymentRequest = jsonData.data; //es json
                const euro = jsonData.euro; 
                const sats = jsonData.sats; 
                const action = jsonData.action; 

				if (clients[targetClientId]) {
					const message = {
						invoiceData: invoiceData,
						paymentRequest: paymentRequest,
                        euro: euro,
                        sats: sats,
                        action: action
					};

					clients[targetClientId].write(`data: ${JSON.stringify(message)}\n\n`);
					res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
					res.end(JSON.stringify({ status: "message sent" }));
				} else {
					res.writeHead(404, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
					res.end(JSON.stringify({ status: "client not found" }));
				}
			} catch (error) {
				res.writeHead(400, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
				res.end(JSON.stringify({ status: "invalid JSON" }));
			}
		});
	} else if (req.url.startsWith("/action") && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});
		req.on("end", () => {
			try {
				const jsonData = JSON.parse(body);
				const targetClientId = jsonData.targetClientId;
				
                const message = {
                    action: jsonData.action
                } 

				if (clients[targetClientId]) {
					clients[targetClientId].write(`data: ${JSON.stringify(message)}\n\n`);
					res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
					res.end(JSON.stringify({ status: "message sent" }));
				} else {
					res.writeHead(404, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
					res.end(JSON.stringify({ status: "client not found" }));
				}
			} catch (error) {
				res.writeHead(400, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
				res.end(JSON.stringify({ status: "invalid JSON" }));
			}
		});
	} else {
		res.writeHead(404, {
			"Access-Control-Allow-Origin": "*",
		});
		res.end();
	}
});

server.listen(3000, "192.168.88.135", () => {
	console.log("Server running on https://192.168.88.135:3000");
});
