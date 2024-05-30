<section id="transacciones" class="">
    <h2>Buscar</h2>
    <input type="text" name="buscar" class="buscar" placeholder="Buscar transacción ..." />

    <div class="container" id="transactions-container">

    </div>
    <div id="spinner" class="spinner">
        <svg id="loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080">
            <title>spinner</title>
            <g id="Logo-2" data-name="Logo">
                <path id="petalo1"
                    d="M819.06,394.94c28.45-77.81-22.8-168-114.46-201.56s-189,2.41-217.47,80.22c-10.84,29.65-10.1,61.09,0,90.52.37,1.29,9,31.29,15,47.51a554.13,554.13,0,0,0,36.59,79.46l35.64,58.63.33.37,65.05-21.82A555.44,555.44,0,0,0,719,491.15l41.69-27C787.37,448.16,808.22,424.6,819.06,394.94Z"
                    fill="#052238" />
                <path id="petalo2"
                    d="M310.46,423c-81.61,14.27-134.14,103.77-117.33,199.91s96.6,162.5,178.21,148.22c31.09-5.43,58-21.8,78.38-45.28.93-1,22.6-23.44,33.66-36.71a555,555,0,0,0,50.52-71.42l33-60.19L567,557l-51.42-45.43a555.74,555.74,0,0,0-71.76-50L399.58,439C372.39,423.79,341.56,417.51,310.46,423Z"
                    fill="#052238" />
                <path id="petalo3"
                    d="M588.23,851c53.16,63.54,156.94,64.28,231.78,1.65s92.43-164.9,39.27-228.44C839,600,811.42,584.94,780.87,579c-1.3-.33-31.6-7.86-48.62-10.81a554.86,554.86,0,0,0-87.11-8l-68.6,1.55-.48.09q-6.82,33.63-13.63,67.25A554.65,554.65,0,0,0,555,716.22l2.56,49.62C558,797,568,826.81,588.23,851Z"
                    fill="#052238" />
                <path id="Rayo" d="M344,553.17,643.58,295c13.06-8.36,25.5,0,17.53,14.34l-95.61,188H736s27.09,0,0,22.31L441.2,779.46c-20.72,17.53-35.06,8-20.72-19.13l92.43-183.26H344S316.9,577.07,344,553.17Z" fill="#7f47dd" stroke="#fff" stroke-miterlimit="10" stroke-width="30" />
            </g>
        </svg>
    </div>
    <canvas id="canvas" style="display: none;"></canvas>
</section>

<script>
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
    async function handleRefundButtonQRClick() {
        console.log("Activo cámara de fotos para escanear un QR");

        const buttons = button.closest('.refund-options');
        const captureContainer = button.closest('.action-refund').querySelector(".capture-container");
        const captureDimension = getElementDimensions(captureContainer);

        buttons.style.display = "none";

        try {
            await startCamera(button.closest('.action-refund').querySelector("video"), captureContainer, actions, item);
        } catch (err) {
            console.error('Error al acceder a la cámara: ', err);
            buttons.style.display = "block";
        }
    }

    // Asegurarse de que el event listener solo se añade una vez
    if (!button.hasListener) {
        button.addEventListener('click', handleRefundButtonQRClick);
        button.hasListener = true; // Marcamos el botón para evitar agregar múltiples listeners
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

function setupCancelCaptureButton(stream, qrScanner, video, captureContainer, actions, item) {
    function handleCancelCaptureClick() {

        const refundOptions = captureContainer.closest('.action-refund').querySelector('.refund-options');

        try {
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

function setupConfirmPayButton(button, actions, item) {
    async function handleConfirmPayClick() {
        const paymentRequest = item.parentElement.querySelector('.payment-request span').innerText;
        const itemId = item.parentElement.querySelector('.item-info h3 span').innerText;

        const invoiceData = {
            payment_request: paymentRequest,
            id: itemId
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
            handleQrScan(result, stream, qrScanner, video, captureContainer, actions, item);
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
            setupCancelCaptureButton(stream, qrScanner, video, captureContainer, actions, item);
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

function handleQrScan(result, stream, qrScanner, video, captureContainer, actions, item) {
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
        paymentRequest.querySelector('span').innerText = result.data;
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
</script>