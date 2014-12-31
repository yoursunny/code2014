<?php
if (isset($_GET['nb'])) {
	include 'nb.php';
	exit;
}

if (isset($_GET['organic-experiment'])) {
	$fn=$_GET['organic-experiment'];
	if (!preg_match('/^[a-z0-9]+$/',$fn) || !file_exists('organic-experiment/'.$fn.'.htm')) {
		header('HTTP/1.1 404 Page Not Found');
		exit;
	}
	define('OE_STATIC','organic-experiment/');
	$html=iconv('gbk','utf-8',file_get_contents('organic-experiment/'.$fn.'.htm'));
	$html=str_replace(array(
			'charset=gb2312',
			'<style>',
			'</title>',
			'</body>',
			'<a href="http://internet.1m.cn/">FredSoft</a> <a href="http://fred.588.net/">石君霄个人网站</a> 
  <a href="http://www.qibao.icampus.cn/">上海市七宝中学</a> <a href="http://www.thehungersite.com/">TheHungerSite</a><font size="-3">(请点击按钮，向需要的人捐赠食物！)</font>'
		),array(
			'charset=utf-8',
			'<style type="text/css">',
			' - 阳光男孩的高中《有机化学实验》课件</title>',
			'<p><a href="./?organic-experiment=index" target="_self">课件首页</a> || <a href="http://cid-1fa4aa816e7dc9f3.skydrive.live.com/self.aspx/yoursunny-study/chemistry/organic-experiment.7z">下载录音授课材料</a> || 感谢 上海市七宝中学 戴珊玲 老师对本课件制作和授课的支持 || 返回《<a href="./" target="_self">化学</a>》课程主页</p><script type="text/javascript" src="/lib/10/track.js"></script></body>',
			'注：本课件制作于2004年，以上是当时通用的浏览器环境，你也可以选择新的浏览器访问。'
		),$html);
	$html=preg_replace(array(
			'/href="([a-z0-9]+)\.htm"/',
			'/src="([a-z0-9]+).jpg"/i',
			'/src="([a-z0-9]+).swf"/i',
			'/value="([a-z0-9]+).swf"/i'
		),array(
			'href="./?organic-experiment=$1"',
			'src="'.OE_STATIC.'$1.jpg"',
			'src="'.OE_STATIC.'$1.swf"',
			'value="'.OE_STATIC.'$1.swf"'
		),$html);
	echo $html;
	exit;
}

$non_sjtu='上海市七宝中学';
$course_key='chemistry';
include '../include/course.php';
?>