<?php
//start a backuplet save session
require_once 'config.php';
$cb=@$_GET['cb'];
if (!preg_match('/^[\w\.]+$/',$cb)) die('invalid callback');

$sid=time().'_'.mt_rand();
$txtfile=getfilename($sid);
touch($txtfile);

header('Content-Type: text/javascript');
echo $cb.'("'.$sid.'");';

include_once 'cleanup.php';
?>