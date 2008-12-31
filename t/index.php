<?php
if ($_SERVER['QUERY_STRING']=='')
{
	header('Location: ../');
	exit;
}
if (!isset($_GET['p']))
{
	if (isset($_GET['feed'])) go('http://feed.feedsky.com/65536');
	else no();
}
switch ($_GET['p'])
{
	case 14: go('2007/google-ad.htm'); break;
	case 31: go('2007/webdesign.htm'); break;
	case 56: go('2007/pki-encrypt.htm'); break;
	case 57: go('2007/cert-mail.htm'); break;
	case 58: go('2007/selfssl.htm'); break;
	case 66: go('2007/Net-intro.htm'); break;
	default: no(); break;
}

function go($u)
{
	file_put_contents('wordpress.txt',date('Y-m-d H:i:s ').$_SERVER['REMOTE_ADDR'].' '.$_SERVER['REQUEST_URI'].' '.@$_SERVER['HTTP_REFERER']." 301\r\n");
	header('Location: '.$u);
	header('HTTP/1.1 301 WordPress no longer used');
	exit;
}
function no()
{
	file_put_contents('wordpress.txt',date('Y-m-d H:i:s ').$_SERVER['REMOTE_ADDR'].' '.$_SERVER['REQUEST_URI'].' '.@$_SERVER['HTTP_REFERER']." 410\r\n");
	header('HTTP/1.1 410 Post not found');
	echo 'Post not found';
	exit;
}
?>