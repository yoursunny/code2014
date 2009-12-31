<?php
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
$gv=load_GoogleVoice();
$number=$_POST['to'];
$count=0;

function sms($content) {
	global $gv,$number,$count;
	$gv->sms($number,$content);
	++$count;
}

if (@$_POST['c1']=='1') sms('sunny boy  Voice Mail:+1(804)457-8669 Cellphone:+86 15900941215');
if (@$_POST['c2']=='1') sms('sunny boy  Email: yoursunny.com+'.substr(date('Ymd'),3).'@Gmail.com');
if (@$_POST['c3']=='1') sms('sunny boy  http://yoursunny.com/  http://www.65536.cn/');
if (@$_POST['c4']=='1') sms('sunny boy  WL: sunny@yoursunny.com  Fetion:661134847');

header('Content-Type: text/javascript');
?>
alert('<?php echo $count ?>条短信发送成功，请查收。\n发送号码为+1(661)776-5536');