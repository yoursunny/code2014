<?php
ini_set('display_errors',1);
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
load_xiaonei();
load_dbMySQL('say100_');
//ob_start();
//phpinfo(INFO_VARIABLES);
//file_put_contents('phpinfo.htm',ob_get_clean());
define('APP_CANVAS','http://apps.xiaonei.com/say-it-to');
define('APP_ALIAS','say-it-to');
define('APP_SERVER','http://www.65536.cn/work/2009/say100');
$session_key=$_POST['xn_sig_session_key'];
define('xiaonei_APPID','4cfed29884da4864a74ce38c19cc1a41');
define('xiaonei_SECRET','37b35e24348346179a6a4e5e2f0c6505');

function redirect($u='') {
	ob_end_clean();
	echo '<xn:redirect url="'.APP_CANVAS.$u.'"/>';
	exit;
}
function appstat($k) {
	//echo '<xn:iframe src="'.APP_SERVER.'/xiaonei.htm?'.$k.'" width="1" height="1" addxnsig="false" frameborder="0" scrolling="no"/>';
}

ob_start();
switch ($path_info=''.@$_SERVER['PATH_INFO']) {
	case '':
		include 'xnml-home.php';
		break;
	case '/post':
		include 'xnml-post.php';
		break;
	case '/send':
		include 'xnml-send.php';
		break;
	default:
		if (preg_match('/^\/(\d+)\/(\d+)$/',$path_info)) include 'xnml-view.php';
		else redirect();
		break;
}
$xnml=ob_get_clean();
file_put_contents('1',$xnml);
echo '<xn:title text="用100种语言说"/>'."\r\n";
echo <<<EOT
<style type="text/css">
h1 { font-size:20px; }
.title { font-size:150%; color:#f60; }
.ti { width:400px; height:30px; font-size:20px; line-height:30px; }
.btn { height:30px; font-size:20px; }
h2 { font-size:18px; }
dl.msg { clear:both; line-height:20px; }
dl.msg dt.text { font-size:13px; clear:both; }
dl.msg dt.text a,dl.msg dt.text a:hover { color:#66f; }
dl.msg dd.time,dl.msg dd.read { font-size:10px; color:#888; float:left; margin-right:10px; }
dl.msg dd.sender { font-size:10px; color:#444; }
span.text { color:#66f; }
ul { list-style:square; font-size:14px; line-height:20px; }
</style>
EOT;
echo '<div style="width:700px;min-height:400px;padding:30px;font-size:20px;line-height:30px;">'."\r\n";
echo $xnml;
echo "\r\n".'</div>';
?>