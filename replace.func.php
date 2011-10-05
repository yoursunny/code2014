<?php
# https://yoursunny.com/p/qqwry/
require 'qqwry.lib.php';
define('qqwry_replace_pattern','/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/');

$qqwry_replace_results=array();
$qqwry_replace_format='';

function qqwry_replace_ip($match) {
	global $qqwry_replace_results,$qqwry_replace_format;
	$ip=$match[0];
	$record=@$qqwry_replace_results[ip2long($ip)];
	if (!$record) return $ip;
	$c=$record->get_c();
	$a=$record->get_a();
	return str_replace(array('$ip','$c','$a'),array($ip,$c,$a),$qqwry_replace_format);
}

function qqwry_replace($contents,$format) {
	global $qqwry_replace_results,$qqwry_replace_format;
	$qqwry_replace_format=$format;
	$qqwry=new QQWRY;

	$matches=array();
	preg_match_all(qqwry_replace_pattern,$contents,$matches);
	$ip_arr=array();
	for ($i=0;$i<count($matches[0]);++$i) {
		$ip=ip2long($matches[0][$i]);
		if ($ip!==FALSE) $ip_arr[]=$ip;
	}

	$qqwry_replace_results=$qqwry->query($ip_arr);

	return preg_replace_callback(qqwry_replace_pattern,'qqwry_replace_ip',$contents);
}
?>