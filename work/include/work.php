<?php
require_once $_SERVER["DOCUMENT_ROOT"].'/include/10.php';

if (!preg_match('/work\/([a-zA-Z0-9\-]+)/',$_SERVER['REQUEST_URI'],$m)) {
	header('HTTP/1.1 404 Work Not Found');
	exit;
}
$work_key=$m[1];
$wx=simplexml_load_file('../'.$work_key.'/work.xml');

$work_title=htmlspecialchars($wx->title);
$work_key=strval($wx->key);
$work_updated=strval($wx->updated);

if (isset($_GET['download'])) {
	$download_f=$_GET['download'];
	foreach ($wx->download as $x_download) {
		if (strval($x_download['f'])==$download_f) {
			header('Location: http://download.yoursunny.tk/work/'.$work_key.'_'.$download_f);
			exit;
		}
	}
	header('HTTP/1.1 404 File Not Found');
	exit;
}

foreach ($wx->topic as $x_topic) {
	$topic_p=strval($x_topic['p']);
	if (($topic_p=='' && $_SERVER['QUERY_STRING']=='') || ($topic_p!='' && @$_GET['p']==$topic_p)) {
		$canonical_url='http://yoursunny.com/work/'.$work_key.'/';
		if ($topic_p!='') $canonical_url.='?p='.$topic_p;
	} else {
		continue;
	}
	switch ($x_topic['t']) {
		case 'a9':
			$topic_file='../'.$work_key.'/'.($topic_p==''?'index':$topic_p).'.article.htm';
			include 'a9.php';
			break;
		case 'a10':
			$topic_file='../'.$work_key.'/'.($topic_p==''?'index':$topic_p).'.a10.htm';
			include 'a10.php';
			break;
	}
}
?>