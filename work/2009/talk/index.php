<?php
header('Content-Type: text/javascript');
header('Cache-Control: max-age=0');
$f=@$_SERVER['QUERY_STRING'];
readfile($f);
?>