<?php

const VALIDATION_ADD_RULES = [
    "date" => [
        "required" => "required",
        "date" => "date",
    ],
    "temperature" => [
        "required" => "required",
        "integer" => "integer",
        "min" => -40,
        "max" => 40
    ],
    "pressure" => [
        "required" => "required",
        "integer" => "integer",
        "min" => 1000,
        "max" => 1020
    ],
    "humidity" => [
        "required" => "required",
        "integer" => "integer",
        "min" => 0,
        "max" => 100
    ],
    "wind" => [
        "required" => "required",
        "integer" => "integer",
        "min" => 5,
        "max" => 80
    ],
    "temp_desc_id" => [
        "required" => "required",
        "integer" => "integer",
    ],
    "weather_desc_id" => [
        "required" => "required",
        "integer" => "integer",
    ],
    "city" => [
        "required" => "required",
        "string" => "string",
        "length" => 7
    ]
];


const VALIDATION_EDIT_RULES = [
    "date" => [
        "required" => "required",
        "date" => "date",
    ],
    "temperature" => [
        "required" => "required",
        "integer" => "integer",
        "min" => -40,
        "max" => 40
    ],
    "pressure" => [
        "required" => "required",
        "integer" => "integer",
        "min" => 1000,
        "max" => 1020
    ],
    "humidity" => [
        "required" => "required",
        "integer" => "integer",
        "min" => 0,
        "max" => 100
    ],
    "wind" => [
        "required" => "required",
        "integer" => "integer",
        "min" => 5,
        "max" => 80
    ],
    "temp_desc_id" => [
        "required" => "required",
        "integer" => "integer",
    ],
    "weather_desc_id" => [
        "required" => "required",
        "integer" => "integer",
    ],
    "record_id" => [
        "required" => "required",
        "integer" => "integer"
    ]
];
