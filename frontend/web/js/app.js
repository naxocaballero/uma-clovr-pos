function ajax(options) {
    var xhr = new XMLHttpRequest();
    
    xhr.open(options.method || 'POST', options.url, true);

    // Configurar las cabeceras
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    // Configurar tipo de respuesta
    xhr.responseType = 'json';

    // Manejar la respuesta
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

    // Manejar errores
    xhr.onerror = function() {
        if (options.error) {
            options.error(xhr.statusText);
        }
    };

    // Configurar tiempo de espera
    if (options.timeout) {
        xhr.timeout = options.timeout;
        xhr.ontimeout = function() {
            if (options.error) {
                options.error('Request timed out');
            }
        };
    }

    // Enviar la solicitud con datos JSON
    xhr.send(JSON.stringify(options.data));
}