<?php
header('HTTP/1.0 404 Not Found'); exit;
//近期大学英语教学站点VOA不再更新，因此此栏目不再开设

$u=$_GET['voa'];
$today=date('Ymd');
if ($u=='today') {
	header('Location: ./?voa='.$today);
	exit;
}
if (!preg_match('/\d{8}/',$u)) {
	header('HTTP/1.0 404 Not Found'); exit;
}
$year=substr($u,0,4);
$month=substr($u,4,2);
$day=substr($u,6,2);
if (!checkdate($month,$day,$year) || $u<'20040901' || $u>$today) {
	header('HTTP/1.0 404 Not Found'); exit;
}
$d=$year.'-'.$month.'-'.$day;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>大学英语VOA <?php echo $d; ?> - 你的阳光学习频道 study.yoursunny.com</title>
<link rel="stylesheet" type="text/css" href="../../images/yoursunny.css" />
<script type="text/javascript" src="../../lib/lib.js.php"></script>
<script type="text/javascript">WebSite.cbase='/study/<?php echo $course_code[0]; ?>/';</script>
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
<li><a href="./">大学英语</a></li>
<li class="mark">&raquo;</li>
<li><span>VOA <?php echo $d; ?></span></li>
</ul></div>

<div class="b">
<h2 class="bh">大学英语</h2>
<table class="p">
<tr>
<td class="pcont">
<h1 class="ptitle">VOA收听 <?php echo $d; ?></h1>
<object classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA" width="700" height="40">
<param name="controls" value="ControlPanel"/>
<param name="console" value="Clip1"/>
<param name="src" value="http://english.sjtu.edu.cn/voa/<?php echo $u; ?>.mp3">
<embed type="audio/x-pn-realaudio-plugin" src="http://english.sjtu.edu.cn/voa/<?php echo $u; ?>.mp3" console="Clip1" controls="ControlPanel" width="700" height="40" autostart="true"/>
</object>
<div class="pmsg">
<?php
//echo nl2br(htmlspecialchars(iconv('gbk','utf-8',file_get_contents('http://english.sjtu.edu.cn/voa/'.$u.'.txt'))));
?>
</div>
<script type="text/javascript" src="http://yoursunny-app.appspot.com/study/EN001/voa<?php echo $u; ?>.js"></script>
<object classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA" width="700" height="40">
<param name="controls" value="ControlPanel"/>
<param name="console" value="Clip1"/>
<param name="src" value="http://english.sjtu.edu.cn/voa/<?php echo $u; ?>.mp3">
<embed type="audio/x-pn-realaudio-plugin" src="http://english.sjtu.edu.cn/voa/<?php echo $u; ?>.mp3" console="Clip1" controls="ControlPanel" width="700" height="40" autostart="true"/>
</object>
</td>
<td class="pside">
<script type="text/javascript">
function go_date(f){
	var year=parseInt(f.year.value,10);
	var month=parseInt(f.month.value,10);
	var day=parseInt(f.day.value,10);
	var date=new Date(year,month+1,day);
	var u=date.getFullYear().toPaddedString(4)+(date.getMonth()-1).toPaddedString(2)+date.getDate().toPaddedString(2);
	location.href='./?voa='+u;
	return false;
}
</script>
<form action="" onsubmit="return go_date(this);">
<input name="year" size="4" value="<?php echo $year; ?>"/>年
<input name="month" size="2" value="<?php echo $month; ?>"/>月
<input name="day" size="2" value="<?php echo $day; ?>"/>日
<input type="submit" value="收听"/>
</form>
<p>VOA录音和文本来自<a href="http://english.sjtu.edu.cn">上海交通大学外国语学院-大学英语教学部</a></p>
<?php
?>
</td>
</tr>
</table>
</div>

</div>
<div id="footer"><div id="footercontent"></div></div>
<!--划词翻译--><script type="text/javascript" src="http://dict.cn/hc/init.php" defer="defer"></script>
</body></html>