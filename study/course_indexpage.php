<?php
function course_indexpage() {
	global $course_name,$course_code,$course_teacher,$course_link,$course_inlist,$course_keyword;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $course_name; ?> - 你的阳光学习频道 study.yoursunny.com</title>
<?php if (isset($course_keyword)) { ?><meta name="keywords" content="<?php echo $course_keyword; ?>" /><?php } ?>
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
<li><span><?php echo $course_name; ?></span></li>
</ol>
</div>

<div class="content"><div class="main">

<?php if (function_exists('course_content')) { ?>
<div class="p"><div class="p-wrap">
<h1 class="tit"><?php echo $course_name; ?></h1>
<div class="p-body headers">
<?php course_content(); ?>
<div class="ad-post"></div>
</div></div></div>
<?php } ?>

<?php if (function_exists('course_down')) { ?>
<div class="p"><div class="p-wrap">
<h1 class="tit"><?php echo $course_name; ?> 课程资源下载</h1>
<div class="p-body">
<p>下列资源仅供学习及研究使用，著作权归原作者所有。<a href="../software/">请先安装必备软件</a></p>
<div id="down" class="course-down hslice anu">
<?php
function course_cate($cate) {
	global $course_inlist;
	if ($course_inlist) {
		$course_inlist=FALSE;
		echo '</ul>'."\n";
	}
	echo '<h3>'.$cate.'</h3>'."\n";
}
function course_file($title,$desc,$file,$link) {
	global $course_inlist;
	if (!$course_inlist) {
		$course_inlist=TRUE;
		echo '<ul>'."\n";
	}
	if (strlen($file)>1) {
		$analytics_code='';
		$a1=explode(':',$link);
		if (in_array(strtolower($a1[0]),array('http','https','ftp','telnet','kankan'))) {//转向外部站点，需要统计
			//kankan不是外部站点，但是目前没有办法在frameset中插入统计代码
			$analytics_code=' onclick="c(\'?d='.$file.'\')"';
		}
		echo '<li><a href="./?d='.urlencode($file).'"'.$analytics_code.'>'.$title.'</a> '.$desc.'</li>'."\n";
	} else {
		echo '<li><a href="'.$link.'">'.$title.'</a> '.$desc.'</li>'."\n";
	}
}
course_down();
if ($course_inlist) {
	$course_inlist=FALSE;
	echo '</ul>'."\n";
}
?>
<span class="entry-title"><?php echo $course_name; ?> 课程资源下载</span>
<a class="feedurl" rel="feedurl" href="./?a=downslice"></a>
</div>
</div></div></div>
<?php } ?>

</div><div class="sidebar">

<div class="p"><div class="p-wrap">
<div class="p-body">
课程代码：<?php echo implode(',',$course_code); ?><br />
任课老师：<?php echo implode(',',$course_teacher); ?><br />
<?php if (count($course_link)>0) { ?>
<?php if (isset($course_link) && count($course_link)>0) { ?>
<ul class="course-link anu">
<?php
foreach ($course_link as $link) {
	echo '<li><a href="'.$link[2].'"'
		.(strlen($link[1])>1?' onclick="c(\''.$link[1].'\')" rel="external"':'')
		.'>'.$link[0].'</a></li>'."\n";
}
?>
</ul>
<?php } ?>
<?php } ?>
</div></div></div>

<?php if (function_exists('course_sidebar')) { ?>
<div class="p"><div class="p-wrap">
<div class="p-body">
<?php course_sidebar(); ?>
</div></div></div>
<?php } ?>

<div class="ad-sidebar"></div>

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