function toggleActions(item, items) {
    const actions = item.parentElement.querySelector('.item-actions');
    if (actions.classList.contains('expanded')) {
        collapseActions(actions);
        item.parentElement.classList.remove("active");
    } else {
        expandActions(item, items, actions);
    }
}

function collapseActions(actions) {
    actions.style.transition = 'height 0.2s ease-in-out, opacity 0.1s ease-in-out';
    actions.style.height = '0';
    actions.style.opacity = '0';
    actions.classList.remove('expanded');
}

function expandActions(item, items, actions) {
    items.forEach(i => {
        if (i.parentElement !== item.parentElement) {
            collapseActions(i.parentElement.querySelector('.item-actions'));
            i.parentElement.classList.remove("active");
        }
    });

    item.parentElement.classList.add("active");
    actions.classList.add('expanded');

    const height = getElementDimensions(actions).scrollHeight + 'px';
    actions.style.height = '0';
    actions.style.opacity = '0';

    requestAnimationFrame(() => {
        actions.style.transition = 'height 0.2s ease-in-out, opacity 0.2s ease-in-out 0.1s';
        actions.style.height = height;
        actions.style.opacity = '1';
        item.parentElement.style.transition = "box-shadow 0.3s";
        actions.style.transform = 'translate3d(0, 0, 0)';
    });

    scrollToElement(item);

    const refundQR = item.parentElement.querySelector("button.qr-pr");
    if (refundQR) {
        setupRefundButtonQR(refundQR, actions, item);
    }

    const refundPaste = item.parentElement.querySelector("button.paste-pr");
    if (refundPaste) {
        setupRefundButtonPaste(refundPaste, actions, item);
    }

    const cancelPay = item.parentElement.querySelector("button.cancel-pay");
    if (cancelPay) {
        setupCancelPayButton(cancelPay, actions, item);
    }

    const confirmPay = item.parentElement.querySelector("button.confirm-pay");
    if (confirmPay) {
        setupConfirmPayButton(confirmPay, actions, item);
    }
}

function setupRefundButtonQR(button, actions, item) {
    console.log("Llamo a la función del botón")
    async function handleRefundButtonQRClick() {
        console.log("Activo cámara de fotos para escanear un QR");

        const buttons = button.closest('.refund-options');
        const captureContainer = button.closest('.action-refund').querySelector(".capture-container");
        const captureDimension = getElementDimensions(captureContainer);

        const video = button.closest('.action-refund').querySelector(".video");

        //buttons.style.display = "none";

        try {

            startCameraQR(captureContainer, actions, item);
            //await startCameraQR(video, captureContainer, actions, item);

        } catch (err) {
            console.error('Error al acceder a la cámara: ', err);
            buttons.style.display = "block";
        }
    }

    // Asegurarse de que el event listener solo se añade una vez
    if (!button.hasListener) {
        document.addEventListener('deviceready', function() {

            button.addEventListener('click', handleRefundButtonQRClick);
            button.hasListener = true; // Marcamos el botón para evitar agregar múltiples listeners
        }, false);
    }
}

function setupRefundButtonPaste(button, actions, item) {
    async function handleRefundButtonPasteClick() {
        console.log("Pego el Payment Request en el campo adecuado");

        const buttons = button.closest('.refund-options');

        try {
            const text = await navigator.clipboard.readText();
            buttons.style.display = "none";

            const paymentRequest = button.closest('.action-refund').querySelector('.payment-request');
            paymentRequest.querySelector('span').innerText = text;
            paymentRequest.style.display = "flex";

            const actionButtons = button.closest('.action-refund').querySelector('.action-buttons');
            actionButtons.style.display = "flex";

            const items = document.querySelectorAll('#transactions-container .item .item-container');
            expandActions(item, items, actions)
        } catch (err) {
            console.error('Error al acceder al clipboard: ', err);
            buttons.style.display = "block";
        }
    }

    // Asegurarse de que el event listener solo se añade una vez
    if (!button.hasListener) {
        button.addEventListener('click', handleRefundButtonPasteClick);
        button.hasListener = true; // Marcamos el botón para evitar agregar múltiples listeners
    }
}

function setupCancelPayButton(button, actions, item) {
    function handleCancelPayClick() {
        const refundOptions = button.closest('.action-refund').querySelector('.refund-options');
        const paymentRequest = button.closest('.action-refund').querySelector('.payment-request');
        const actionButtons = button.closest('.action-refund').querySelector('.action-buttons');

        paymentRequest.style.display = "none";
        actionButtons.style.display = "none";

        console.log(refundOptions);

        setTimeout(() => {
            refundOptions.style.display = "flex";
        }, 500);

        collapseActions(actions);
        item.parentElement.classList.remove("active");
    }

    // Asegurarse de que el event listener solo se añade una vez
    if (!button.hasListener) {
        button.addEventListener('click', handleCancelPayClick);
        button.hasListener = true; // Marcamos el botón para evitar agregar múltiples listeners
    }
}

function setupCancelCaptureButton(qrScanner, video, captureContainer, actions, item) {
    function handleCancelCaptureClick() {

        const refundOptions = captureContainer.closest('.action-refund').querySelector('.refund-options');

        try {

            stopCameraPreview();

            qrScanner.stop();
            if (video && video.srcObject) {
                video.srcObject.getTracks().forEach(track => track.stop());
                video.srcObject = null;
                console.log("Detengo el stream, y paro la cámara");
            }

            video.style.display = "none";
            captureContainer.style.display = "none";

            refundOptions.style.display = "none";

            setTimeout(() => {
                refundOptions.style.display = "flex";
            }, 500);

            collapseActions(actions);
            item.parentElement.classList.remove("active");
        } catch (err) {
            console.error('Error al manejar la captura del QR: ', err);
        } finally {
            isCameraActive = false;
        }
    }

    const button = captureContainer.querySelector("button.cancel-capture");

    // Asegurarse de que el event listener solo se añade una vez
    if (!button.hasListener) {
        button.addEventListener('click', handleCancelCaptureClick);
        button.hasListener = true; // Marcamos el botón para evitar agregar múltiples listeners
    }
}

function setupCancelCaptureQRButton(modalPreview, actions, item) {
    function handleCancelCaptureQRClick() {

        try {

            stopCameraPreview();

            modalPreview.style.display = "none";

        } catch (err) {
            console.error('Error al manejar la captura del QR: ', err);
        } finally {
            isCameraActive = false;
        }
    }

    const closeButton = modalPreview.querySelector('button.close-qr');

    // Asegurarse de que el event listener solo se añade una vez
    if (!closeButton.hasListener) {
        closeButton.addEventListener('click', handleCancelCaptureQRClick);
        closeButton.hasListener = true; // Marcamos el botón para evitar agregar múltiples listeners
    }
}

function setupConfirmPayButton(button, actions, item) {
    async function handleConfirmPayClick() {
        const paymentRequest = item.parentElement.querySelector('.payment-request span').innerText;
        const itemId = item.parentElement.querySelector('.item-info h3 span').innerText;

        const invoiceData = {
            payment_request: paymentRequest,
            id: parseInt(itemId)
        };

        console.log("Parámetros enviados:", invoiceData)

        try {
            const response = await fetch('https://192.168.88.135:8080/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            });

            if (!response.ok) {
                throw new Error('Error en la llamada a la API');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);

            // Seleccionamos los elementos
            const modal = document.getElementById("modal");
            modal.style.display = "flex";

            const h2 = modal.querySelector("h2");
            h2.innerText = 'Devolución';

            const eurContainer = modal.querySelector(".amountEUR");
            eurContainer.innerText = showAmountEUR(convertCurrency(data.amount, "EUR", bitcoinRate));

            const satsContainer = modal.querySelector(".amountSATS");
            satsContainer.innerText = showAmountSATS(data.amount);

            const countDown = modal.querySelector(".count-down .time");
            countDown.parentElement.style.display = "none";

            const container = modal.querySelector("#qrcode");
            container.style.display = "none";

            const qrCodeText = modal.querySelector("#qrcode-text");
            qrCodeText.style.display = "none";

            const qrResult = modal.querySelector("#qrcode-result");
            qrResult.style.display = "block";

            const closeQR = modal.querySelector(".close-qr");
            closeQR.addEventListener("click", () => {
                modal.style.display = "none";
                qrResult.style.display = "none";

                h2.style.display = "block";
                eurContainer.style.display = "block";
                satsContainer.style.display = "block";
                countDown.style.display = "block";
                countDown.parentElement.style.display = "block";

                qrCodeText.style.display = "block";
                container.style.display = "block";
                closeQR.style.display = "block";

                const menuItem = document.querySelector(`.menu li[data-template="transacciones"]`);
                if (menuItem) {
                    menuItem.click();
                }
            });

        } catch (err) {
            console.error('Error al confirmar el pago:', err);
        }
    }

    // Asegurarse de que el event listener solo se añade una vez
    if (!button.hasListener) {
        button.addEventListener('click', handleConfirmPayClick);
        button.hasListener = true; // Marcamos el botón para evitar agregar múltiples listeners
    }
}

/*
let isCameraActive = false;

async function startCamera(video, captureContainer, actions, item) {
    if (isCameraActive) {
        console.log("La cámara ya está activa.");
        return;
    }

    isCameraActive = true;

    if (document.hidden) return;

    if (video && video.srcObject) {
        let tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        console.log("Detengo el stream, y paro la cámara");
    }

    try {
        const constraints = {
            video: {
                aspectRatio: {
                    ideal: 1
                },
                facingMode: {
                    exact: "environment"
                }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        video.onloadedmetadata = async () => {
            await video.play();
        };

        video.srcObject.getTracks().forEach(track => console.log(track));

        video.style.display = 'block';
        captureContainer.style.display = "flex";

        let qrScanner = new QrScanner(video, result => {
            handleQrScan(result, qrScanner, video, captureContainer, actions, item);
        }, {
            returnDetailedScanResult: true
        });

        qrScanner.start();

        // Expando la tarjeta según el nuevo contenido
        const actionRefund = captureContainer.parentElement;
        requestAnimationFrame(() => {
            actions.style.height = actionRefund.scrollHeight + 'px';
        });

        const cancelCapture = captureContainer.querySelector("button.cancel-capture");
        if (cancelCapture) {
            console.log("existe botón")
            setupCancelCaptureButton(qrScanner, video, captureContainer, actions, item);
        }

        scrollToElement(item);
    } catch (err) {
        if (err.name === 'AbortError') {
            console.error('La operación fue abortada: ', err);
        } else {
            console.error('Error al iniciar la cámara: ', err);
        }
    }
}
*/


let isCameraActive = false;
let captureInterval;

async function startCameraQR(captureContainer, actions, item) {

    if (isCameraActive) {
        console.log("La cámara ya está activa.");
        return;
    }

    isCameraActive = true;

    if (document.hidden) return;

    try {

        // Muestro el modal de fondo con botón para cancenlar.
        const modalPreview = document.getElementById('modalPreview');
        modalPreview.style.display = "block";

        const refundAmount = modalPreview.querySelector('.refund-amount');
        refundAmount.innerText = item.querySelector('.item-amount span').textContent;

        const cameraPreview = document.getElementById('qrcodePreview');

        const rect = cameraPreview.getBoundingClientRect();

        CameraPreview.startCamera({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            camera: CameraPreview.CAMERA_DIRECTION.BACK,
            toBack: false,
            tapPhoto: false,
            tapFocus: true,
            previewDrag: false,
            enableHighResolution: true
        }, function() {
            console.log("Camera started");

            cameraPreview.style.opacity = 1;
            cameraPreview.style.display = "block";

            CameraPreview.setZoom(2);

            CameraPreview.setFocusMode(CameraPreview.FOCUS_MODE.CONTINUOUS);


            CameraPreview.setExposureMode(CameraPreview.EXPOSURE_MODE.CONTINUOUS);

            CameraPreview.getFocusMode(function(currentFocusMode) {
                console.log(currentFocusMode);
            });

            CameraPreview.getCameraCharacteristics(function(characteristics) {
                console.log(characteristics);
            });

            startCapture(item);

        }, function(err) {
            console.error('Error al iniciar la cámara: ', err);
            isCameraActive = false;
        });

        // Expando la tarjeta según el nuevo contenido
        /*const actionRefund = captureContainer.parentElement;
        requestAnimationFrame(() => {
            actions.style.height = actionRefund.scrollHeight + 'px';
        });*/

        const cancelCapture = modalPreview.querySelector("button.close-qr");
        if (cancelCapture) {
            //setupCancelCaptureButton(qrScanner, video, captureContainer, actions, item);
            setupCancelCaptureQRButton(modalPreview, actions, item);
        }

        scrollToElement(item);
    } catch (err) {
        if (err.name === 'AbortError') {
            console.error('La operación fue abortada: ', err);
        } else {
            console.error('Error al iniciar la cámara: ', err);
        }
    }
}

let counter = 0;

function startCapture(item) {
    captureInterval = setInterval(() => {
        captureImage(item);
        counter = counter + 1;
        console.log(counter)
    }, 500); // Captura una imagen cada segundo
}

function stopCameraPreview() {
    if (typeof CameraPreview !== 'undefined') {
        CameraPreview.stopCamera(function() {
            console.log("Camera stopped");
            isCameraActive = false;
            clearInterval(captureInterval);
            document.querySelectorAll('.video').forEach(video => {
                video.style.display = 'none';
            });
            document.querySelectorAll('.capture-container').forEach(container => {
                container.style.display = 'none';
            });
        }, function(err) {
            console.error('Error al detener la cámara: ', err);
        });
    } else {
        console.error('CameraPreview plugin no está disponible.');
        isCameraActive = false;
    }
}


function captureImage(item) {
    if (typeof CameraPreview !== 'undefined') {
        CameraPreview.takeSnapshot({
            quality: 100
        }, function(base64PictureData) {
            // Aquí obtienes la imagen capturada en base64
            var imageSrc = 'data:image/jpeg;base64,' + base64PictureData;
            document.getElementById('capturedImage').src = imageSrc;

            // Procesa la imagen para detectar QR
            processQrCode(imageSrc, item);
        }, function(error) {
            console.error('Error al capturar la imagen: ', error);
        });
    } else {
        console.error('CameraPreview plugin no está disponible.');
    }
}

function processQrCode(imageSrc, item) {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
        QrScanner.scanImage(img, {
                returnDetailedScanResult: true
            })
            .then(result => {
                console.log('QR Code detected: ', result.data);

                // Cerramos la ventana modal
                const modalPreview = document.getElementById('modalPreview');
                modalPreview.style.display = "none";

                try {

                    stopCameraPreview();
                    modalPreview.style.display = "none";

                    console.log("Intento modificar ventanas")
                    const refundOptions = item.closest('.item').querySelector('.refund-options');
                    refundOptions.style.display = "none";

                    const paymentRequest = item.closest('.item').querySelector('.payment-request');
                    const lightningData = extractLightningData(result.data);
                    paymentRequest.querySelector('span').innerText = lightningData;
                    paymentRequest.style.display = "flex";

                    const actionButtons = item.closest('.item').querySelector('.action-buttons');
                    actionButtons.style.display = "flex";

                    const actions = item.closest('.item').querySelector('.item-actions');
                    const items = document.querySelectorAll('#transactions-container .item .item-container');
                    expandActions(item, items, actions)



                } catch (err) {
                    console.error('Error al copiar el texto del QR: ', err);
                    //buttons.style.display = "block";
                }

            })
            .catch(error => {
                //console.error('No QR Code detected: ', error);
            });
    };
}



function handleQrScan(result, qrScanner, video, captureContainer, actions, item) {
    try {
        qrScanner.stop();
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            console.log("Detengo el stream, y paro la cámara");
        }

        video.style.display = "none";
        captureContainer.style.display = "none";

        const buttonOptions = captureContainer.closest('.action-refund').querySelector('.refund-options');
        buttonOptions.style.display = "none";

        const paymentRequest = captureContainer.closest('.action-refund').querySelector('.payment-request');

        const lightningData = extractLightningData(result.data);
        paymentRequest.querySelector('span').innerText = lightningData;
        paymentRequest.style.display = "flex";

        const actionButtons = captureContainer.closest('.action-refund').querySelector('.action-buttons');
        actionButtons.style.display = "flex";

        requestAnimationFrame(() => {
            actions.style.height = (getElementDimensions(paymentRequest).totalHeight + getElementDimensions(actionButtons).totalHeight) + 8 + 'px';
        });

        const buttonCancel = buttonOptions.querySelector('button.cancel-refund');
        if (buttonCancel) {
            buttonCancel.addEventListener('click', () => {
                resetRefundProcess(paymentRequest, buttonOptions, actions, item);
            });
        }
    } catch (err) {
        console.error('Error al manejar la captura del QR: ', err);
    } finally {
        isCameraActive = false;
    }
}

function resetRefundProcess(paymentRequest, buttonOptions, actions, item) {
    paymentRequest.style.display = "none";
    paymentRequest.innerHTML = "";
    buttonOptions.style.display = "none";

    requestAnimationFrame(() => {
        actions.style.height = '0';
    });

    actions.classList.remove('expanded');
    item.parentElement.classList.remove("active");

    setTimeout(() => {
        const buttonRefund = item.parentElement.querySelector("button.start-refund");
        buttonRefund.style.display = "block";
    }, 500);
}

function clearAllBlur(items) {
    items.forEach(i => {
        i.parentElement.classList.remove('blurred', 'active');
        collapseActions(i.parentElement.querySelector('.item-actions'));
    });
}

function addEventListeners() {
    const items = document.querySelectorAll('#transactions-container .item .item-container');

    items.forEach(item => {
        item.addEventListener('click', () => toggleActions(item, items));
    });

    document.querySelector('.buscar').addEventListener('input', () => clearAllBlur(items));
    document.querySelector('.buscar').addEventListener('touchstart', () => clearAllBlur(items));
}

addEventListeners();