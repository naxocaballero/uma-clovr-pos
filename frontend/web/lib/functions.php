<?php

// Extrae el SVG del archivo .svg para añadirlo al DOM y poder utilizar css en él para modificar su color.
function mostrarSVG($filePath) {
    if (file_exists($filePath)) {
        return file_get_contents($filePath);
    } else {
        return 'Error: SVG file not found.';
    }
}

function convertirPNGABase64($rutaArchivo) {
    // Verificar si el archivo existe
    if (!file_exists($rutaArchivo)) {
        return "El archivo no existe.";
    }

    // Obtener el contenido del archivo
    $contenidoArchivo = file_get_contents($rutaArchivo);

    // Codificar el contenido en base64
    $base64 = base64_encode($contenidoArchivo);

    return "data:image/png;base64,".$base64;
}

?>