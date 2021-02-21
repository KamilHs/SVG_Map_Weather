<?php
require_once("functions.inc.php");
require_once("rules.inc.php");

function sanitizeAdd($data)
{
    return sanitize($data, SANITIZING_ADD_RULES);
}

function sanitizeEdit($data)
{
    return sanitize($data, SANITIZING_EDIT_RULES);
}

function sanitize($data, $rules)
{
    $sanitized = [];
    global $SANITIZING_FUNCTIONS;
    foreach ($rules as $prop => $rule) {
        $sanitized[$prop] = $SANITIZING_FUNCTIONS[$rule]($data[$prop]);
    }
    return $sanitized;
}
