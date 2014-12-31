<?php
/*
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2011.php';
*/
class PageRenderHelper {
	public $domain='yoursunny.com';
	public $domain_static='static1.tk';
	public $lang='zh';
	public function staticfile($path) {
		return 'http://'.$this->domain_static.$path;
	}
	
	public function starthtml() {
		echo '<!DOCTYPE html><html><head>';
	}
	public function head($title,$canonical) {
		if ($_SERVER['HTTP_HOST']=='local.'.$this->domain) {
			$this->domain='local.'.$this->domain;
			$this->domain_static='local.yoursunny.com';
		}
		if ($canonical!==FALSE && ($this->domain!=$_SERVER['HTTP_HOST'] || $canonical!=$_SERVER['REQUEST_URI'])) {
			header('Location: http://'.$this->domain.$canonical);
			header('HTTP/1.1 301');
			die;
		} else {
			header('Content-Type: text/html;charset=utf-8');
			ob_end_flush();
		}

		//echo '<meta http-equiv="content-type" content="text/html;charset=utf-8"/>';
		if (substr($title,0,1)=='*') $title=substr($title,1);
		else $title=($title?$title.' - ':'').($this->lang=='zh'?'你的阳光 yoursunny.com':'yoursunny.com');
		echo '<title>'.$title.'</title>';
		if ($canonical!==FALSE) {
			echo '<link rel="canonical" href="http://'.$this->domain.$canonical.'"/>';
		}
		echo '<link rel="stylesheet" type="text/css" href="'.$this->staticfile('/images/2011/style.css').'"/>';
		echo '<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>';
		echo '<script type="text/javascript" src="'.$this->staticfile('/lib/2011.js').'"></script>';
	}
	public function startbody($attrs='') {
		echo '</head><body '.$attrs.'>';
	}
	public function header() {
		require $_SERVER["DOCUMENT_ROOT"].'/include/2011/header-'.$this->lang.'.htm';
	}
	public function footer() {
		require $_SERVER["DOCUMENT_ROOT"].'/include/2011/footer-'.$this->lang.'.htm';
	}
	public function endhtml() {
		echo '</body></html>';
	}

	private $contentstate=0;//0=none,1=[fullwidth],2=[main]-side,3=main-[side],4=[side]-main,5=side-[main]
	const fullwidth=1;
	const main=2;
	const side=4;
	public function startcontent($firstcolumn=self::main) {
		$modecls='';
		switch ($firstcolumn) {
			case self::fullwidth: $modecls='W_contents_full'; break;
			case self::main: $modecls='W_contents_mainside'; break;
			case self::side: $modecls='W_contents_sidemain'; break;
			default: die('startcontent: illegal $firstcolumn');
		}
		echo '<div class="W_contents '.$modecls.'">';
		$this->contentstate=$firstcolumn;
		$this->startcolumn();
	}
	public function nextcolumn() {
		if (!in_array($this->contentstate,array(2,4))) die('nextcolumn: last column');
		echo '</div>';
		++$this->contentstate;
		$this->startcolumn();
	}
	private function startcolumn() {
		$cls='';
		switch ($this->contentstate) {
			case 1: $cls='W_column_full'; break;
			case 2: case 5: $cls='W_column_main'; break;
			case 3: case 4: $cls='W_column_side'; break;
		}
		echo '<div class="'.$cls.'">';
	}
	public function endcontent() {
		echo '</div></div>';
		$this->contentstate=0;
	}
	
	public function adsense($size) {
		switch ($size) {
			case '160x600':
				echo '<script type="text/javascript">google_ad_client="pub-7124114282586774";google_ad_slot="1008272640";google_ad_width=160;google_ad_height=600;</script>';
				break;
			default:
				return;
		}
		echo '<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>';
	}
	public function mobilestat() {
		require $_SERVER["DOCUMENT_ROOT"].'/include/2011/mobile-stat.htm';
	}
}
$PR=new PageRenderHelper;
ob_start();

function include_recaptcha() {
	if (function_exists('recaptcha_check_answer')) return;
	define('RECAPTCHA_PUBLIC_KEY','6Lf2QAMAAAAAAI0FHV-Cb5t08QaXP_BxPZse6vrC');
	define('RECAPTCHA_PRIVATE_KEY','6Lf2QAMAAAAAAOG-5QgeBgfKyx2fnHL5UCRdp6b-');
	//require_once $_SERVER["DOCUMENT_ROOT"].'/include/recaptchalib.php';
	
	class ReCaptchaResponse {
		var $is_valid;
		var $error;
	}
	function recaptcha_check_answer($privkey,$remoteip,$challenge,$response) {
		if (strlen(''.$challenge.$response)==0) {
			$r=new ReCaptchaResponse();
			$r->is_valid=false;
			$r->error='incorrect-captcha-sol';
			return $r;
		}
		$ch=curl_init('http://www.google.com/recaptcha/api/verify');
		curl_setopt($ch,CURLOPT_POSTFIELDS,'privatekey='.urlencode($privkey).'&remoteip='.urlencode($remoteip).'&challenge='.urlencode($challenge).'&response='.urlencode($response));
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		$resp=curl_exec($ch);
		curl_close($ch);
		$answers=explode("\n",$resp);
		$r=new ReCaptchaResponse();
		$r->is_valid=trim($answers[0])=='true';
		if (!$r->is_valid) $r->error=$answers[1];
		return $r;
	}
}

define('SITE_WL_CLIENTID','00167FFE8000FD46');

function markdown_text($s) {
	require_once $_SERVER["DOCUMENT_ROOT"].'/include/2011/markdown.php';
	return Markdown($s);
}
function markdown_file($f) {
	return markdown_text(file_get_contents($f));
}

?>
