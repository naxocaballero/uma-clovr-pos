<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">

    <!-- Enlace a los archivos CSS -->
    <link rel="stylesheet" type="text/css" href="css/client.css?<?php echo rand(0,999);?>" />

    <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon/favicon-16x16.png" />
    <link rel="mask-icon" href="/apple-touch-icon.png" color="#ffffff" />
    <link rel="shortcut icon" href="/img/favicon/favicon.ico" />

    <meta name="description" content="Cliente de Punto de venta Bitcoin Lightning Network de Clovr Labs." />

    <!-- Viewport and Apple stuff -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-title" content="PoS Client">

    <!-- Archivo de manifiesto para PWA -->
    <link rel="manifest" href="manifest_client.json">

    <!-- Metaetiquetas específicas para iOS -->
    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="120x120" href="img/favicon/ios/120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="img/favicon/ios/144.png">
    <link rel="apple-touch-icon" sizes="167x167" href="img/favicon/ios/167.png">
    <link rel="apple-touch-icon" sizes="180x180" href="img/favicon/ios/180.png">
    <link rel="apple-touch-icon" sizes="192x192" href="img/favicon/ios/192.png">
    <link rel="apple-touch-icon" sizes="256x256" href="img/favicon/ios/256.png">
    <link rel="apple-touch-icon" sizes="512x512" href="img/favicon/ios/512.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="theme-color" content="#8cc63f">



    <title>PoS Client</title>

    <script src="js/qr-code-styling.js" defer=""></script>
</head>

<body>

    <div id="idle">
        <div class="token-uma-clovr"></div>
    </div>

    <div id="payment">
        <div class="qr-code"></div>
    </div>

    <div id="payed">
        <div class="payed-message">PAGADO</div>
    </div>


    <script src="js/client.js" type="text/javascript" defer=""></script>

</body>

</html>