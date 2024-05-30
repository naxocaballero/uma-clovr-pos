document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("display");
    const keypad = document.querySelector(".keypad");

    keypad.addEventListener("click", (event) => {
        const key = event.target;
        if (key.classList.contains("key")) {
            const value = key.textContent;
            if (value === "Del") {
                display.textContent = "satoshis";
            } else {
                handleInput(value);
            }
            key.classList.add("active");
            requestAnimationFrame(() => key.classList.remove("active"));
            updatePlaceholder(display);
        }
    });

    document.addEventListener("keydown", (event) => {
        const key = event.key;
        if (key === "Backspace" || key === "Delete" || key.toLowerCase() === "c") {
            display.textContent = "satoshis";
        } else if ((key >= "0" && key <= "9") || key === "."/* || key === ","*/) {
            handleInput(key);
        } else if (key === "Enter") {
            document.querySelector(".generate-button").click();
        }
        updatePlaceholder(display);
    });

    document.querySelector(".generate-button").addEventListener("click", () => {
        const display = document.getElementById("display");
        let displayValue = display.textContent.trim();

        displayValue = displayValue.replace(/\./g, "").replace(/,/, ".");

        let amount = parseInt(displayValue);

        if (isNaN(amount) || amount <= 0) {
            console.error("El valor ingresado no es válido");
            return;
        }

        let invoiceData = {
            amount: amount
        };

        console.log(invoiceData);
        

        fetch("https://192.168.88.135:8080/invoices", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(invoiceData),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data);
            const result = document.getElementById('result');

            result.innerText = JSON.stringify(data, null, 2);
            mainScrollable();
            /*
            Debo recibir los siguientes datos:
            1. Payment Request para generar el QR y para mostrarlo.
            2. Timestamp de la generación de factura en el nodo.
            3. Id de la transacción en la base de datos (índice interno).
            4. Estado de la transacción (confirmado, pendiente, cancelado, rechazado, expirado, ...) (Aunque está recién creada, y no puede estar en estado confirmado, lo que pido es que se me envíe todo el registro de la BBDD de esta transacción, para Yo presentar en el Frontend lo que me interese).
            5. En caso de "error" en la creación de factura, quiero recibir también el mensaje de error.
            */


        })
        .catch((error) => {
            console.error("Error:", error);
        });

        display.textContent = "satoshis";
        updatePlaceholder(display);
    });

    function updatePlaceholder(display) {
        if (display.textContent.trim() === "" || display.textContent.trim() === "satoshis") {
            display.classList.add("empty");
        } else {
            display.classList.remove("empty");
        }
    }

    function handleInput(value) {
        if (value === "." || value === ",") {
            value = ",";
        }

        let currentValue = display.textContent.trim().replace(/\./g, "");

        if (currentValue === "satoshis" || currentValue === "0") {
            currentValue = "";
        }

        if (currentValue === "0") {
            if (value === ",") {
                display.textContent = "0,";
            } else if (value >= "1" && value <= "9") {
                display.textContent = value;
            }
        } else {
            const newValue = currentValue + value;
            if (isValidInput(newValue)) {
                display.textContent = formatNumber(newValue);
            }
        }
    }

    function isValidInput(input) {
        const regex = /^(?!0\d)(\d{0,8})(,\d{0,3})?$/;
        return regex.test(input);
    }

    function formatNumber(input) {
        const parts = input.split(",");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return parts.join(",");
    }

    updatePlaceholder(display);
});