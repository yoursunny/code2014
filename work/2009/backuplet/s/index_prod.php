<?php
header('Content-Type: text/javascript');
header('Cache-Control: max-age=3600');
//header('Cache-Control: max-age=0');

function check_name($s) {
	return preg_match('/^[\w\.]+$/',$s);
}
function jquery_plugin($f) {
	$js=file_get_contents($f);
	$js='(function(jQuery){'."\r\n\r\n".$js."\r\n\r\n".'})(window.backuplet.$);';
}

if (isset($_GET['h'])) {//hostname-specific script
	$host=$_GET['h'];
	if (check_name($host) && file_exists('../host/'.$host.'.js')) {
		if (isset($_GET['p'])) {
			$part=$_GET['p'];
			if (check_name($part) && file_exists('../host/'.$host.'_'.$part.'.js')) {
				readfile('../host/'.$host.'_'.$part.'.js');
			}
		} else {
			readfile('../host/'.$host.'.js');
		}
	} else {
		readfile('../not-supported.js');
	}
} elseif (isset($_GET['i'])) {//include file
	switch ($_GET['i']) {
		case 'jquery-json': jquery_plugin('../include/jquery.json-1.3.min.js'); break;
		case 'jquery-cookie': jquery_plugin('../include/jquery.cookie.min.js'); break;
		case 'microblog': readfile('../include/microblog.js'); break;
		case 'blog': readfile('../include/blog.js'); break;
	}
} else {//bootstrap
	readfile('../bootstrap.js');
}
if (isset($_GET['cb'])) {//callback
	$cb=$_GET['cb'];
	if (check_name($cb)) {
		echo "\r\n".'backuplet.'.$cb.'();';
	}
}

?>