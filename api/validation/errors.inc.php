<?php
const ERRORS = [
    "required" => "required",
    "integer" => "not a number",
    "min" => "min value is",
    "max" => "max value is",
    "string" => "not a string",
    "length" => "length not",
    "date" => "not a date",
];

function errorMessage($error, $rule = "")
{
    return ERRORS[$error] . ($rule === "" ? $rule : " " . $rule);
}
