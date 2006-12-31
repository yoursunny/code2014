<?php
define('VOD_HTTP','http://yoursunny.com:81/vod/FamilyAlbumUSA/');
$e=$_SERVER['QUERY_STRING'];
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>《走遍美国》</title>
</head>

<body>
<h1 align="center"><font color="#00CC66">《走遍美国》</font> <font color="#CC3333">Family Album U.S.A.</font> <font color="#6699FF">视频观看</font></h1>
<p>
<?php
for ($i=1;$i<=3;++$i) { 
$u='U'.$e.'act'.$i.'.rm';
?>
第<?php echo $i; ?>集：
<input type="text" value="<?php echo VOD_HTTP.$u; ?>" size="100" readonly="readonly" onmouseover="this.select()" /><a href="<?php echo VOD_HTTP.$u; ?>">播放</a><br />
<?php } ?>
</p>
<p>播放软件：<a href="http://yoursunny.com:81/media_soft/">RealPlayer</a> 需要带宽：150kpbs</p>
<script src="http://www.google-analytics.com/urchin.js" type="text/javascript"></script>
<script type="text/javascript">_uacct = "UA-935676-1";urchinTracker();</script>
</body>
</html>
