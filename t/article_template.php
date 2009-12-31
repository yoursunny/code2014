<?php function article($title,$keywords,$byline,$dtd,$has_sidebar,$prettify,$style,$body,$sidebar) {
$keywords_h=htmlspecialchars($keywords);
?>
<?php if ($dtd=='transitional') { ?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><?php }
else { ?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><?php } ?>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $title; ?> - 你的阳光技术频道 www.65536.cn</title>
<?php if (strlen($keywords_h)>0) { ?><meta name="keywords" content="<?php echo $keywords_h; ?>"/>
<?php } ?>
<link rel="alternate" type="application/atom+xml" href="http://feed.feedsky.com/65536" />
<link rel="stylesheet" type="text/css" href="/images/9/" />
<script type="text/javascript" src="/lib/9.js<?php if ($prettify) echo '?prettify'; ?>"></script>
<?php if (strlen($style)>0) { ?>
<style type="text/css">/*<![CDATA[*/
<?php echo $style; ?>
/*]]>*/</style><?php echo "\r\n"; } ?>
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
<li><a href="../">文章</a></li>
<li><span><?php echo $title; ?></span></li>
</ol>
</div>

<div class="content"><?php if ($has_sidebar) { ?><div class="main"><?php } ?>


<div class="p"><div class="p-wrap">
<h1 class="tit"><?php echo $title; ?></h1>
<div id="posts" class="p-body headers">

<p class="byline"><?php echo $byline; ?></p>

<?php echo $body; ?>

</div></div></div>

<?php if ($has_sidebar) { ?></div><div class="sidebar">

<?php if (strlen($sidebar)>0) { echo '<div class="p"><div class="p-wrap">'."\r\n".'<div class="p-body">'."\r\n".$sidebar."\r\n".'</div></div></div>'; } ?>

<div class="ad-sidebar"></div>

</div><?php } ?></div>

<div class="footer">
<p class="copyright">&copy;2006-2009 yoursunny.com, CreativeCommons BY-NC 3.0</p>
<ul class="links">
<li><a href="http://yoursunny.com/m/about.htm">关于本站</a></li>
<li><a href="http://yoursunny.com/m/contact.htm">联系方式</a></li>
<li><a href="http://yoursunny.com/m/sitemap.htm">网站地图</a></li>
</ul>
</div>

</body></html>
<?php } ?>