<section id="keypad">
    <div class="container">

        <input type="text" id="display" placeholder="sats" readonly>
        <div class="keypad">
            <button class="key">1</button>
            <button class="key">2</button>
            <button class="key">3</button>
            <button class="key">4</button>
            <button class="key">5</button>
            <button class="key">6</button>
            <button class="key">7</button>
            <button class="key">8</button>
            <button class="key">9</button>
            <button class="key">C</button>
            <button class="key">0</button>
            <button class="key">,</button>
        </div>
        <button class="generate-button">Generar invoice</button>
    </div>
</section>

<script>
document.querySelector('.generate-button').addEventListener('click', function() {

    var displayValue = document.getElementById('display').value;

    // Remover puntos como separadores de miles y reemplazar la coma por un punto
    displayValue = displayValue.replace(/\./g, '').replace(/,/, '.');

    var amount = parseFloat(displayValue);

    if (isNaN(amount) || amount <= 0) {
        console.error('El valor ingresado no es válido');
        return;
    }

    var invoiceData = {
        amount: amount,
        expiration: 900, // Ejemplo de expiración en segundos (15 minutos)
        memo: 'Pago de prueba' // Ejemplo de memo
    };

    console.log(amount);

    ajax({
        method: 'POST',
        url: 'http://localhost:8080/generate-invoice', // URL de tu API en Golang
        data: invoiceData,
        timeout: 5000, // Tiempo de espera en milisegundos
        success: function(response) {
            console.log('Success:', response);
            document.getElementById('display').value = response.invoice; // Asume que el JSON de respuesta tiene un campo 'invoice'
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });

});
</script>