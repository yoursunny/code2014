<?php
ini_set('display_errors',1);
error_reporting(E_ALL);

if ($_SERVER['SERVER_NAME']=='yoursunny.cn')
{
	header('Location: w/');
	exit;
}


require_once 'h/func.php';

header('Content-Type:text/html;charset=utf-8');

if (!file_exists('h/cache.htm') || time()-filemtime('h/cache.htm')>3600)
{//cache expired, generate page from original feeds
	$s=file_get_contents('home.htm');
	$notice=getNotice();
	$s=str_replace('%notice%',$notice['content'],$s);
	$s=str_replace('%noticedate%',$notice['date'],$s);	
	$s=str_replace('%schedule%',getSchedule(),$s);
	//$s=str_replace('%blog%',parseAtom('http://feeds.feedburner.com/sunnyPower?format=xml',5,NULL),$s);
	//$s=str_replace('%blog%',parseAtom('http://feed.feedsky.com/sunnyPower',5,NULL),$s);
	//$s=str_replace('%blog%',parseAtom('h/feedcache.blog.xml',5,NULL),$s);
	//$s=str_replace('%blog%',parseFeedSkyJSON('sunnyPower',5,NULL),$s);
	//$s=str_replace('%blog%','<dd>暂时不可用，请谅解</dd>',$s);
	//$s=str_replace('%tech%',parseAtom('http://feeds.feedburner.com/65536?format=xml',6,NULL),$s);
	//$s=str_replace('%tech%',parseAtom('http://feed.feedsky.com/65536',6,NULL),$s);
	//$s=str_replace('%tech%',parseAtom('http://www.65536.cn/t/wp-atom.php',6,NULL),$s);
	//$s=str_replace('%tech%',parseFeedSkyJSON('65536',6,NULL),$s);
	//$s=str_replace('%tech%','<dd>暂时不可用，请谅解</dd>',$s);
	//$s=str_replace('%threads%',parseAtom('http://feeds.feedburner.com/threads?format=xml',6,NULL),$s);
	//$s=str_replace('%threads%',parseAtom('http://feed.feedsky.com/threads',6,NULL),$s);
	//$s=str_replace('%threads%',parseAtom('h/feedcache.threads.xml',6,NULL),$s);
	//$s=str_replace('%threads%',parseFeedSkyJSON('threads',6,NULL),$s);
	//$s=str_replace('%threads%','<dd>暂时不可用，请谅解</dd>',$s);
	$s=str_replace('%study%',parseText('h/list.study.txt',6,'study'),$s);
	$s=str_replace('%ent%',parseText('h/list.ent.txt',6,'ent'),$s);
	$s=str_replace('%resource%',parseText('h/list.resource.txt',6,'resource'),$s);
	$song=randomSong();
	if ($song!==FALSE)
	{
		$s=str_replace(array('%song_title%','%song_artist%','%song_uri%','%song_lyric%'),array(htmlspecialchars($song['title']),htmlspecialchars($song['artist']),$song['uri'],nl2br(htmlspecialchars($song['lyric']))),$s);
	}
	else
	{
		$s=str_replace(array('%song_title%','%song_artist%','%song_uri%','%song_lyric%'),array('暂无歌曲','','',''),$s);
	}
	file_put_contents('h/cache.htm',$s);
	echo $s;
}
else
{//output cached page
	readfile('h/cache.htm');
}
?>