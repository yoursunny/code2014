<?php
header('Content-Type: text/css');
header('Vary: User-Agent');
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
page_cache();
page_gzip();

$ua=''.@$_SERVER['HTTP_USER_AGENT'];
$isKnown=strpos($ua,'Firefox') || strpos($ua,'MSIE') || strpos($ua,'Opera') || strpos($ua,'WebKit');
$IEpos=strpos($ua,'MSIE ');
$isIE=$IEpos!==FALSE;
$IEver=$isIE?intval(substr($ua,$IEpos+5)):0;
$isOldIE=$isIE && $IEver<8;
$supportDataURI=$isKnown && (!$isOldIE);

echo '@charset "utf-8";'."\r\n";
readfile('9.css');
if ($isOldIE) readfile('ie.css');
if ($supportDataURI) readfile('data.css');
else readfile('images.css');

?>