<?php
if (isset($_GET['p']) || isset($_GET['cat'])) {
	header('HTTP/1.1 404 Not Found'); exit;
}
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
page_cache(43200);
page_gzip();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>原创网络技术文章 - 你的阳光技术频道 www.65536.cn</title>
<link rel="alternate" type="application/atom+xml" href="http://feed.feedsky.com/65536" />
<link rel="stylesheet" type="text/css" href="/images/9/" />
<script type="text/javascript" src="/lib/9.js"></script>
<style type="text/css">/*<![CDATA[*/
#posts .summary { font-size:85%; }
/*]]>*/</style>
</head><body>

<div class="header">
<h2><a href="http://yoursunny.com/">你的阳光</a></h2>
<ul>
<li><a href="http://m.yoursunny.com/"><span>个人</span></a></li>
<li><a href="http://study.yoursunny.com/"><span>学习</span></a></li>
<li><a href="http://www.65536.cn/"><span>技术</span></a></li>
<li><a href="http://www.65536.cn/work/"><span>作品</span></a></li>
</ul>
<ol>
<li><a href="http://yoursunny.com/">你的阳光</a></li>
<li><a href="/">技术频道</a></li>
<li><span>文章</span></li>
</ol>
</div>

<div class="content"><div class="main">

<div class="p"><div class="p-wrap">
<h1 class="tit">你的阳光技术频道 - 原创网络技术文章</h1>
<div id="posts" class="p-body headers">
<ul class="anu">
<?php
$x=simplexml_load_file('feed.xml');
foreach ($x->entry as $xe) {
	echo '<li><a href="'.$xe->id.'">'.htmlspecialchars($xe->title).'</a> <span class="summary">'.htmlspecialchars($xe->summary).'</span></li>'."\r\n";
}
?></ul>
</div></div></div>

</div><div class="sidebar">

<div class="ad-sidebar"></div>

</div></div>

<div class="footer">
<p class="copyright">&copy;2006-2009 yoursunny.com, CreativeCommons BY-NC 3.0</p>
<ul class="links">
<li><a href="http://yoursunny.com/m/about.htm">关于本站</a></li>
<li><a href="http://yoursunny.com/m/contact.htm">联系方式</a></li>
<li><a href="http://yoursunny.com/m/sitemap.htm">网站地图</a></li>
</ul>
</div>

<script type="text/javascript">//<![CDATA[
WebSite.bannerAd=false;
//]]></script>
</body></html>