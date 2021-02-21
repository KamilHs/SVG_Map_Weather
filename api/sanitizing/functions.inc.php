<?php

$SANITIZING_FUNCTIONS = [
    "integer" => function ($val) {
        return intval($val);
    },
    "date" => function ($val) {
        return date("Y-m-d H:i:s", strtotime($val));
    },
    "string" => function ($val) {
        return strval($val);
    }
];
