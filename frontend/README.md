# Frontend

## 🖥️ Puesta en marcha

Para poner en funcionamiento el frontend, es imprescindible disponer de un servidor web que sea capaz de servir HTTPS. En la carpeta denominada 'ssl', encontrarás tanto el certificado como la clave del servidor. Para un funcionamiento óptimo del frontend, es crucial usar estos archivos. Debes configurar estos archivos en el servidor web que hayas seleccionado.

Te recordamos que la configuración de un servidor web con estos parámetros supera el alcance de este Readme, por lo que se presupone que el usuario cuenta con los conocimientos suficientes para llevar a cabo esta configuración. 🤓

Los archivos de la página web están ubicados en la carpeta 'web'. Estos archivos deben situarse en el directorio 'documentRoot' del servidor web.

Durante el desarrollo de este proyecto, hemos utilizado XAMPP como servidor web (para MacOS). 🍏

## Configuración de SSE para el uso de otro dispositivo (*iPad*) como monitor adicional

En la carpeta denominada 'node' se encuentra el archivo sse.js. Se trata de una aplicación desarrollada en node.js y que es la encargada de comunicar el frontend que se ejecuta en el iPhone (PoS) con el frontend ejecutado en el dispositivo adicional (*un iPad, por ejemplo*). Para ello, es necesario tener instalado node.js en la misma máquina local en una versión superior a la 18. Luego ejecutar ```node sse.js```.

En el caso de usar un iPad (o cualquier otro dispositivo), debe abrirse la web ***https://192.168.88.135/client.php***. 
