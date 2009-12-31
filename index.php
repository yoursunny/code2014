<?php
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
//define('DISABLE_CACHE',TRUE);//for test
define('DISABLE_CACHE',FALSE);//for production

function PrepareFeeds(&$feeds,$download_limit) {
	$cache_dir='lib/home.cache/';
	$require_download=array();
	$need_download=array();
	$now=time();
	$changed=FALSE;
	foreach ($feeds as $key=>$o) {//决定需要重新下载的feed
		$cache_file=$cache_dir.$key.'.cache';
		if (!file_exists($cache_file)) {
			$require_download[]=$key;
		} else if ($now-filemtime($cache_file)>$o['ttl']) {
			$need_download[$key]=($now-filemtime($cache_file))/$o['ttl'];
		}
	}
	foreach ($require_download as $key)
	{
		$cache_file=$cache_dir.$key.'.cache';
		--$download_limit;//缓存文件不存在，不管限额、必须下载
		$content=@file_get_contents($feeds[$key]['url']);
		if ($content!==FALSE) {
			$param=$feeds[$key]['param'];
			array_unshift($param,$content);
			$content=call_user_func_array($feeds[$key]['format'],$param);
			$feeds[$key]['content']=$content;
			file_put_contents($cache_file,$content);
			$changed=TRUE;
		}
	}
	arsort($need_download);//根据(缓存时长÷ttl)降序排列，优先下载过期较长的feed
	foreach ($need_download as $key=>$priority)
	{
		$cache_file=$cache_dir.$key.'.cache';
		if (--$download_limit>=0) {//根据限额下载
			$content=@file_get_contents($feeds[$key]['url']);
			if ($content!==FALSE) {
				$param=$feeds[$key]['param'];
				array_unshift($param,$content);
				$content=call_user_func_array($feeds[$key]['format'],$param);
				$feeds[$key]['content']=$content;
				file_put_contents($cache_file,$content);
				$changed=TRUE;
			}
		}
	}
	foreach ($feeds as $key=>$o) {//读出所有未下载过的缓存
		if (!array_key_exists('content',$o)) {
			$cache_file=$cache_dir.$key.'.cache';
			if (file_exists($cache_file)) {
				$feeds[$key]['content']=file_get_contents($cache_file);
			} else {
				$feeds[$key]['content']=$o['failure'];
			}
		}
	}
	return $changed;
}
function FeedDate($d) {//convert YYYYmmdd to YYYY-mm-ddT00:00:00Z
	return substr($d,0,4).'-'.substr($d,4,2).'-'.substr($d,6,2).'T00:00:00Z';
}
function urlforward($u) {
	header('Location: '.$u);
}

switch (strtolower($_SERVER['SERVER_NAME']))
{
	case 'yoursunny.com':
	case 'your.sunny':
	case 'your9.sunny':
		page_cache();
		include 'yoursunny_index.php';
		break;
	case 'www.65536.cn':
	case '65536.sunny':
		page_cache();
		include '65536_index.php';
		break;
	case 'm.yoursunny.com':
		urlforward('http://yoursunny.com/m/');
		break;
	case 'study.yoursunny.com':
		urlforward('http://yoursunny.com/study/');
		break;
	case 'g172.yoursunny.com':
		urlforward('http://yoursunny.com/study/GRE/G172.htm');
		break;
	default:
		break;
}
?>