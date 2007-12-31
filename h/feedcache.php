<?php
error_reporting(E_ALL);
set_time_limit(300);
ini_set('display_errors',1);
function feedcache_update($url,$file)
{
	if (!file_exists('feedcache.'.$file.'.xml') || filemtime('feedcache.'.$file.'.xml')<time()-3600)
	{
		copy($url,'feedcache.'.$file.'.xml');
	}
}
feedcache_update('http://feed.feedsky.com/sunnyPower','blog');
feedcache_update('http://feed.feedsky.com/threads','threads');
unlink('cache.htm');
echo 'OK';
?>