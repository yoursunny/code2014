<?php
/*
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
*/

function is_mobile() {//判断是否手机访问
	$m=@$_GET['_mobile'];
	if ($m==='1') return TRUE;
	if ($m==='0') return FALSE;
	if (!headers_sent()) header('Vary: Accept');
	if (isset($_SERVER['HTTP_ACCEPT'])) {
		$a=$_SERVER['HTTP_ACCEPT'];
		$w=strpos($a,'vnd.wap.wml');
		$h=strpos($a,'text/html');
		//手机访问——支持wml，且[不支持html]或[wml优先于html]
		if ($w!==FALSE && ($h===FALSE || $w<$h)) return TRUE;
	}
	if (isset($_SERVER['HTTP_USER_AGENT'])) {
		$ua=$_SERVER['HTTP_USER_AGENT'];
		if (preg_match('/(nokia|sonyericsson|blackberry|samsung|sec\-|windows ce|motorola|mot\-|up.b|midp\-)/i',$ua)) return TRUE;
	}
	return FALSE;
}

function page_cache($sec=86400) {//设置cache头
	header('Cache-Control: max-age='.$sec);
}

function page_gzip() {//开启gzip（即使没有Accept-Encoding头）
	if (!isset($_SERVER['HTTP_USER_AGENT'])) return;
	$ua=$_SERVER['HTTP_USER_AGENT'];
	if (strpos($ua,'Firefox') || strpos($ua,'MSIE') || strpos($ua,'Opera') || strpos($ua,'WebKit')) {
		header('Content-Encoding: gzip');
		ob_start('gzencode');
	}
}

function timea() {//获取精确时间
	date_default_timezone_set('Asia/Shanghai');
	$diff_file=$_SERVER["DOCUMENT_ROOT"].'/lib/9/time.diff';
	$diff=0;
	if (!file_exists($diff_file) || filemtime($diff_file)<time()-86400) {
		$before=time();
		$xt=file_get_contents('http://www.time.ac.cn/timeflash.asp?user=flash');
		$after=time();
		$local=($before+$after)/2;
		$x=simplexml_load_string($xt);
		$remote=mktime(strval($x->time->hour),strval($x->time->minite),strval($x->time->second),strval($x->time->month),strval($x->time->day),strval($x->time->year));
		$diff=$remote-$local;
		file_put_contents($diff_file,$diff);
	} else {
		$diff=file_get_contents($diff_file);
	}
	return time()+$diff;
}


//载入功能库

function load_nusoap() {//SOAP服务
	include_once $_SERVER["DOCUMENT_ROOT"].'/lib/9/nusoap/nusoap.php';
}
function load_reCAPTCHA() {//reCAPTCHA验证码
	include_once $_SERVER["DOCUMENT_ROOT"].'/lib/9/reCAPTCHA.php';
}
function load_xiaonei() {//校内网API
	include_once $_SERVER["DOCUMENT_ROOT"].'/lib/9/xiaonei.php';
}
function load_dbMySQL($prefix='') {//MySQL数据源
	global $db;
	include_once $_SERVER["DOCUMENT_ROOT"].'/lib/9/dbMySQL.php';
	$server=strpos($_SERVER['SERVER_NAME'],'.sunny')===FALSE?'203.171.235.75':'localhost';
	$db=new dbMySQL($server,'a0113165307','41744948','a0113165307',$prefix,FALSE);
}
function load_badwords() {//脏话过滤
	include_once $_SERVER["DOCUMENT_ROOT"].'/lib/9/badwords.php';
}
function load_GoogleVoice() {
	include_once $_SERVER["DOCUMENT_ROOT"].'/lib/9/class.googlevoice.php';
	return new GoogleVoice('sms@yoursunny.com','ZM3T.AbQbtmR66M7');
}

?>