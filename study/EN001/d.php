<?php
$u=isset($_SERVER['QUERY_STRING'])?$_SERVER['QUERY_STRING']:'';
if ($u==NULL || $u=='') { header('Location: ./'); exit; }
$referer=isset($_SERVER['HTTP_REFERER'])?strtolower($_SERVER['HTTP_REFERER']):'';
if ($referer==NULL || $referer=='' || strpos($referer,'yoursunny.com')===FALSE) { header('Location: ./'); exit; }
$fp=fopen(date('Ym').'.txt','a');
fwrite($fp,$_SERVER['REMOTE_ADDR'].date(' Ymd ').$u."\r\n");
fclose($fp);
header('Location: http://yoursunny.com:81/study/EN001/'.$u);
?>