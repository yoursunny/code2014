<?php
require_once 'common.php';
if (@$_GET['logout']=='1') {
	setcookie(COOKIE_AUTH);
	header('Location: http://yoursunny.com/lib/liveid/?service=logout&continue='.urlencode(APP_ROOT.'/'));
	exit;
}
if ($_GET['login']=='guest') {
	$serial=dechex(mt_rand());
	setcookie(COOKIE_AUTH,'guest|'.$serial.'|'.sha1(AUTH_KEY.'|guest|'.$serial));
	header('Location: ./');
	exit;
}
if (!isset($_GET['serial'])) {
	$serial=dechex(mt_rand());
	setcookie(COOKIE_AUTH,'-|'.$serial.'|'.sha1(AUTH_KEY.'|login|'.$serial));
	header('Location: http://yoursunny.com/lib/liveid/?service=PhoneBook&serial='.$serial.'&continue='.urlencode(APP_ROOT.'/liveid.php'));
} else {
	$a=explode('|',@$_COOKIE[COOKIE_AUTH]);
	if (count($a)!=3
		|| @$_GET['serial']!=$a[1]
		|| $a[2]!=sha1(AUTH_KEY.'|login|'.$a[1])
		|| @$_GET['hash']!=md5(AUTH_KEY.'|'.$a[1].'|'.$_GET['guid']))
		{ header('Location: liveid.php'); die; }
	setcookie(COOKIE_AUTH,$_GET['guid'].'|'.$a[1].'|'.sha1(AUTH_KEY.'|'.$_GET['guid'].'|'.$a[1]));
	header('Location: ./');
}
?>