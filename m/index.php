<?php
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
page_cache();

$h=strtolower($_SERVER['HTTP_HOST']);
if ($h!='yoursunny.com' && $h!='your9.sunny')
{
	header('HTTP/1.1 404 Not Found');
	die;
}
readfile('index-n.htm');
?>