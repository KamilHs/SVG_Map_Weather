<?php

const SANITIZING_ADD_RULES = [
    "temperature" => "integer",
    "pressure" => "integer",
    "wind" => "integer",
    "humidity" => "integer",
    "temp_desc_id" => "integer",
    "weather_desc_id" => "integer",
    "city" => "string",
    "date" => "date"
];

const SANITIZING_EDIT_RULES = [
    "temperature" => "integer",
    "pressure" => "integer",
    "wind" => "integer",
    "humidity" => "integer",
    "record_id" => "integer",
    "temp_desc_id" => "integer",
    "weather_desc_id" => "integer",
    "date" => "date"
];
