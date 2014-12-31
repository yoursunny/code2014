<?php
header('Location: /p/');
header('HTTP/1.1 301');
die;
?>
<?php
require_once $_SERVER["DOCUMENT_ROOT"].'/include/10.php';
?>
<!doctype html>
<html>
<head>
<meta http-equiv="content-type" content="text/html;charset=utf-8">
<title>作品 - 你的阳光 yoursunny.com</title>
<link rel="stylesheet" type="text/css" href="/images/10.css">
<link rel="canonical" href="http://yoursunny.com/work/">
</head>
<body id="p_workh"><div class="container">

<header><div class="header">
<a href="/" class="logo">你的阳光</a>
<nav><ul class="nav">
<li><a href="/m/">个人</a></li>
<li><a href="/study/">学习</a></li>
<li><a href="/t/">技术</a></li>
<li class="current"><a href="/work/">作品</a></li>
</ul></nav>
</div></header>

<div class="contents"><div class="contents_maincol">

<section><div class="cblock" id="worklist">
<h1 class="tit">你的阳光 &raquo; 作品</h1>

<?php
$x=simplexml_load_file('works.xml');
foreach ($x->category as $xc) {
	echo '<h3>'.$xc['title'].'</h3>'."\r\n".'<ul>'."\r\n";
	foreach ($xc->work as $xw) {
		$link=isset($xw['link'])?$xw['link']:('/work/'.$xw['key'].'/');
		$title=isset($xw['title'])?$xw['title']:$xw['key'];
		echo '<li><a href="'.$link.'">'.htmlspecialchars($title).'</a> '.htmlspecialchars($xw['description']).'</li>'."\r\n";
	}
	echo '</ul>'."\r\n";
}
?>

</div></section>

</div><div class="contents_sidebar">

<aside><div class="cblock">
<script type="text/javascript">//<![CDATA[
google_ad_client="pub-7124114282586774";google_ad_slot="1008272640";google_ad_width=160;google_ad_height=600;
//]]></script>
<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>
</div></aside>

</div></div><!--/contents-->

<footer><div class="footer">
&copy;2006-2010 yoursunny.com
<script type="text/javascript" src="/lib/10/track.js"></script>
</div></footer>

</div>
</body>
</html>
