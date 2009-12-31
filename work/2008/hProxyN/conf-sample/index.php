<?php
$f=$_GET['f'];
if (!preg_match('/^[\w-]+$/',$f) || !file_exists($f.'.config')) {
	header('404 Not Found');
	exit;
}
header('Content-Type: text/xml');
header('Content-Disposition: attachment; filename='.$f.'.config');
readfile($f.'.config');
?>