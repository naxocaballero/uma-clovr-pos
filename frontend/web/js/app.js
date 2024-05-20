function ajax(options) {
    var xhr = new XMLHttpRequest();
    
    // Configura el método y la URL
    xhr.open(options.method || 'GET', options.url, true);

    // Configura las cabeceras
    if (options.headers) {
        for (var key in options.headers) {
            if (options.headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, options.headers[key]);
            }
        }
    }

    // Configura la respuesta en formato JSON si se requiere
    xhr.responseType = options.responseType || 'json';

    // Configura el manejador de eventos para la respuesta
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            if (options.success) {
                options.success(xhr.response);
            }
        } else {
            if (options.error) {
                options.error(xhr.statusText);
            }
        }
    };

    // Configura el manejador de eventos para errores
    xhr.onerror = function() {
        if (options.error) {
            options.error(xhr.statusText);
        }
    };

    // Envía la solicitud con datos si se proporcionan
    if (options.method === 'POST' || options.method === 'PUT') {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify(options.data));
    } else {
        xhr.send();
    }
}
