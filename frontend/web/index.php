<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <base href="./" />

    <!-- Enlace a los archivos CSS -->
    <link rel="stylesheet" type="text/css" href="css/root.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/styles.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/keypad.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/header.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/main.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/footer.css?<?php echo rand(0,999);?>" />

    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon/favicon-16x16.png" />
    <link rel="mask-icon" href="img/favicon/apple-touch-icon.png" color="#ffffff" />
    <link rel="shortcut icon" href="img/favicon/favicon.ico" />

    <!-- Viewport and Apple stuff -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="theme-color" content="#8cc63f" />
    <meta name="description" content="Punto de venta Bitcoin Lightning Network de Clovr Labs." />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <link rel="apple-touch-icon" href="img/favicon/apple-touch-icon.png" />

    <link rel="manifest" href="manifest.json">

    <title>UMA Clovr PoS</title>
</head>

<body>
    <header>
        <div class="header-container">
            <div class="header-left">
                <img src="img/icons/logo.svg" alt="Clovr UMA Logo">
                <span>UMA Clovr PoS</span>
            </div>
            <nav class="header-right">
                <ul>
                    <li><a href="#operar">Operar</a></li>
                    <li><a href="#transacciones">Transacciones</a></li>
                    <li><a href="#ayuda">Ayuda</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <?php
    require("pages/keypad.php");
    ?>
    </main>
    <footer>
        <p>&copy; 2024 <em class="logo"></em> <b>UMA Clovr PoS</b>. Todos los derechos reservados.</p>
    </footer>
    <!-- Enlace al archivo JavaScript -->
    <script src="js/keypad.js?<?php echo rand(0,999);?>"></script>
    <script src="js/app.js?<?php echo rand(0,999);?>"></script>

    <script>
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registrado con éxito:', registration.scope);
                })
                .catch(error => {
                    console.log('Error al registrar el ServiceWorker:', error);
                });
        });
    }
    </script>

</body>

</html>