<?php
//百会看看
function course_kankan($title,$desc,$file,$link,$key) {
	global $course_name,$course_code,$course_teacher,$course_link;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $course_name; ?> <?php echo $title; ?> - 你的阳光学习频道 study.yoursunny.com</title>
</head>
<frameset rows="*,20">
<frame src="http://kankan.baihui.com/docs/<?php echo $key; ?>" frameborder="0" />
<frame src="<?php echo '../course_kankan.php?frame=info'; ?>" frameborder="0" scrolling="no" noresize="noresize" />
</frameset>
<!-- yes,there is a gutter between two frames; but I want my page validated -->
</html>
<?php
}
if (''.@$_GET['frame'] == 'info') {
header('Cache-Control: max-age=86400');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>百会看看 课件嵌入</title>
<meta name="robots" content="noindex" />
</head><body style="font-size:12px;line-height:20px;overflow:hidden;margin:0;padding:0;background:#deeef6;">
本资料由<a href="http://study.yoursunny.com" target="_top">你的阳光学习频道</a>收集整理，按原样提供，著作权归原作者所有。如需下载，请点击顶部导航条“下载”链接。
</body></html>
<?php
}
?>