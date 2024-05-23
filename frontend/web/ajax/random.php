<?php
header('Content-Type: application/json');

$randomValue = rand(1, 100);

echo json_encode(array('randomValue' => $randomValue));
?>
