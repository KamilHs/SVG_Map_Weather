<?php
require_once("functions.inc.php");
require_once("errors.inc.php");
require_once("rules.inc.php");

function validateAdd($data)
{
    return validate($data, VALIDATION_ADD_RULES);
}

function validateEdit($data)
{
    return validate($data, VALIDATION_EDIT_RULES);
}

function validate($data, $all_rules)
{
    $errors = [];
    global $VALIDATION_FUNCTIONS;
    foreach ($all_rules as $property => $rules) {
        foreach ($rules as $rule => $value) {
            if ($rule === $value) { 
                if ($rule === "required") {
                    if (!$VALIDATION_FUNCTIONS[$rule]($property, $data)) {
                        $errors[$property] = errorMessage($rule);
                        continue 2;
                    }
                } else {
                    if (!$VALIDATION_FUNCTIONS[$rule]($data[$property])) {
                        $errors[$property] = errorMessage($rule);
                        continue 2;
                    }
                }
            } else {
                if (!$VALIDATION_FUNCTIONS[$rule]($data[$property], $value)) {
                    $errors[$property] = errorMessage($rule, $value);
                    continue 2;
                }
            }
        }
    }
    return $errors;
}
