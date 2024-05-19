<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <base href="./" />

    <!-- Enlace a los archivos CSS -->
    <link rel="stylesheet" type="text/css" href="css/root.css" />
    <link rel="stylesheet" type="text/css" href="css/main.css" />
    <link rel="stylesheet" type="text/css" href="css/keypad.css?<?php echo rand(0,999);?>" />

    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon/favicon-16x16.png" />
    <link rel="mask-icon" href="img/favicon/apple-touch-icon.png" color="#ffffff" />
    <link rel="shortcut icon" href="img/favicon/favicon.ico" />

    <!-- Viewport and Apple stuff -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#7b1af7" />
    <meta name="description" content="Punto de venta Bitcoin Lightning Network de Clovr Labs." />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <link rel="apple-touch-icon" href="img/favicon/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Clovr PoS">
    <meta name="application-name" content="Clovr PoS">
    <meta name="msapplication-TileColor" content="#ffffff" />

    <title>Clovr PoS</title>
</head>

<body>
    <main>
        <?php
        require('pages/keypad.php');
        ?>
    </main>

    <!-- Enlace al archivo JavaScript -->
    <script src="js/keypad.js?<?php echo rand(0,999);?>"></script>
</body>

</html>