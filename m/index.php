<?php
header('Cache-Control: max-age=7200');
if (strtolower($_SERVER['HTTP_HOST'])!='yoursunny.com')
{
	header('HTTP/1.1 404 Not Found');
	die;
}
readfile('index-n.htm');
?>