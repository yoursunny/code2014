<?php
//必须定义：
//$course_name='课程名称';
//课程代码；第一个代码为目录名及统计标志
//$course_code=array('IS401');
//教师姓名列表
//$course_teacher=array('教师1','教师2');
//相关资源链接列表，每项为(文字,统计标志,网址)
//$course_link=array(
//	array('作业题','','homework.htm'),
//);
//课件 function course_down() {
//course_cate('分类名'); 输出分类
//course_file('链接文字','说明文字','文件名及统计标志','链接'); 输出文件
//}
//
//可选定义：
//$course_keyword关键字列表，用于meta
//course_content显示正文
//course_sidebar显示侧栏

//-------------------------课程主页-------------------------
//header('Expires:'.date('r',time()+1800));
header('Cache-Control: max-age=1800');
$course_inlist=FALSE;
function course_indexpage() {
	global $course_name,$course_code,$course_teacher,$course_link,$course_inlist,$course_keyword;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $course_name; ?> - 你的阳光学习频道 study.yoursunny.com</title>
<link rel="stylesheet" type="text/css" href="../../images/yoursunny.css" />
<script type="text/javascript" src="../../lib/lib.js.php"></script>
<script type="text/javascript">WebSite.noIE6();WebSite.cbase='/study/<?php echo $course_code[0]; ?>/';</script>
<?php if (isset($course_keyword)) { ?><meta name="keywords" content="<?php echo $course_keyword; ?>" /><?php } ?>
</head>
<body><div id="container">

<div id="header">
<h2><a href="http://yoursunny.com"><span>你的阳光 yoursunny.com</span></a></h2>
<ul id="nav-header">
<li><a href="http://yoursunny.com">首页</a></li>
<li><a href="http://m.yoursunny.com">个人</a></li>
<li><a href="http://www.65536.cn">技术</a></li>
<li><a href="http://study.yoursunny.com">学习</a></li>
</ul></div>
<div id="sub-nav"><ul>
<li><a href="http://study.yoursunny.com">你的阳光学习频道</a></li>
<li class="mark">&raquo;</li>
<li><a href="./"><?php echo $course_name; ?></a></li>
</ul></div>

<div class="b">
<h2 class="bh"><?php echo $course_name; ?></h2>
<table class="p">
<tr>
<td class="pcont">
<h1 class="ptitle"><?php echo $course_name; ?></h1>
<div class="pmsg">
<?php if (function_exists('course_content')) course_content(); ?>
</div>
<script type="text/javascript">WebSite.writeAd('728x90');</script>
</td>
<td class="pside">
课程代码：<?php echo implode(',',$course_code); ?><br />
任课老师：<?php echo implode(',',$course_teacher); ?><br />
<?php if (count($course_link)>0) { ?>
<h3>相关资源</h3>
<ul class="course_link">
<?php
foreach ($course_link as $link) {
	echo '<li><a href="'.$link[2].'"'
		.(strlen($link[1])>1?' onclick="c(\''.$link[1].'\')"':'')
		.'>'.$link[0].'</a></li>'."\n";
}
?>
</ul>
<?php } ?>
<?php if (function_exists('course_sidebar')) course_sidebar(); ?>
</td>
</tr>
</table>
</div>

<div class="b">
<h2 class="bh">课程资源下载</h2>
<table class="p">
<tr>
<td style="width:160px;" class="pside">
<script type="text/javascript">WebSite.writeAd('160x600');</script>
</td>
<td class="pcont">
<p>下列资源仅供学习及研究使用，著作权归原作者所有。<a href="../software/">请先安装必备软件</a></p>
<div id="down" class="course_down hslice">
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
		echo '<li><a href="./?d='.urlencode($file).'" target="_blank" onclick="c(\''.$file.'\')">'
			.$title.'</a> '.$desc.'</li>'."\n";
	} else {
		echo '<li><a href="'.$link.'" target="_blank">'.$title.'</a> '.$desc.'</li>'."\n";
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
</td>
<td style="width:120px;" class="pside">
<script type="text/javascript">WebSite.writeAd('120x600');</script>
</td>
</tr>
</table>
</div>

</div>
<div id="footer"><div id="footercontent"></div></div>
</body></html>
<?php
}
//-------------------------下载列表WebSlice-------------------------
function course_downslice() {
	global $course_name,$course_code,$course_teacher,$course_link,$course_inlist,$course_keyword;
	header('Content-Type: application/xml');
	echo '<'.'?xml version="1.0" encoding="utf-8"?>'."\n";
?>
<rss version="2.0">
<channel>
<title>你的阳光学习频道 <?php echo $course_name; ?> 课程资源下载WebSlice</title>
<link>http://study.yoursunny.com</link>
<ttl>360</ttl>
<item>
<title><?php echo $course_name; ?></title> 
<link>http://yoursunny.com/study/<?php echo $course_code[0]; ?>/</link>
<description>
<![CDATA[
<body style="margin:0;">
<p style="font-size:12px;line-height:16px;">
<a href="http://yoursunny.com/study/<?php echo $course_code[0]; ?>/" style="font-weight:bold;color:#3366cc;text-decoration:none;">你的阳光学习频道 <?php echo $course_name; ?> 课程资源下载</a><br/>
<?php
$course_inlist=-1;
function course_cate($cate) {
	global $course_inlist;
	if ($course_inlist>-1) {
		echo '<br/>'."\n";
	}
	$course_inlist=0;
	echo '<b style="color:#ff6600;">'.$cate.'</b>';
}
function course_file($title,$desc,$file,$link) {
	global $course_inlist,$course_code;
	if ($course_inlist<0) $course_inlist=0;
	if (++$course_inlist>1) echo ',';
	echo ' '.$title;
}
course_down();
?>
</p>
</body>
]]>
</description> 
</item>
</channel>
</rss>
<?php
}
//-------------------------资源下载页-------------------------
function course_downbefore($title,$desc,$file) {
	global $course_name,$course_code,$course_teacher,$course_link;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $course_name; ?> <?php echo $title; ?> - 你的阳光学习频道 study.yoursunny.com</title>
<link rel="stylesheet" type="text/css" href="../../images/yoursunny.css" />
<script type="text/javascript" src="../../lib/lib.js.php"></script>
</head>
<body><div id="container">

<div id="header">
<h2><a href="http://yoursunny.com"><span>你的阳光 yoursunny.com</span></a></h2>
<ul id="nav-header">
<li><a href="http://yoursunny.com">首页</a></li>
<li><a href="http://m.yoursunny.com">个人</a></li>
<li><a href="http://www.65536.cn">技术</a></li>
<li><a href="http://study.yoursunny.com">学习</a></li>
</ul>
</div>
<div id="sub-nav"><ul>
<li><a href="http://study.yoursunny.com">你的阳光学习频道</a></li>
<li class="mark">&raquo;</li>
<li><a href="./"><?php echo $course_name; ?></a></li>
<li class="mark">&raquo;</li>
<li><span>下载</span></li>
</ul></div>
</div>

<div class="b">
<h2 class="bh"><?php echo $title; ?> - <?php echo $file; ?></h2>
<?php
}
function course_downafter($title,$desc,$file) {
	global $course_name,$course_code,$course_teacher,$course_link;
?>
</div>
<div id="footer"><div id="footercontent"></div></div>
<script type="text/javascript">WebSite.cauto=false;</script>
</body></html>
<?php
}
$course_findfile=NULL;
$course_downfile=NULL;
function course_downpage($file) {
	global $course_name,$course_code,$course_teacher,$course_link,$course_findfile,$course_downfile;
	function course_cate($cate) { }
	function course_file($title,$desc,$file,$link) {
		global $course_findfile,$course_downfile;
		if ($course_downfile==$file) {
			$course_findfile=array($title,$desc,$file,$link);
		}
	}
	$course_downfile=$file;
	course_down();
	if ($course_findfile==NULL) {
		header('HTTP/1.0 404 Not Found');
		echo 'There is not file named '.$file.' for download in this course.';
	}
	list($title,$desc,$file,$link)=$course_findfile;
	$a1=explode(':',$link);
	if (count($a1)==1 || in_array(strtolower($a1[0]),array('http','https','ftp','telnet'))) {
		header('Location: '.$link);
	} else {
		switch ($a1[0]) {
			case 'brsbox':
				require 'course_disk1.php';
				course_brsbox($title,$desc,$file,$link,$a1[1]);
				break;
			case 'namipan':
				require 'course_disk1.php';
				course_namipan($title,$desc,$file,$link,$a1[1]);
				break;
			case 'kankan':
				require 'course_kankan.php';
				course_kankan($title,$desc,$file,$link,$a1[1]);
				break;
			case 'study2008':
				require 'course_study2008.php';
				course_study2008($title,$desc,$file,$link,$a1[1]);
				break;
			default:
				header('HTTP/1.0 403 Unable to download');
				echo $file.' found, but no handler is defined for link '.$link;
		}
	}
}

if (isset($_GET['d'])) {
	course_downpage($_GET['d']);
} else if (@$_GET['a'] == 'downslice') {
	course_downslice();
} else {
	course_indexpage();
}
?>