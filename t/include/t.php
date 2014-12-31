<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013.php';

if (!preg_match('/\/t\/([0-9]{4})\/([a-zA-Z0-9\-\_]+)\//', $_SERVER['REQUEST_URI'], $m)) {
	header('HTTP/1.1 404');
	exit;
}
list($canonical,$t_year,$t_key) = $m;

if (file_exists('a2012.meta') && file_exists('a2012.md')) {
	include 'a2012.php';
}
if (file_exists('a10.htm')) {
	include 'a10.php';
}
if (file_exists($t_key.'.article.htm')) {
	include 'a9.php';
}

?>
