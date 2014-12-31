<?php
header('Content-Type: text/javascript');
header('Cache-Control: max-age=3600');
//header('Cache-Control: max-age=0');

function check_name($s) {
	return preg_match('/^[\w\.]+$/',$s);
}
function jquery_plugin($f) {
	$js=file_get_contents($f);
	echo '(function(jQuery){'."\r\n\r\n".$js."\r\n\r\n".'})(window.backuplet.$);';
}

if (isset($_GET['h'])) {//hostname-specific script
	$host=$_GET['h'];
	if (check_name($host) && file_exists('../host/2010/'.$host.'.js')) {
		readfile('../host/2010/'.$host.'.js');
	} else {
		readfile('../lib/2010/not-supported.js');
	}
} elseif (isset($_GET['i'])) {//include file
	$inc=$_GET['i'];
	if (check_name($inc) && file_exists('../lib/2010/'.$inc.'.js')) {
		if (substr($inc,0,7)=='jquery-') {
			jquery_plugin('../lib/2010/'.$inc.'.js');
		} else {
			readfile('../lib/2010/'.$inc.'.js');
		}
	}
} else {//bootstrap
	readfile('../lib/2010/bootstrap.js');
}

?>