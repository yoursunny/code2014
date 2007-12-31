<?php
if (!isset($_GET['a'])) { header('HTTP/1.0 301 Feed'); header('Location: feed.php?a=atom'); exit; }
header('Content-type: text/xml');
switch ($_GET['a'])
{
	case 'atom':
		echo str_replace(array('http://listen.yoursunny.com/program_list','http://listen.yoursunny.com/program/','http://listen.yoursunny.com/file/'),array('http://listen.yoursunny.com/','http://yoursunny.com/listen/?','http://yoursunny.com:81/listen/'),file_get_contents('feed.xml'));
		break;
	case 'all':
		readfile('feed.xml');
		break;
}
?>