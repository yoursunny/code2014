<?php
require 'IP_IS2005.php';

$ip=isset($_SERVER['HTTP_X_FORWARDED_FOR'])?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR'];

if (isset($IP_IS2005[$ip])) {
	$d=$IP_IS2005[$ip];
	echo '本站已经被'.$d[1].'攻破，拨打电话'.$d[0].'了解黑站方法！';
} else {
	echo 'Hacked by '.$ip.', 本站已经被黑！';
}

?>
