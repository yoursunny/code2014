<?php
//header('Expires:'.date('r',time()+1800));
header('Cache-Control: max-age=1800');
function yoursunny()
{
	if (isset($_SERVER['HTTP_ACCEPT']) && (strpos($_SERVER['HTTP_ACCEPT'],'vnd.wap.wml')!==FALSE)
		&& (strpos($_SERVER['HTTP_ACCEPT'],'text/html')===FALSE ||
		(strpos($_SERVER['HTTP_ACCEPT'],'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'],'text/html'))
		)) {//手机访问——支持wml，且[不支持html]或[wml优先于html]
		header('Location: m/wap.php');
	}
	else if (!isset($_GET['a'])) {
		if (!file_exists('yoursunny_index.htm') || filemtime('yoursunny_index.htm')<filemtime('yoursunny_fresh.txt'))
		//if (!file_exists('yoursunny_index.htm.gz'))
		{
			$fresh=yoursunny_fresh(); $fresh_b='';
			for ($i=0;$i<count($fresh);++$i) {
				$a=$fresh[$i];
				$fresh_b.='<dt>'.htmlspecialchars($a['cate']).' <a href="'.$a['url'].'">'.htmlspecialchars($a['title']).'</a></dt><dd>'.htmlspecialchars($a['description']).' '.substr($a['date'],0,4).'-'.substr($a['date'],4,2).'-'.substr($a['date'],6,2)."</dd>\r\n";
			}
			$html=file_get_contents('yoursunny_home.htm');
			$html=str_replace('<!-- FRESH -->',$fresh_b,$html);
			file_put_contents('yoursunny_index.htm',$html);
			//$f=gzopen('yoursunny_index.htm.gz','wb9');
			//gzwrite($f,$html);
			//gzclose($f);
		}
		//if (strstr($_SERVER['HTTP_ACCEPT_ENCODING'],'gzip')===FALSE) readfile('yoursunny_index.htm');
		//else {
		//	header('Content-Encoding: gzip');
		//	readfile('yoursunny_index.htm.gz');
		//}
		readfile('yoursunny_index.htm');
	}
	else if ($_GET['a']=='feed') {
		$x=new XMLWriter();
		$fresh=yoursunny_fresh();
		if (count($fresh)<1 || !$x->openMemory()) {
			header('Status: 503 Feed unavailable');
			die('Feed unavailable');
		}
		$x->startDocument('1.0','utf-8');
		$x->startElement('feed');
		$x->writeAttribute('xmlns','http://www.w3.org/2005/Atom');
		$x->writeElement('title','你的阳光');
		$x->writeElement('subtitle','阳光男孩个人网站，把阳光的温暖分享给你');
		$x->writeElement('updated',FeedDate($fresh[0]['date']));
		$x->startElement('link');
		$x->writeAttribute('rel','alternate');
		$x->writeAttribute('type','text/html');
		$x->writeAttribute('href','http://yoursunny.com/');
		$x->endElement();
		$x->startElement('author');
		$x->writeElement('name','阳光男孩');
		$x->writeElement('uri','http://m.yoursunny.com/');
		$x->endElement();
		$x->writeElement('id','http://yoursunny.com/?a=feed');
		$x->writeElement('rights','CreativeCommons BY-NC 3.0');
		for ($i=0;$i<count($fresh);++$i) {
			$a=$fresh[$i];
			$x->startElement('entry');
			$x->writeElement('id',$a['url']);
			$x->writeElement('title',$a['title']);
			$x->writeElement('updated',FeedDate($a['date']));
			$x->startElement('link');
			$x->writeAttribute('rel','alternate');
			$x->writeAttribute('type','text/html');
			$x->writeAttribute('href',$a['url']);
			$x->endElement();
			$x->writeElement('summary',$a['summary']);
			$x->endElement();
		}		
		$x->endElement();
		$x->endDocument();
		header('Content-type: application/xml');
		echo $x->outputMemory();
	}
}
function yoursunny_fresh()
{
	$fp=fopen('yoursunny_fresh.txt','r');
	fgets($fp);
	$d=array();
	while (FALSE!==($l=fgets($fp))) {
		if (count($a=explode("\t",trim($l)))<4) continue;
		$date=$a[0];
		$cate=$a[1];
		$url=(substr($a[2],0,1)=='/') ? 'http://yoursunny.com'.$a[2] : $a[2];
		$title=$a[3];
		$description=(count($a)==4) ? '　' : $a[4];
		$summary=(count($a)<=5) ? $description : $a[5];
		array_push($d,array('date'=>$date,'cate'=>$cate,'url'=>$url,'title'=>$title,'description'=>$description,'summary'=>$summary));
	}
	return $d;
}
function cn65536()
{
	if (!isset($_GET['a'])) {
		readfile('65536_home.htm');
	}
	else if ($_GET['a']=='feed_t') {// ?a=feed_t 用于Google Webmaster Tools的sitemap
		//header('Location: t/feed.xml');
		readfile('t/feed.xml');
	}
}
function FeedDate($d)//convert YYYYmmdd to YYYY-mm-ddT00:00:00Z
{
	return substr($d,0,4).'-'.substr($d,4,2).'-'.substr($d,6,2).'T00:00:00Z';
}

switch (strtolower($_SERVER['HTTP_HOST']))
{
	case 'yoursunny.com':
	case 'your.sunny':
		yoursunny();
		break;
	case 'www.65536.cn':
	case '65536.sunny':
		cn65536();
		break;
}
?>