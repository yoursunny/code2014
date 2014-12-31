<?php
date_default_timezone_set('America/Phoenix');

define('CACHEPATH',__DIR__.'/../../_cache/uaopen/');
$cached_memcache = array();
function cached($key,$func,$expires=3600) {
	//no file cache for key beginning with '-'
	global $cached_memcache;
	if (isset($cached_memcache[$key])) return $cached_memcache[$key];
	$cachefile = CACHEPATH.$key.'.serialize';
	if (file_exists($cachefile) && filemtime($cachefile)>=max(strtotime('00:00'),time()-$expires)) return $cached_memcache[$key] = unserialize(file_get_contents($cachefile));
	$value = $func();
	if ($value===FALSE) {//creating fail, use old data
		if (file_exists($cachefile)) return $cached_memcache[$key] = unserialize(file_get_contents($cachefile));
	}
	if ($key[0]!='-') file_put_contents($cachefile,serialize($value));
	return $cached_memcache[$key] = $value;
}

function cache_remove($key) {
	global $cached_memcache;
	unset($cached_memcache[$key]);
	$cachefile = CACHEPATH.$key.'.serialize';
	if (file_exists($cachefile)) unlink($cachefile);
}


function url_load($url,$postbody=FALSE) {
	$ch = curl_init($url);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	//curl_setopt($ch,CURLOPT_PROXY,'10.0.2.2:8888');
	curl_setopt($ch,CURLOPT_HTTPHEADER,array(
		'User-Agent: UAOPEN/20120903 http://yoursunny.com/p/uaopen/'
	));
	if ($postbody!==FALSE) {
		curl_setopt($ch,CURLOPT_POST,1);
		curl_setopt($ch,CURLOPT_POSTFIELDS,$postbody);
	}
	$body = curl_exec($ch);
	curl_close($ch);
	return $body;
}

function cached_load($key,$url,$expires=3600,$postbody=FALSE) {
return cached($key,function()use($url,$postbody){
	return url_load($url,$postbody);
},$expires);}

?>
