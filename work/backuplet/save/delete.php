<?php
//delete session file
require_once 'config.php';
$sid=@$_GET['sid'];
if (!is_sid($sid)) die('invalid sid');
$txtfile=getfilename($sid);

header('Content-Type: text/plain');
if (!file_exists($txtfile)) die('unknown sid');
unlink($txtfile);
echo 'DELETED '.$sid;

?>