<!DOCTYPE html>
<?php
require("lib/functions.php");
?>
<html lang="es">

<head>
    <meta charset="UTF-8">

    <!-- Enlace a los archivos CSS -->
    <link rel="stylesheet" type="text/css" href="css/styles.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/header.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/main.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/footer.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/invoice.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/transacciones.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/ajustes.css?<?php echo rand(0,999);?>" />

    <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon/favicon-16x16.png" />
    <link rel="mask-icon" href="/apple-touch-icon.png" color="#ffffff" />
    <link rel="shortcut icon" href="/img/favicon/favicon.ico" />

    <meta name="description" content="Punto de venta Bitcoin Lightning Network de Clovr Labs." />

    <!-- Viewport and Apple stuff -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-title" content="UMA Clovr PoS">

    <!-- Archivo de manifiesto para PWA -->
    <link rel="manifest" href="manifest.json">

    <!-- Metaetiquetas específicas para iOS -->
    <link rel="apple-touch-icon" href="https://192.168.88.135/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="120x120" href="https://192.168.88.135/img/favicon/ios/120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="https://192.168.88.135/img/favicon/ios/144.png">
    <link rel="apple-touch-icon" sizes="167x167" href="https://192.168.88.135/img/favicon/ios/167.png">
    <link rel="apple-touch-icon" sizes="180x180" href="https://192.168.88.135/img/favicon/ios/180.png">
    <link rel="apple-touch-icon" sizes="192x192" href="https://192.168.88.135/img/favicon/ios/192.png">
    <link rel="apple-touch-icon" sizes="256x256" href="https://192.168.88.135/img/favicon/ios/256.png">
    <link rel="apple-touch-icon" sizes="512x512" href="https://192.168.88.135/img/favicon/ios/512.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="theme-color" content="#8cc63f">



    <title>UMA Clovr PoS</title>

    <script src="https://cdn.jsdelivr.net/npm/qr-scanner@1.4.1/qr-scanner.umd.min.js"></script>
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
                    <li><a href="#operar"><em class="operar"></em>Operar</a></li>
                    <li><a href="#transacciones"><em class="transacciones"></em>Transacciones</a></li>
                    <li><a href="#ajustes"><em class="ajustes"></em>Ajustes</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <div id="captura">
        
    </div>
    
    <main class="">
        <?php
        if(file_exists("pages/invoice.php"))
        require("pages/invoice.php");
        if(file_exists("pages/transacciones.php"))
        require("pages/transacciones.php");
        if(file_exists("pages/ajustes.php"))
        require("pages/ajustes.php");
        ?>
    </main>


    <footer>
        <div class="footer-container">
            <p>&copy; 2024 <em class="logo"></em> <b>UMA Clovr PoS</b>. Todos los derechos reservados.</p>
        </div>
        <div class="footer-menu">
            <div class="borde-footer-menu"></div>
            <div class="fondo-footer-menu"></div>
            <div class="borde-footer-menu"></div>
            <div class="fondo-footer-menu"></div>
            <nav class="menu" id="footer-menu">
                <ul>
                    <li data-template="invoice">
                        <!-- class="active" -->
                        <em class="operar">
                            <?php
                            $svgFile = 'img/icons/cash-register-solid.svg';
                            if (file_exists($svgFile)) {
                                $svgContent = file_get_contents($svgFile);
                                echo $svgContent;
                            } else {
                                echo 'Error: SVG file not found.';
                            }
                            ?>
                        </em>
                        <span>Crear Invoice</span></a>
                    </li>
                    <li class="active" data-template="transacciones">
                        <em class="transacciones">
                            <?php
                            $svgFile = 'img/icons/list-check-solid.svg';
                            if (file_exists($svgFile)) {
                                $svgContent = file_get_contents($svgFile);
                                echo $svgContent;
                            } else {
                                echo 'Error: SVG file not found.';
                            }
                            ?>
                        </em><span>Transacciones</span></a>
                    </li>
                    <li class="" data-template="ajustes"><em class="ajustes">
                            <?php
                            $svgFile = 'img/icons/gear-solid.svg';
                            if (file_exists($svgFile)) {
                                $svgContent = file_get_contents($svgFile);
                                echo $svgContent;
                            } else {
                                echo 'Error: SVG file not found.';
                            }
                            ?>
                        </em><span>Ajustes</span></li>
                </ul>
            </nav>
        </div>

    </footer>

    <script src="js/functions.js?<?php echo rand(0,999);?>" type="text/javascript" defer=""></script>
    <script src="js/invoice.js?<?php echo rand(0,999);?>" type="text/javascript" defer=""></script>
    <script src="js/serviceWorker.js?<?php echo rand(0,999);?>" type="text/javascript" defer=""></script>
    <script src="js/imagePWA.js?<?php echo rand(0,999);?>" type="text/javascript" defer=""></script>
    <script src="js/app.js?<?php echo rand(0,999);?>" type="text/javascript" defer=""></script>
    

</body>

</html>