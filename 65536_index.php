<?php
function home() {
	$h=file_get_contents('65536_home.htm');
	$h=str_replace('<!-- works -->',home_works(),$h);
	$h=str_replace('<!-- posts -->',home_posts(),$h);
	echo $h;
}
function home_works() {
	$x=simplexml_load_file('work/works.xml');
	$a=array();
	foreach ($x->category as $xc) {
		foreach ($xc->work as $xw) {
			if (isset($xw['home-sort'])) {
				$link=isset($xw['link'])?$xw['link']:('work/'.$xw['year'].'/'.$xw['key'].'/');
				$title=isset($xw['title'])?$xw['title']:$xw['key'];
				$li='<li><a href="'.$link.'">'.htmlspecialchars($title).'</a> <span class="language">'.htmlspecialchars($xw['language']).'</span> <span class="description">'.htmlspecialchars($xw['description']).'</span></li>'."\r\n";
				$a[intval($xw['home-sort'])]=(@$a[intval($xw['home-sort'])]).$li;
			}
		}
	}
	ksort($a);
	return implode($a);
}
function home_posts() {
	$x=simplexml_load_file('t/feed.xml');
	$a=array();
	$count=0;
	foreach ($x->entry as $xe) {
		if (++$count > 8) break;
		$li='<li><a href="'.$xe->id.'">'.htmlspecialchars($xe->title).'</a> <span class="summary">'.htmlspecialchars($xe->summary).'</span></li>'."\r\n";
		$a[]=$li;
	}
	return implode($a);
}
function sitemap() {
	header('Content-Type: application/xml');
	$w=new XMLWriter();
	$w->openURI('php://output');
	$w->startDocument();
	$w->startElement('urlset');
	$w->writeAttribute('xmlns','http://www.sitemaps.org/schemas/sitemap/0.9');
	sitemap_url($w,'http://www.65536.cn/');
	$x=simplexml_load_file('work/works.xml');
	sitemap_url($w,'http://www.65536.cn/work/');
	foreach ($x->category as $xc) {
		foreach ($xc->work as $xw) {
			$link=isset($xw['link'])?$xw['link']:('http://www.65536.cn/work/'.$xw['year'].'/'.$xw['key'].'/');
			sitemap_url($w,$link);
		}
	}
	$x=simplexml_load_file('t/feed.xml');
	sitemap_url($w,'http://www.65536.cn/t/');
	foreach ($x->entry as $xe) {
		sitemap_url($w,$xe->id);
	}
	$w->endElement();
	$w->endDocument();
}
function sitemap_url($w,$u) {
	$prefix='http://www.65536.cn/';
	if (substr($u,0,strlen($prefix))!=$prefix) return;
	$w->startElement('url');
	$w->writeElement('loc',$u);
	$w->endElement();
}

if (!isset($_GET['a'])) {
	home();
}
else if ($_GET['a']=='feed_t') {
	readfile('t/feed.xml');
}
else if ($_GET['a']=='sitemap') {
	sitemap();
}
?>