<?php
header('Cache-Control: max-age=1800');
function yoursunny() {
	if (isset($_SERVER['HTTP_ACCEPT']) && (strpos($_SERVER['HTTP_ACCEPT'],'vnd.wap.wml')!==FALSE)
		&& (strpos($_SERVER['HTTP_ACCEPT'],'text/html')===FALSE ||
		(strpos($_SERVER['HTTP_ACCEPT'],'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'],'text/html'))
		)) {//手机访问——支持wml，且[不支持html]或[wml优先于html]
		header('Location: m/wap.php');
	}
	else if (!isset($_GET['a'])) {
		yoursunny_home();
	}
	else if ($_GET['a']=='feed') {
		yoursunny_feed();
	}
}
function yoursunny_fresh() {
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
function yoursunny_home() {
	$cache_file='lib/home.cache/yoursunny_index.htm';
	$feeds=array(
//		'tech'=>array('url'=>'http://feed.feedsky.com/65536','ttl'=>67543,'format'=>'yoursunny_showfeed','param'=>array(3,1),'failure'=>'<!-- feed下载出错 -->'),
		'fav'=>array('url'=>'http://feed.feedsky.com/yoursunny-fav','ttl'=>5123,'format'=>'yoursunny_showfeed','param'=>array(12,2),'failure'=>'<!-- feed下载出错 -->'),
//		'blog'=>array('url'=>'http://feed.feedsky.com/sunnyPower','ttl'=>83317,'format'=>'yoursunny_showfeed','param'=>array(3,1),'failure'=>'<!-- feed下载出错 -->'),
		'threads'=>array('url'=>'http://feed.feedsky.com/threads','ttl'=>53461,'format'=>'yoursunny_showfeed','param'=>array(4,1),'failure'=>'<!-- feed下载出错 -->'),
	);
	$changed=PrepareFeeds($feeds,1);
	if (!file_exists($cache_file) || $changed || filemtime($cache_file)<filemtime('yoursunny_fresh.txt')) {
		$fresh=yoursunny_fresh(); $fresh_b='';
		for ($i=0;$i<count($fresh);++$i) {
			$a=$fresh[$i];
			$fresh_b.='<dt>'.htmlspecialchars($a['cate']).' <a href="'.$a['url'].'">'.htmlspecialchars($a['title']).'</a></dt><dd>'.htmlspecialchars($a['description']).' '.substr($a['date'],0,4).'-'.substr($a['date'],4,2).'-'.substr($a['date'],6,2)."</dd>\r\n";
		}
		$html=file_get_contents('yoursunny_home.htm');
		$html=str_replace('<!-- FRESH -->',$fresh_b,$html);
//		$html=str_replace('<!-- FEED-tech -->',$feeds['tech']['content'],$html);
		$html=str_replace('<!-- FEED-fav -->',$feeds['fav']['content'],$html);
//		$html=str_replace('<!-- FEED-blog -->',$feeds['blog']['content'],$html);
		$html=str_replace('<!-- FEED-threads -->',$feeds['threads']['content'],$html);
		file_put_contents($cache_file,$html);
		echo $html;
	} else {
		readfile($cache_file);
	}
}
function yoursunny_showfeed($content,$limit,$style) {
	$doc=new DOMDocument();
	if (FALSE===$doc->loadXML($content)) return '<!-- XML解析出错 -->';
	$xp=new DOMXPath($doc);
	$items=$xp->query('/rss/channel/item');
	$items_ubound=min($limit,$items->length);
	$b='';
	for ($i=0;$i<$items_ubound;++$i) {
		$item=$items->item($i);
		$title=''.@$xp->query('title',$item)->item(0)->firstChild->nodeValue;
		$description=''.@$xp->query('description',$item)->item(0)->firstChild->nodeValue;
		$link=''.@$xp->query('link',$item)->item(0)->firstChild->nodeValue;
		$date=strtotime($xp->query('pubDate',$item)->item(0)->firstChild->nodeValue);
		$tags_l=@$xp->query('dc:subject',$item);
		$tags=@$tags_l->length>0?''.@$tags_l->item(0)->firstChild->nodeValue:'';
		switch ($style) {
			case 1:
				$b.='<li><a title="'.date('Y-m-d H:i:s',$date).'" href="'.htmlspecialchars($link).'">'.htmlspecialchars($title).'</a></li>'."\r\n";
			break;
			case 2:
				$b.='<dt><a title="'.date('Y-m-d H:i:s',$date).'" href="'.htmlspecialchars($link).'">'.htmlspecialchars($title).'</a></dt><dd>'.$description.' <i>'.htmlspecialchars($tags).'</i></dd>'."\r\n";
			break;
		}
	}
	return $b;
}
function yoursunny_feed() {
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
function cn65536() {
	if (!isset($_GET['a'])) {
		cn65536_home();
	}
	else if ($_GET['a']=='feed_t') {// ?a=feed_t 用于Google Webmaster Tools的sitemap
		readfile('t/feed.xml');
	}
}
function cn65536_home() {
	$cache_file='lib/home.cache/65536_index.htm';
	$feeds=array(
		'65536'=>array('url'=>'http://feed.feedsky.com/65536','ttl'=>74490,'format'=>'yoursunny_showfeed','param'=>array(8,1),'failure'=>'<!-- feed下载出错 -->'),
	);
	$changed=PrepareFeeds($feeds,1);
	if (!file_exists($cache_file) || $changed) {
		$html=file_get_contents('65536_home.htm');
		$html=str_replace('<!-- FEED-tech -->',$feeds['65536']['content'],$html);
		file_put_contents($cache_file,$html);
		echo $html;
	} else {
		readfile($cache_file);
	}
}
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

switch (strtolower($_SERVER['SERVER_NAME']))
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