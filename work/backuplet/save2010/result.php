<?php
require_once 'config.php';
$sid=@$_GET['sid'];
$txtfile=getfilename($sid);

if (is_sid($sid) && file_exists($txtfile)) {
	header('Location: http://yoursunny.com/work/backuplet/?p=save#'.$sid.'/2010');
} else {
	header('Location: http://yoursunny.com/work/backuplet/?p=expired#'.$sid);
}
?>