<?php
function generateRandomTransactions() {
    $types = [
        'payment' => 'Venta',
        'refund' => 'Devolución'
    ];
    $statuses = ['confirmed', 'pending', 'expired'];
    $titles = [
        'Funda iPhone XS', 'Cargador Samsung Galaxy', 'Auriculares Bluetooth', 
        'Protector de pantalla', 'Cable USB-C', 'Soporte para coche', 
        'Power Bank 10000mAh', 'Funda Samsung Galaxy S10', 'Altavoz Bluetooth', 
        'Tarjeta de memoria 128GB'
    ];
    $amounts = [];
    for ($i = 0; $i < 20; $i++) {
        $amounts[] = rand(0, 10000) / 100; // Precios aleatorios entre 0.00 y 100.00
    }

    $jsonArray = [];
    $currentDate = new DateTime();
    $baseIdTx = 2754;

    foreach (range(0, 19) as $i) {
        $typeKey = array_rand($types);
        $typeName = $types[$typeKey];
        $status = $statuses[array_rand($statuses)];
        $title = $titles[array_rand($titles)];
        $amount = $amounts[$i];
        $idTx = $baseIdTx + $i;
        $date = $currentDate->getTimestamp() - ($i * 384); // Fecha decreciente

        $jsonArray[] = [
            'typeKey' => $typeKey,
            'status' => $status,
            'typeName' => $typeName,
            'idTx' => $idTx,
            'title' => $title,
            'date' => $date,
            'amount' => $amount
        ];
    }

    return json_encode($jsonArray);
}

header('Content-Type: application/json');
echo generateRandomTransactions();
?>