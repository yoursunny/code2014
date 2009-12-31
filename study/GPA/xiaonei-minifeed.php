<?php
if (@$_COOKIE['GPA_xiaonei_minifeed']=='done') exit;
setcookie('GPA_xiaonei_minifeed','done');

require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
load_xiaonei();
$session_key=$_POST['xn_sig_session_key'];
define('xiaonei_APPID','6b98d329f4694fb792743090cbb9fc76');
define('xiaonei_SECRET','c2023284724a4563b168f329d64e3273');

xiaonei_api('xiaonei.feed.publishTemplatizedAction',array('template_id'=>1));
?>