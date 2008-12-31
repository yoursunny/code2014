<?php
//NAT信息收集
$ip1=$_GET['ip1'];//appspot
$ip2=$_GET['ip2'];//CT
$ip3=$_SERVER['REMOTE_ADDR'];//CNC
if ($ip1!=$ip2 || $ip1!=$ip3 || $ip2!=$ip3) {
	file_put_contents('NAT.txt',date('Y-m-d H:i:s ').$ip1.' '.$ip2.' '.$ip3."\r\n",FILE_APPEND);
}
header('Content-Type: text/javascript');
?>
//NAT信息收集
//本脚本只收集NAT网络地址转换信息，不收集任何隐私信息
var NAT_collect_done=1;