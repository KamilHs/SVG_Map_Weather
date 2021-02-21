<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

require_once("config/db.inc.php");
require_once("queries/index.php");
require_once("validation/index.php");
require_once("sanitizing/index.php");

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (count($_GET) == 0) {
        return initRequest();
    } else if (count($_GET) == 1) {
        if (array_key_exists("iso", $_GET)) {
            return getRegionDataRequest($_GET["iso"]);
        }
    }
} else if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $_POST = json_decode(file_get_contents('php://input'), true);

    if (array_key_exists("record_id", $_POST) && is_numeric($_POST["record_id"])) {
        $errors = validateEdit($_POST);

        if (count($errors)) {
            return print_r(json_encode($errors));
        } else {
            postEditData();
        }
    } else {
        $errors = validateAdd($_POST);

        if (count($errors)) {
            return print_r(json_encode($errors));
        } else {
            postAddData();
        }
    }
} else if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $_DELETE = json_decode(file_get_contents('php://input'), true);
    if (!$_DELETE || !array_key_exists("record_id", $_DELETE) && is_nan($_DELETE["record_id"]))
        return print_r(json_encode(["error" => true]));

    return deteleData($_DELETE["record_id"]);
}

function initRequest()
{
    global $connection;
    $stmt = $connection->prepare(GET_TEMPERATURE_DESCRIPTIONS);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $temp_descs = $stmt->fetchAll();
    $stmt = $connection->prepare(GET_WEATHER_DESCRIPTIONS);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $weather_descs = $stmt->fetchAll();

    return print_r(json_encode(["temp_descs" => $temp_descs, "weather_descs" => $weather_descs]));
}


function getRegionDataRequest($iso)
{
    global $connection;
    $stmt = $connection->prepare(GET_CITY_CONTENT);
    $stmt->bindParam(":iso", $iso, PDO::PARAM_STR);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    return print_r(json_encode($stmt->fetchAll()));
}


function postAddData()
{
    global $connection;
    $sanitized = sanitizeAdd($_POST);

    if (!checkKey(GET_WEATHER_DESCRIPTION, "weather_desc_id", $sanitized["weather_desc_id"], PDO::PARAM_INT))
        return print_r(json_encode(["weather_desc_id" => "Invalid Weather Description", "error" => true]));

    if (!checkKey(GET_TEMPERATURE_DESCRIPTION, "temp_desc_id", $sanitized["temp_desc_id"], PDO::PARAM_INT))
        return print_r(json_encode(["temp_desc_id" => "Invalid Temperature Description", "error" => true]));

    $stmt = $connection->prepare(GET_CITY);
    $stmt->bindParam(":city", $sanitized["city"], PDO::PARAM_STR);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetch();

    if (count($result) == 0) {
        return print_r(json_encode(["city" => "Invalid City", "error" => true]));
    }

    $sanitized["city"] = intval($result["city_id"]);


    $stmt = $connection->prepare(POST_ADD_DATA);
    $stmt->bindParam(":date", $sanitized["date"], PDO::PARAM_STR);
    $stmt->bindParam(":city", $sanitized["city"], PDO::PARAM_INT);
    $stmt->bindParam(":temperature", $sanitized["temperature"], PDO::PARAM_INT);
    $stmt->bindParam(":wind", $sanitized["wind"], PDO::PARAM_INT);
    $stmt->bindParam(":pressure", $sanitized["pressure"], PDO::PARAM_INT);
    $stmt->bindParam(":humidity", $sanitized["humidity"], PDO::PARAM_INT);
    $stmt->bindParam(":weather_desc_id", $sanitized["weather_desc_id"], PDO::PARAM_INT);
    $stmt->bindParam(":temp_desc_id", $sanitized["temp_desc_id"], PDO::PARAM_INT);

    return print_r(json_encode(["success" => $stmt->execute()]));
}

function postEditData()
{
    global $connection;
    $sanitized = sanitizeEdit($_POST);

    if (!checkKey(GET_WEATHER_DESCRIPTION, "weather_desc_id", $sanitized["weather_desc_id"], PDO::PARAM_INT))
        return print_r(json_encode(["weather_desc_id" => "Invalid Weather Description", "error" => true]));

    if (!checkKey(GET_TEMPERATURE_DESCRIPTION, "temp_desc_id", $sanitized["temp_desc_id"], PDO::PARAM_INT))
        return print_r(json_encode(["temp_desc_id" => "Invalid Temperature Description", "error" => true]));

    if (!checkKey(GET_RECORD, "record_id", $sanitized["record_id"], PDO::PARAM_INT))
        return print_r(json_encode(["city" => "Invalid Record", "error" => true]));

    $stmt = $connection->prepare(POST_EDIT_DATA);

    $stmt->bindParam(":date", $sanitized["date"], PDO::PARAM_STR);
    $stmt->bindParam(":record_id", $sanitized["record_id"], PDO::PARAM_INT);
    $stmt->bindParam(":temperature", $sanitized["temperature"], PDO::PARAM_INT);
    $stmt->bindParam(":wind", $sanitized["wind"], PDO::PARAM_INT);
    $stmt->bindParam(":pressure", $sanitized["pressure"], PDO::PARAM_INT);
    $stmt->bindParam(":humidity", $sanitized["humidity"], PDO::PARAM_INT);
    $stmt->bindParam(":weather_desc_id", $sanitized["weather_desc_id"], PDO::PARAM_INT);
    $stmt->bindParam(":temp_desc_id", $sanitized["temp_desc_id"], PDO::PARAM_INT);

    return print_r(json_encode(["success" => $stmt->execute()]));
}


function checkKey($query, $queryVar, $value, $type)
{
    global $connection;
    $stmt = $connection->prepare($query);
    $stmt->bindParam(":$queryVar", $value, $type);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);

    return count($stmt->fetch()) != 0;
}

function deteleData($record)
{
    global $connection;
    $stmt = $connection->prepare(DELETE_RECORD);
    $stmt->bindParam(":record_id", $record, PDO::PARAM_INT);
    return print_r(json_encode(["success" => $stmt->execute()]));
}