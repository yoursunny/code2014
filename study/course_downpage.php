<?php
// $style: 0=no ad, 1=ad on right, 2=ad on bottom
function course_downbefore($title,$desc,$file,$style) {
	global $course_name,$course_code,$course_teacher,$course_link;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $course_name.' '.$title; ?> - 你的阳光学习频道 study.yoursunny.com</title>
<link rel="stylesheet" type="text/css" href="/images/9/" />
<link rel="stylesheet" type="text/css" href="../9.css" />
<script type="text/javascript" src="/lib/9.js"></script>
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
<li><a href="./"><?php echo $course_name; ?></a></li>
<li><span>资源下载</span></li>
</ol>
</div>

<div class="content"><?php if ($style=='1') echo '<div class="main">'; ?>

<div class="p"><div class="p-wrap">
<h1 class="tit"><?php echo $title; ?> - <?php echo $file; ?></h1>
<div class="p-body">
<?php
}

function course_downafter($title,$desc,$file,$style) {
	global $course_name,$course_code,$course_teacher,$course_link;
?>
<?php if ($style=='2') echo '<div class="ad-post"></div>'."\r\n"; ?>
</div></div></div>

<?php if ($style=='1') echo '</div><div class="sidebar">'."\r\n\r\n".'<div class="ad-sidebar"></div>'."\r\n"; ?>

</div></div>

<div class="footer">
<p class="copyright">&copy;2006-2009 yoursunny.com, CreativeCommons BY-NC 3.0</p>
<ul class="links">
<li><a href="/m/about.htm">关于本站</a></li>
<li><a href="/m/contact.htm">联系方式</a></li>
<li><a href="/m/sitemap.htm">网站地图</a></li>
</ul>
</div>

</body></html>
<?php
}
?>