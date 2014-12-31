<?php
date_default_timezone_set('Asia/Shanghai');
define('USERDATA_DIR','../../../_cache/backuplet_userdata/');

function is_sid($sid) {
	return preg_match('/^[\w\.]+$/',$sid);
}

function getfilename($sid,$ext='.txt') {
	$ip=@$_GET['ip'];
	if (!$ip) $ip=$_SERVER['REMOTE_ADDR'];
	$subnetC=floor(ip2long($ip)/256);
	$filename=USERDATA_DIR.'2010_'.$sid.'~'.$subnetC.$ext;
	return $filename;
}

?>