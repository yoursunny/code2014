<?php
header('Content-Type: text/javascript');
//header('Cache-Control: max-age=3600');
header('Cache-Control: max-age=0');

function check_name($s) {
	return preg_match('/^[\w\.]+$/',$s);
}

if (isset($_GET['i'])) {//include file
	$inc=$_GET['i'];
	if (check_name($inc)) readfile('../include/'.$inc.'.js');
} else {//bootstrap
	readfile('../bootstrap.js');
}
if (isset($_GET['cb'])) {//callback
	$cb=$_GET['cb'];
	if (check_name($cb)) {
		echo "\r\n".'yoursunnyJukuHelper.'.$cb.'();';
	}
}

?>