<?php
/*
require_once $_SERVER["DOCUMENT_ROOT"].'/include/10.php';
*/

function is_mobile($empty_UA_result=FALSE) {//determine whether UA is a mobile device
	$m=@$_GET['_mobile'];
	if ($m==='1') return TRUE;
	if ($m==='0') return FALSE;
	if (!headers_sent()) header('Vary: Accept User-Agent');
	if (isset($_SERVER['HTTP_ACCEPT'])) {
		$a=$_SERVER['HTTP_ACCEPT'];
		$w=strpos($a,'vnd.wap.wml');
		$h=strpos($a,'text/html');
		if ($w!==FALSE && ($h===FALSE || $w<$h)) return TRUE;
	}
	if (!isset($_SERVER['HTTP_USER_AGENT']) || $_SERVER['HTTP_USER_AGENT']=='') return $empty_UA_result;
	$ua=$_SERVER['HTTP_USER_AGENT'];
	if (preg_match('/(nokia|sonyericsson|blackberry|samsung|sec\-|windows ce|motorola|mot\-|up.b|midp|mobile\-|\-mobile)/i',$ua)) return TRUE;
	return FALSE;
}


?>