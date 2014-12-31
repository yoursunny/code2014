<?php
if (isset($_GET['sid'])) {
	$sid=$_GET['sid'];
	if (@$_GET['v']=='2010') {
		header('Location: save2010/result.php?sid='.$sid);
	} else {
		header('Location: save/result.php?sid='.$sid);
	}
	exit;
}
if (isset($_GET['schema'])) {
	header('Content-Type: text/plain');
	echo 'This URI represents a namespace used by backuplet.';
	exit;
}

$p=''.@$_GET['p'];
switch ($p) {
	case '':
		header('Location: http://yoursunny.cn/p/backuplet/');
		break;
	case 'renren':
		header('Location: /p/backuplet/backup/renren/');
		header('HTTP/1.1 301');
		break;
	case 'digu':
		header('Location: /p/backuplet/backup/digu/');
		header('HTTP/1.1 301');
		break;
	case 'twitter':
		header('Location: /p/backuplet/backup/tuite/');
		header('HTTP/1.1 301');
		break;
	case 'fanfou':
		header('Location: /p/backuplet/backup/fanfou/');
		header('HTTP/1.1 301');
		break;
	case 'tsina':
		header('Location: /p/backuplet/backup/weibo/');
		header('HTTP/1.1 301');
		break;
	case 'tqq':
		header('Location: /p/backuplet/backup/tencent/');
		header('HTTP/1.1 301');
		break;
	case 't163':
		header('Location: /p/backuplet/backup/163/');
		header('HTTP/1.1 301');
		break;
	default:
		include '../include/work.php';
		break;
}
?>
