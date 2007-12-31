<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><!-- InstanceBegin template="/Templates/content.dwt" codeOutsideHTMLIsLocked="false" -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<!-- InstanceBeginEditable name="doctitle" -->
<title>奥斯卡金曲盛宴 - 你的阳光 yoursunny.com</title>
<!-- InstanceEndEditable -->
<link rel="stylesheet" type="text/css" href="../../images/common.css" />
<!-- InstanceBeginEditable name="head" --><!-- InstanceEndEditable -->
</head>
<body>
<div id="bannerouter"><div id="banner">
<a id="bannerlogo" href="http://yoursunny.com"><span>你的阳光 yoursunny.com</span></a>
<div id="bannerinner">
<div id="bannerslogan">乐观 温暖 活力</div>
<div id="nav">
<a href="http://m.yoursunny.com">个人</a>
<a href="http://www.65536.cn">技术</a>
<a href="http://study.yoursunny.com">学习</a>
<a href="http://ent.yoursunny.com">娱乐</a>
<a href="http://listen.yoursunny.com">聆听</a>
</div></div></div></div>
<div id="location">当前位置：<a href="http://yoursunny.com">你的阳光 yoursunny.com</a> &gt; <!-- InstanceBeginEditable name="location" --><a href="http://ent.yoursunny.com">娱乐</a><!-- InstanceEndEditable --></div>
<div id="mouter">
<div id="m"><!-- InstanceBeginEditable name="m" -->
<?php
$u=$_GET['u'];
$ie=(strstr($_SERVER["HTTP_USER_AGENT"],'MSIE')!==FALSE);
if ($ie) {
?>
<script src="http://ufile.kuaiche.com/Flashget_union.php?fg_uid=26568885" charset="gb2312"></script>
<script>
function ConvertURL2FG(url,fUrl,uid)
{	
	try{
		FlashgetDown(url,uid);
	}catch(e){location.href = fUrl;}
}
function Flashget_SetHref(obj,uid){obj.href = obj.fg;}
</script>
<?php
function FlashgetEncode($t_url,$uid) 
{
$prefix= "Flashget://";
$FlashgetURL=$prefix.base64_encode("[FLASHGET]".$t_url."[FLASHGET]")."&".$uid;
return $FlashgetURL;
}
$Url='http://www.65536.cn:81/ent/706oscar/'.$u.'.mp3';
$flashgetUrl=FlashgetEncode($Url,26568885);
}
?>
<div class="mhh">奥斯卡金曲盛宴</div>
<div class="mc">
<h1>正在下载：<?php echo $u; ?></h1>
<?php if ($ie) { ?>
<p align="center"><a href="#" onClick="ConvertURL2FG('<?php echo $flashgetUrl; ?>','<?php echo $Url; ?>',26568885);c('/ent/706oscar/<?php echo $u; ?>');" oncontextmenu="Flashget_SetHref(this)" fg="<?php echo $flashgetUrl; ?>">点击下载：<?php echo $u; ?>.mp3</a></p>
<ul>
<li>你必须使用FlashGet工具才能正常下载</li>
<li>下载请勿超过3个线程，否则会被服务器自动封禁</li>
</ul>
<? } else { ?>
<p align="center"><a href="http://www.65536.cn:81/ent/706oscar/<?php echo $u; ?>.mp3" onclick="c('/ent/706oscar/<?php echo $u; ?>');">点击下载：<?php echo $u; ?>.mp3</a></p>
<ul>
<li>下载请勿超过3个线程，否则会被服务器自动封禁</li>
</ul>
<?php } ?>
</div>
<div class="mf"></div>
<!-- InstanceEndEditable --></div></div>
<div id="copyright"></div>
<script src="http://www.google-analytics.com/urchin.js" type="text/javascript"></script>
<script type="text/javascript" src="../../images/common.js"></script>
<!-- InstanceBeginEditable name="script" --><!-- InstanceEndEditable -->
</body><!-- InstanceEnd --></html>