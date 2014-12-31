<?php
if (@$_GET['p']=='teaching') {
	header('Location: /study/MU019/?p=index');
	header('HTTP/1.1 301 GO');
	exit;
}
include '../include/course.php';
?>