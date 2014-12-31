<?php
$isprod=file_exists('./prod');
header('Content-Type: text/javascript');
if ($isprod) header('Cache-Control: max-age=3600');
else header('Cache-Control: max-age=0');
define('MODULE_CACHE','../../../_cache/backuplet_module');

function check_name($s) {
	return preg_match('/^[\w\.]+$/',$s);
}
function replace_include($match) {
	return file_get_contents('../lib/'.$match[1].'.js');
}
function module_compile($f) {
	$js=file_get_contents($f);
	$b=<<<EOT
//backuplet
//Copyright 2011 yoursunny.com
//http://yoursunny.com/work/backuplet/
(function(B){
var $=B?B.$:null;

EOT;
	$b.=preg_replace_callback('/\/\*\#include[\s]+([\w\.]+)[\s]*\*\//','replace_include',$js);
	$b.=<<<EOT

B.proceed();
})(window.backuplet);
EOT;
	return $b;
}
function closure_compiler($js) {
	$ch=@curl_init('http://closure-compiler.appspot.com/compile');
	if ($ch===FALSE) return FALSE;
	curl_setopt($ch,CURLOPT_POST,1);
	curl_setopt($ch,CURLOPT_POSTFIELDS,'js_code='.urlencode($js).'&output_info=compiled_code');
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	$compiled=@curl_exec($ch);
	curl_close($ch);
	return $compiled;
}
function module($f) {
	global $isprod;
	if ($isprod) {
		$cachefile=MODULE_CACHE.'/'.sha1($f);
		if (file_exists($cachefile) && filemtime($cachefile)>filemtime($f)) readfile($cachefile);
		else {
			$js=module_compile($f);
			$compiled=closure_compiler($js);
			if ($compiled===FALSE) {
				echo $js;
			} else {
				file_put_contents($cachefile,$compiled);
				echo $compiled;
			}
		}
	} else {
		echo module_compile($f);
	}
}

if (isset($_GET['h'])) {//hostname-specific script
	$host=$_GET['h'];
	if (check_name($host) && file_exists('../host/'.$host.'.js')) {
		module('../host/'.$host.'.js');
	} elseif (check_name($host) && file_exists('../host/2010/'.$host.'.js')) {
		module('../lib/2010.js');
	} else {
		module('../lib/not-supported.js');
	}
} elseif (isset($_GET['i'])) {//include file
	$inc=$_GET['i'];
	if (check_name($inc) && file_exists('../lib/'.$inc.'.js')) {
		module('../lib/'.$inc.'.js');
	}
} else {//bootstrap
	if (@$_GET['v']=='2011') module('../lib/bootstrap.js');
	else header('Location: /p/backuplet/s/');
}

?>