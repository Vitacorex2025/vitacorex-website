<?php
$path = __DIR__ . '/index.html';
if (is_file($path)) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($path);
    exit;
}
http_response_code(404);
echo 'index.html not found';
