<?php
$u=isset($_SERVER['QUERY_STRING'])?$_SERVER['QUERY_STRING']:'';
if ($u==NULL || $u=='') { header('Location: ./'); exit; }
$referer=isset($_SERVER['HTTP_REFERER'])?strtolower($_SERVER['HTTP_REFERER']):'';
if ($referer==NULL || $referer=='' || strpos($referer,'yoursunny.com')===FALSE) { header('Location: ./'); exit; }
$fp=fopen('luck_'.date('Ym').'.txt','a');
fwrite($fp,$_SERVER['REMOTE_ADDR'].date(' Ymd ').$u."\r\n");
fclose($fp);
header('HTTP/1.0 301 go to luck\'s server');
header('Location: http://listening.binvor.com/mp3/ysjj/lookonluck_spaces_live_com_'.$u);
?>