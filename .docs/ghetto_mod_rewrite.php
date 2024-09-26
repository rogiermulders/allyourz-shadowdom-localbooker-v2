<?php
/**
 * ghetto mod_rewrite :^)
 */
$rules = [
    '/localbooker/localbooker-spa/',
    '/localbooker/localbooker-nb/',
    '/localbooker/lb-walcheren/',
];

/** https://localbooker.nl */
$rules = [
    '/nl-nl/visit/zoek-en-boek/'
];

foreach ($rules as $rule) {
    if (0 === strpos($_SERVER['REQUEST_URI'], $rule)) {
        $_SERVER['REDIRECT_URL'] = $_SERVER['REQUEST_URI'] = $rule;
    }
}


