<?php

$host = "localhost";
$user = "root";
$password = "";
$db = "web_weather";

try {
    $connection = new PDO("mysql:host=$host;dbname=$db", $user, $password);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    print_r(json_encode(["error" => 500]));
    exit();
}
