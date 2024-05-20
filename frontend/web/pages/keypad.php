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

ajax({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts',
    success: function(response) {
        console.log('Success:', response);
    },
    error: function(error) {
        console.error('Error:', error);
    }
});

</script>