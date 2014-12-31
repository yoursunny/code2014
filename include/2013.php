<?php
/*
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013.php';
*/

class PageRenderHelper {
	public $domain = 'yoursunny.com';
	public $domain_static = 'static1.tk';
	public $local_domain = FALSE;
	public $cache_control = 'public, max-age=86400';
	public $lang = 'zh';
	public $canonical = FALSE;
	public $altlanglink = FALSE;

	public $head_css;
	public $head_js;
	public $bottom_js;
	
	function __construct() {
		$this->head_css = array(
			'//cdn.jsdelivr.net/bootstrap/2.3.2/css/bootstrap.min.css',
			'//cdn.jsdelivr.net/bootstrap/2.3.2/css/bootstrap-responsive.min.css',
			'/images/2013/style.css',
		);
		$this->head_js = array(
			'//cdn.jsdelivr.net/jquery/1.8.3/jquery-1.8.3.min.js',
			'//cdn.jsdelivr.net/bootstrap/2.3.2/js/bootstrap.min.js',
			'/lib/2013.js',
		);
		$this->bottom_js = array(
		);
	}
	public function staticfile($path) {
		if (strpos($path,'//')!==FALSE) return $path;
		return 'http://'.$this->domain_static.$path;
	}
	public function include_by_domain($template='index-%s.php') {
		//include $PR->include_by_domain();
		switch ($_SERVER['HTTP_HOST']) {
			case 'yoursunny.com':
			case 'local.yoursunny.com':
				return sprintf($template,'en');
			case 'yoursunny.cn':
			case 'local.yoursunny.cn':
				return sprintf($template,'zh');
			default:
				header('HTTP/1.1 404');
				die;
		}
	}
	
	public function altlang($langlink=TRUE) {
		$this->altlanglink = $langlink;
	}
	public function altlang_get($k=FALSE) {
		if ($k===FALSE) return $this->altlanglink && ($this->altlanglink!==TRUE || $this->canonical!==FALSE);
		switch ($k) {
			case 'code': return $this->lang=='en'?'en-us':'zh-cn';
			case 'name': return $this->lang=='en'?'English':'中文';
			case 'altcode': return $this->lang!='en'?'en-us':'zh-cn';
			case 'altname': return $this->lang!='en'?'English':'中文';
			case 'altlink': return $this->altlanglink===TRUE ? sprintf('http://yoursunny.%s%s',$this->lang!='en'?'com':'cn',$this->canonical) : $this->altlanglink;
		}
	}

	public function addlib($name) {
		switch ($name) {
			case 'prettify':
				$this->head_css[] = 'https://cdnjs.cloudflare.com/ajax/libs/prettify/r224/prettify.css';
				$this->bottom_js[] = 'https://cdnjs.cloudflare.com/ajax/libs/prettify/r224/prettify.js';
				break;
			default:
				die(sprintf('UNKNOWN LIBRARY %s',$name));
		}
	}
	public function head($title,$canonical,$lang='zh',$domain='yoursunny.com') {
		$this->lang = $lang;
		$this->domain = $domain;
		if ($_SERVER['HTTP_HOST'] == 'local.'.$this->domain) {
			$this->local_domain = TRUE;
			$this->domain = 'local.'.$this->domain;
			$this->domain_static = 'local.yoursunny.com';
			$this->cache_control = FALSE;
		}
		if ($canonical !== FALSE && ($this->domain != $_SERVER['HTTP_HOST'] || $canonical != $_SERVER['REQUEST_URI'])) {
			header('Location: http://'.$this->domain.$canonical);
			header('HTTP/1.1 301');
			die;
		} else {
			header('Content-Type: text/html;charset=utf-8');
			if (strpos($_SERVER['HTTP_USER_AGENT'],'Trident/')!==FALSE) header('X-UA-Compatible: IE=edge');
			ob_start('ob_gzhandler');
		}
		if ($this->cache_control !== FALSE) {
			header('Cache-Control: '.$this->cache_control);
		}

		echo '<!DOCTYPE html>';
		if (substr($title,0,1) == '*') $title = substr($title,1);
		else $title = ($title?$title.' - ':'') . ($this->lang=='zh'?'你的阳光 yoursunny.com':'yoursunny.com');
		printf('<title>%s</title>', $title);
		if ($canonical!==FALSE) {
			printf('<link rel="canonical" href="http://%s%s">',$this->domain,$canonical);
			$this->canonical = $canonical;
		}
		echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
		foreach ($this->head_css as $u) {
			printf('<link rel="stylesheet" href="%s">',$this->staticfile($u));
		}
		foreach ($this->head_js as $u) {
			printf('<script src="%s"></script>',$this->staticfile($u));
		}
		if ($this->altlang_get()) {
			printf('<link rel="alternate" hreflang="%s" href="%s">',$this->altlang_get('altcode'),$this->altlang_get('altlink'));
		}
	}
	
	public function header() {
		global $PR;
		include $_SERVER['DOCUMENT_ROOT'].'/include/2013/header-'.$this->lang.'.php';
	}
	public function footer() {
		global $PR;
		include $_SERVER['DOCUMENT_ROOT'].'/include/2013/footer-'.$this->lang.'.php';
		if (!$this->local_domain) {
			echo '<div style="position:absolute;left:-100px;top:0;"><script async src="//www.google-analytics.com/ga.js"></script><script src="http://js.users.51.la/1697972.js"></script></div>';
		}
		foreach ($this->bottom_js as $u) {
			printf('<script src="%s"></script>',$this->staticfile($u));
		}
	}
	public function adsense($width,$height) {
		printf('<div class="adsense adsense-%dx%d">',$width,$height);
		if ($this->local_domain) {
			printf('<ins style="display:inline-table;position:relative;visibility:visible;width:%dpx;height:%dpx;background:#f99;">adsense %dx%d</ins>',$width,$height,$width,$height);
		} else {
			include $_SERVER['DOCUMENT_ROOT'].'/include/2013/ad-'.$width.'x'.$height.'.php';
		}
		echo '</div>';
	}
}
date_default_timezone_set('America/Phoenix');
//date_default_timezone_set('Asia/Shanghai');
$PR = new PageRenderHelper;

//global cache
define('GCACHEPATH',$_SERVER['DOCUMENT_ROOT'].'/_cache/gcached/');
$gcached_memcache = array();
function gcached($key,$func,$expires=3600) {
	//no file cache for key beginning with '-'
	global $gcached_memcache;
	if (isset($gcached_memcache[$key])) return $gcached_memcache[$key];
	if ($key[0]!='-') {
		$cachefile = GCACHEPATH.$key.'.serialize';
		if (file_exists($cachefile) && filemtime($cachefile)>=time()-$expires) return $gcached_memcache[$key] = unserialize(file_get_contents($cachefile));
	}
	$value = $func();
	if ($value===FALSE) {//creating fail, use old data
		if (file_exists($cachefile)) return $gcached_memcache[$key] = unserialize(file_get_contents($cachefile));
	}
	if ($key[0]!='-') file_put_contents($cachefile,serialize($value));
	return $gcached_memcache[$key] = $value;
}

function markdown_text($s) {
	require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013/markdown.php';
	return Markdown($s);
}
function markdown_file($f) {
	return markdown_text(file_get_contents($f));
}

?>
