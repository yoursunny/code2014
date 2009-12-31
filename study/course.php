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

require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
page_cache(7200);
page_gzip();
$course_inlist=FALSE;
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
			case 'cech':
				require 'course_cech.php';
				course_cech($title,$desc,$file,$link,$a1[1]);
				break;
			case 'kankan':
				require 'course_kankan.php';
				course_kankan($title,$desc,$file,$link,$a1[1]);
				break;
			case 'study2008':
				require 'course_study2008.php';
				course_study2008($title,$desc,$file,$link,$a1[1]);
				break;
			case 'skydrive':
				require 'course_disk1.php';
				course_skydrive($title,$desc,$file,$link,$a1[1]);
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
	require_once 'course_indexpage.php';
	course_indexpage();
}
?>