<?php
function topic($file,$topic,$byline,$basestyle,$dtd='strict',$ad_sidebar=TRUE) {
global $course_name;
if (!function_exists('topicnotfound')) {
	function topicnotfound() { header('HTTP/1.1 404 topic not found'); die('topic not found'); }
}
if ($topic=='') topicnotfound();
$title=''; $keywords=''; $body=''; $style='';
$f=fopen($file,'r');
$found=0;//查找状态
$start_line='<!--#PAGE '.$topic.'-->';
while (FALSE!==($l=fgets($f))) {
	switch ($found) {
		case 0://未找到
			if (strpos($l,$start_line)!==FALSE) $found=1;
			break;
		case 1://当前行是标题
			$title=trim($l);
			$found=2;
			break;
		case 2://当前行是关键字
			$keywords=$l;
			$found=3;
			break;
		case 3://当前行是内容
			if (strpos($l,'<!--#PAGE ')!==FALSE) $found=4;
			else if (strpos($l,'<style ')!==FALSE) $found=5;
			else $body.=$l;
			break;
		case 5://当前行是样式
			if (strpos($l,'</style>')!==FALSE) $found=3;
			else $style.=$l;
	}
	if ($found==4) break;//已经读取完毕
}
fclose($f);
if ($found==0) topicnotfound();
if ($_SERVER['SERVER_NAME']!='your.sunny') header('Cache-Control: max-age=1800');
$keywords_h=htmlspecialchars(trim($keywords));
?>
<?php if ($dtd=='transitional') { ?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><?php }
else { ?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><?php } ?>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $title_h=htmlspecialchars($title); if (strlen($course_name)>0) echo ' - '.$course_name; ?> - 你的阳光学习频道 study.yoursunny.com</title>
<?php if (strlen($keywords_h)>0) { ?><meta name="keywords" content="<?php echo $keywords_h; ?>"/><?php } ?>
<link rel="stylesheet" type="text/css" href="/images/9/" />
<link rel="stylesheet" type="text/css" href="../9.css" />
<script type="text/javascript" src="/lib/9.js"></script>
<style type="text/css">/*<![CDATA[*/
<?php echo $basestyle.$style; ?>
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
<li><a href="/">你的阳光</a></li>
<li><a href="../">学习频道</a></li>
<?php if (strlen($course_name)>0) { ?><li><a href="./"><?php echo $course_name; ?></a></li><?php echo "\r\n"; } ?>
<li><span><?php echo $title_h; ?></span></li>
</ol>
</div>

<div class="content"><script type="text/javascript">WebSite.writeAd('study');</script>
<?php if ($ad_sidebar) { ?><div class="main"><?php } ?>

<div class="p"><div class="p-wrap">
<h1 class="tit"><?php echo $title_h; ?></h1>
<div class="p-body headers">

<?php echo $body; ?>

<?php echo $byline; ?>
</div></div></div>

<?php if ($ad_sidebar) { ?></div><div class="sidebar">

<div class="ad-sidebar"></div>

</div><?php } ?></div>

<div class="footer">
<p class="copyright">&copy;2006-2009 yoursunny.com, CreativeCommons BY-NC 3.0</p>
<ul class="links">
<li><a href="/m/about.htm">关于本站</a></li>
<li><a href="/m/contact.htm">联系方式</a></li>
<li><a href="/m/sitemap.htm">网站地图</a></li>
</ul>
</div>

<script type="text/javascript">//<![CDATA[
WebSite.bannerAd=false;
//]]></script>
</body></html>
<?php } ?>