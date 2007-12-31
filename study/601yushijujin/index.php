<?php
$fp=fopen('log.txt','a');
fwrite($fp,$_SERVER['REMOTE_ADDR'].date(' Ymd')."\r\n");
fclose($fp);
header('HTTP/1.0 301 NHCE page removed');
header('Location: http://yoursunny.com/study/EN001/');
?>