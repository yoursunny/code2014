<?php
//put some data to a session file
require_once 'config.php';
$sid=@$_GET['sid'];
if (!is_sid($sid)) die('invalid sid');
$txtfile=getfilename($sid);

if (!file_exists($txtfile)) die('unknown sid');

$data=str_replace(array("\r","\n"),array('',"\r\n"),$_POST['data']."\n");
file_put_contents($txtfile,$data,FILE_APPEND);

header('Content-Type: text/plain');
?>