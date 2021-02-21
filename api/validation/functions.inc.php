<?php

$VALIDATION_FUNCTIONS = [
    "min" => function ($val, $min) {
        return intval($val) >= $min;
    },
    "max" => function ($val, $max) {
        return intval($val) <= $max;
    },
    "integer" => function ($val) {
        return is_numeric($val);
    },
    "length" => function ($val, $length) {
        return strlen(trim($val)) == $length;
    },
    "required" => function ($val, $arr) {
        return array_key_exists($val, $arr) && (!empty(trim($arr[$val])) || $arr[$val] === '0');
    },
    "string" => function ($val) {
        return is_string($val);
    },
    "date" => function ($val) {
        return strtotime($val);
    }
];