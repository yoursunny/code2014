<?php
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
	flush();
	$changed=DISABLE_CACHE;
	if (!file_exists($cache_file) || $changed || filemtime($cache_file)<filemtime('yoursunny_fresh.txt') || filemtime($cache_file)<filemtime('yoursunny_home.htm')) {
		$fresh=yoursunny_fresh(); $fresh_b='';
		for ($i=0;$i<count($fresh);++$i) {
			$a=$fresh[$i];
			$fresh_b.='<li><span class="cate">'.htmlspecialchars($a['cate']).'</span> <a href="'.$a['url'].'">'.htmlspecialchars($a['title']).'</a> <span class="desc">'.htmlspecialchars($a['description']).'</span> <span class="date">'.substr($a['date'],0,4).'-'.substr($a['date'],4,2).'-'.substr($a['date'],6,2)."</span></li>\r\n";
		}
		$html=file_get_contents('yoursunny_home.htm');
		$html=str_replace('<!-- FRESH -->',$fresh_b,$html);
		file_put_contents($cache_file,$html);
		echo $html;
	} else {
		readfile($cache_file);
	}
}
function yoursunny_feed() {
	header('Content-type: application/xml');
	$fresh=yoursunny_fresh();
	$x=new XMLWriter();
	if (count($fresh)<1 || FALSE===$x->openURI('php://output')) {
		header('Status: 503 Feed unavailable');
		die('Feed unavailable');
	}
	$x->startDocument('1.0','utf-8');
	$x->startElement('feed');
	$x->writeAttribute('xmlns','http://www.w3.org/2005/Atom');
	$x->writeElement('title','你的阳光');
	$x->writeElement('subtitle','阳光男孩个人网站，把阳光的温暖分享给你');
	$x->writeElement('published',FeedDate($fresh[0]['date']));
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
	for ($i=0;$i<count($fresh);++$i) {
		$a=$fresh[$i];
		$x->startElement('entry');
		$x->writeElement('id',$a['url']);
		$x->writeElement('title',$a['title']);
		$x->writeElement('published',FeedDate($a['date']));
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
	$x->flush();
}
function yoursunny_delicious() {
	$feeds=array(
		//'fav'=>array('url'=>'http://feeds.delicious.com/rss/yoursunny','ttl'=>5123,'format'=>'yoursunny_fav_feed','param'=>array(),'failure'=>''),
		'fav'=>array('url'=>'http://feed.feedsky.com/yoursunny-fav','ttl'=>5123,'format'=>'yoursunny_delicious_feed','param'=>array(),'failure'=>''),
	);
	PrepareFeeds($feeds,1);
	header('Content-type: text/javascript');
	echo "$('share_delicious').update('<ul id=\"delicious\">".str_replace(array("\r","\n",'"',"'"),array('','','\"',"\\'"),$feeds['fav']['content'])."</ul>');WebSite.NewWinLink();";
}
function yoursunny_delicious_feed($content) {
	/* delicious
	$x=simplexml_load_string($content);
	if (FALSE===$x) return '<!-- XML解析出错 -->';
	$items=$x->item;
	$items_ubound=min(12,count($items));
	$b='';
	for ($i=0;$i<$items_ubound;++$i) {
		$item=$items[$i];
		$item_dc=$item->children('http://purl.org/dc/elements/1.1/');
		$title=''.@$item->title[0];
		$description=''.@$item->description[0];
		$link=''.@$item->link[0];
		$date=strtotime($item_dc->date[0]);
		$tags=@$item_dc->subject[0];
		$b.='<li><a title="'.date('Y-m-d H:i:s',$date).'" href="'.htmlspecialchars($link).'" rel="external">'.htmlspecialchars($title).'</a> <span class="desc">'.$description.'</span> <span class="cate">'.htmlspecialchars($tags).'</span></li>';
	}
	return $b;
	*/
	$x=simplexml_load_string($content);
	if (FALSE===$x) return '<!-- feed xml error -->';
	$items=$x->channel->item;
	$items_ubound=min(8,count($items));
	$b='';
	for ($i=0;$i<$items_ubound;++$i) {
		$item=$items[$i];
		$item_dc=$item->children('http://purl.org/dc/elements/1.1/');
		$title=''.@$item->title[0];
		$description=''.@$item->description[0];
		$link=''.@$item->link[0];
		$date=strtotime($item->pubDate[0]);
		$tags=@$item_dc->subject[0];
		$b.='<li><a title="'.date('Y-m-d H:i:s',$date).'" href="'.htmlspecialchars($link).'" rel="external">'.htmlspecialchars($title).'</a> <span class="desc">'.strip_tags($description).'</span> <span class="cate">'.htmlspecialchars($tags).'</span></li>';
	}
	return $b;
}
function sitemap() {
	header('Content-Type: application/xml');
	$w=new XMLWriter();
	$w->openURI('php://output');
	$w->startDocument();
	$w->startElement('urlset');
	$w->writeAttribute('xmlns','http://www.sitemaps.org/schemas/sitemap/0.9');
	sitemap_url($w,'http://yoursunny.com/');
	//$fresh=yoursunny_fresh();
	//for ($i=0;$i<count($fresh);++$i) {
	//	$a=$fresh[$i];
	//	sitemap_url($w,$a['url']);
	//}
	sitemap_url($w,'http://yoursunny.com/study/');
	$d=opendir('study/');
	while (FALSE!==($f=readdir($d))) {
		if ($f{0}=='.') continue;
		if (strlen($f)==5 && is_dir('study/'.$f)) {
			sitemap_url($w,'http://yoursunny.com/study/'.$f.'/');
		}
	}
	closedir($d);
	sitemap_url($w,'http://yoursunny.com/study/GPA/');
	sitemap_url($w,'http://yoursunny.com/study/software/');
	sitemap_url($w,'http://yoursunny.com/m/');
	sitemap_url($w,'http://yoursunny.com/m/about.htm');
	sitemap_url($w,'http://yoursunny.com/m/sitemap.htm');
	sitemap_url($w,'http://yoursunny.com/m/spirit.htm');
	sitemap_url($w,'http://yoursunny.com/m/sendmail.htm');
	sitemap_url($w,'http://yoursunny.com/m/typo.htm');
	sitemap_url($w,'http://yoursunny.com/z/2009/sjtu-feeds/');
	$w->endDocument();
}
function sitemap_url($w,$u) {
	$prefix='http://yoursunny.com/';
	if (substr($u,0,strlen($prefix))!=$prefix) return;
	$w->startElement('url');
	$w->writeElement('loc',$u);
	$w->endElement();
}

if (is_mobile()) {
	header('Content-Type: text/vnd.wap.wml');
	readfile('m/wap.wml');
}
else if (!isset($_GET['a'])) {
	page_gzip();
	yoursunny_home();
	//if (@$_SERVER['HTTP_REFERER']=='http://www.91index.com/') file_get_contents('http://yoursunny-app.appspot.com/z/2009/happyfarm/');
}
else if ($_GET['a']=='feed') {
	yoursunny_feed();
}
else if ($_GET['a']=='delicious') {
	yoursunny_delicious();
}
else if ($_GET['a']=='sitemap') {
	sitemap();
}


?>