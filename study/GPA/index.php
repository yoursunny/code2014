<?php
if (!strpos($_SERVER['SCRIPT_NAME'],'/GPA/')) {
	header('Location: http://yoursunny.com/study/GPA/');
	exit;
}
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
page_cache(7200);

if (is_mobile()) {
	header('Content-Type: text/vnd.wap.wml');
	readfile('wap.wml');
} else {
	page_gzip();
	readfile('index-n.htm');
}
?>