<?php
require_once 'config.php';
$sid=$_GET['sid'];
$xsl=$_GET['xsl'];
if (!is_sid($sid)) die('invalid sid');
$txtfile=getfilename($sid);
if (!file_exists($txtfile)) die('unknown sid');

$fp=fopen($txtfile,'r');
parse_str(trim(fgets($fp)),$feed);
fclose($fp);

function goxslt($xslt) {
	global $sid;
	header('Location: http://n.65536.cn/yoursunny/backuplet/xslt.ashx?xsl='.$xslt.'&sid='.$sid);
	exit;
}

if ($xsl=='html' && isset($feed['microblog:'])) goxslt('microblog_html');
//if (isset($feed['blog:'])) goxslt('not-supported');
echo 'not supported';
?>