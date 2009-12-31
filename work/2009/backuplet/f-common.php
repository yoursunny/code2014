<?php
function backuplet_init() {
	date_default_timezone_set('Asia/Shanghai');
	$sid=$_GET['sid'];
	if (!preg_match('/^[\w\.]+$/',$sid)) die('invalid sid');
	if (!file_exists('userdata/'.$sid.'.txt')) die('unknown sid');
	//header('Content-Type: application/octet-stream');
	//header('Content-Disposition: attachment; filename='.$sid.'.htm');
}
function backuplet_datalines($cb) {
	foreach (file('userdata/'.$_GET['sid'].'.txt') as $l) {
		parse_str($l,$o);
		$cb($o);
	}
}
?>