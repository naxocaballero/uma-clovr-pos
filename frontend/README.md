# UMA Clovr PoS [FrontEnd]

Interface de usuario usada como FrontEnd para la emisión de facturas y devoluciones a través de la red Bitcoin Lightning.

## Clonar el repositorio en local

1. Utilizando VS Code, clonar el repositorio en una carpeta local o copiar los archivos del repositorio y colocarlos en la carpeta local del proyecto.

    `https://github.com/markettes/uma-clovr-pos.git`

## Configuración del entorno de ejecución en local

### 1. Usando **_VS Code_** _(permite usar la webApp como web clip)_

Instrucciones para la ejecución del frontend en local usando exclusivamente Visual Studio Code en un equipo que corre sistema operativo MacOS (en un futuro próximo presentaré la versión para Windows cuando avance con el proyecto).

1. Instalar PHP en la máquina. En el caso de macOS puedes usar **brew**.

    `brew install php`

2. Instalar la extensión de VSCode **"PHP Server"** _(creada por brapifra)_.
3. Para ejecutar el archivo **index.php** desde VSCode, hacer clic con el **botón derecho** en cualquier zona del código de **index.php** y ejecutar **_"PHP Server: Serve project"_**.

    <div style="text-align: center;">
    <img src="docs/imagenes/Captura de pantalla 2024-05-20 a las 18.59.34.png" alt="Cómo ejecutar PHP Server" style="width:60%">
    </div>

### 2. Usando XAMPP (**_imprescindible y necesario si se desea usar la versión alternativa PWA con service-worker_ offline**)

1. Instalar XAMPP descargándolo desde la web del desarrollador.

    > https://www.apachefriends.org/es/download.html

2. Clonar el contenido de la carpeta web del repositorio dentro de **"/Applications/XAMPP/xamppfiles/htdocs"**

3. Acceder a la web mediante https://localhost _(aceptar el certificado autofirmado)_

## Uso de la aplicación web (Navegador y __PWA__)

Esta webApp puede ser ejecutada en cualquier navegador web. Está preparada para ser instalada como __PWA__ en cualquier dispositivo que lo soporte (Android, iOS, Mac, ...). Es solo un primer ejemplo de interface.
La versión móvil tendrá el menú en el inferior como la mayoría de aplicaciones nativas y será capaz de mostrarse de manera offline. Queda fuera del alcance de este proyecto la realización de una PWA capaz de trabajar full offline y almacenar operaciones en caso de no tener conexión a internet para "lanzarlas" una vez recupere la conexión.

<div style="text-align: center; width: 100%;">
   <img src="docs/imagenes/IMG_1721.png" alt="Springboard iPhone" style="width:24%;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <img src="docs/imagenes/IMG_1723.png" alt="Navegador Safari en iPhone" style="width:24%; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <img src="docs/imagenes/IMG_1722.png" alt="PWA en iPhone" style="width:24%; ">
</div>
&nbsp;
&nbsp;
<div style="text-align: center; width: 100%;">
   <img src="docs/imagenes/Captura de pantalla 2024-05-20 a las 18.29.33.png" alt="Navegador Chrome en Mac" style="width:40%;"> <img src="docs/imagenes/Captura de pantalla 2024-05-20 a las 18.30.41.png" alt="PWA en Mac" style="width:40%;"> 
</div>
&nbsp;

## __22-05-2024__ Actualización de la interface de usuario (___versión móvil___)

Estoy trabajando con la versión para móvil en primer lugar. Pienso que es la opción más versatil en tanto y en cuanto, si se da el caso de realizar una devolución, es útil disponer de una cámara en el mismo dispositivo para escanear el QR de la factura que genere un "cliente" para poder realizarle un abono (salvo que me equivoque, no hay forma de "devolver" una cantidad de dinero a alguien mediante LN pues, a menos que tenga una dirección permanente, el pago siempre se basa en facturas previamente creadas por parte del receptor).
_(adjunto nuevas capturas de pantalla del Frontend)_

<div style="text-align: center; width: 100%;">
   <img src="docs/imagenes/1.png" alt="" style="width:24%;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <img src="docs/imagenes/2.png" alt="" style="width:24%; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <img src="docs/imagenes/3.png" alt="" style="width:24%; ">
</div>
&nbsp;
&nbsp;
<div style="text-align: center; width: 100%;">
   <img src="docs/imagenes/4.png" alt="" style="width:24%;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <img src="docs/imagenes/5.png" alt="" style="width:24%; ">
</div>