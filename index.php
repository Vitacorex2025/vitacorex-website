<?php
http_response_code(200);
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
readfile(__DIR__ . '/index.html');
?>