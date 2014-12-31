<?php
if (strpos($_SERVER['SCRIPT_NAME'],'/study/GPA/')===FALSE) {
	header('Location: http://yoursunny.com/study/GPA/');
	header('HTTP/1.1 301');
	exit;
}

readfile('index2010.htm');
?>