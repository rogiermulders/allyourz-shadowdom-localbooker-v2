<?php
/**
 * ghetto mod_rewrite :^)
 */
$rules = [
    '/localbooker/localbooker-spa/',
    '/localbooker/localbooker-nb/',
    '/localbooker/lb-walcheren/',
];
foreach ($rules as $rule) {
    if (str_starts_with($_SERVER['REQUEST_URI'], $rule)) {
        $_SERVER['REDIRECT_URL'] = $_SERVER['REQUEST_URI'] = $rule;
    }
}
