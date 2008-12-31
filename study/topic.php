<?php
function topic($file,$topic,$byline,$basestyle) {
global $course_name;
function topicnotfound() { header('HTTP/1.1 404 topic not found'); die('topic not found'); }
$topic=$topic;
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
if ($_SERVER['SCRIPT_NAME']!='your.sunny') header('Cache-Control: max-age=1800');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $title_h=htmlspecialchars($title); ?> - <?php echo $course_name; ?> - 你的阳光学习频道 study.yoursunny.com</title>
<link rel="stylesheet" type="text/css" href="../../images/yoursunny.css" />
<script type="text/javascript" src="../../lib/lib.js.php"></script>
<meta name="keywords" content="<?php echo htmlspecialchars(trim($keywords)); ?>"/>
<style type="text/css">
<?php echo $basestyle.$style; ?>
.pmsg h2 { font-size:1.3em; }
.pmsg h3 { font-size:1.2em; }
.pmsg dt { font-size:1.1em; font-weight:bold; }
</style>
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
<li class="mark">&raquo;</li>
<li><span><?php echo $title_h; ?></span></li>
</ul></div>

<div class="b">
<h2 class="bh"><?php echo $course_name; ?></h2>
<script type="text/javascript">WebSite.writeAd('950x90');</script>
<table class="p">
<tr>
<td class="pcont">
<h1 class="ptitle"><?php echo $title_h; ?></h1>
<div class="pmsg">

<?php echo $body; ?>

</div>
<?php echo $byline; ?>
</td>
<td class="pside">
<script type="text/javascript">WebSite.writeAd('160x600');</script>
</td>
</tr>
</table>
</div>

</div>
<div id="footer"><div id="footercontent"></div></div>
<script type="text/javascript">WebSite.SetLicense(WebSite.LICENSE_BYNCSA);</script>
</body></html>
<?php } ?>