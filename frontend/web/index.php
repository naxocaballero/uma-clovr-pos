<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <base href="./" />

    <!-- Enlace a los archivos CSS -->
    <link rel="stylesheet" type="text/css" href="css/styles.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/header.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/main.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/footer.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/invoice.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/transacciones.css?<?php echo rand(0,999);?>" />
    <link rel="stylesheet" type="text/css" href="css/ajustes.css?<?php echo rand(0,999);?>" />

    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon/favicon-16x16.png" />
    <link rel="mask-icon" href="img/favicon/apple-touch-icon.png" color="#ffffff" />
    <link rel="shortcut icon" href="img/favicon/favicon.ico" />

    <!-- Viewport and Apple stuff -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
    <!--<meta name="theme-color" content="#8cc63f" />-->
    <meta name="description" content="Punto de venta Bitcoin Lightning Network de Clovr Labs." />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="format-detection" content="telephone=no">
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
                    <li><a href="#operar"><em class="operar"></em>Operar</a></li>
                    <li><a href="#transacciones"><em class="transacciones"></em>Transacciones</a></li>
                    <li><a href="#ajustes"><em class="ajustes"></em>Ajustes</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <main>
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
            <nav class="menu" id="footer-menu">
                <ul>
                    <li class="active" data-template="invoice">
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
                    <li class="" data-template="transacciones">
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
                    <li data-template="ajustes"><em class="ajustes">
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
    <script src="js/app.js?<?php echo rand(0,999);?>" type="text/javascript" defer=""></script>
    <script src="js/invoice.js?<?php echo rand(0,999);?>" type="text/javascript" defer=""></script>

</body>

</html>