<?php
$path1 = explode('/',$_SERVER['REQUEST_URI']);
$path1 = ''.@$path1[1];
?>
<div class="navbar"><div class="navbar-inner">
<a class="brand" href="http://yoursunny.cn">你的阳光</a>
<ul class="nav">
  <li<?php if ($path1=='m') echo ' class="active"'; ?>><a href="http://yoursunny.cn/m/">个人</a>
  <li<?php if ($path1=='study') echo ' class="active"'; ?>><a href="http://yoursunny.com/study/">学习</a>
  <li<?php if ($path1=='t') echo ' class="active"'; ?>><a href="http://yoursunny.cn/t/">技术</a>
  <li<?php if ($path1=='p') echo ' class="active"'; ?>><a href="http://yoursunny.cn/p/">作品</a>
</ul>
<?php unset($path1);
if ($PR->altlang_get()) { ?>
<div class="btn-group pull-right">
  <a class="btn btn-mini" href="<?php echo $PR->altlang_get('altlink'); ?>">English</a>
  <a class="btn btn-mini active" href="javascript:;">中文</a>
</div>
<?php } ?>
</div></div>
<?php if (strpos($_SERVER['HTTP_USER_AGENT'],'MSIE 6.') !== FALSE) { ?>
<!--[if lt IE 7]><div style="clear:both;height:59px;padding:15px;position:relative;"><a href="http://windows.microsoft.com/zh-CN/internet-explorer/products/ie/home?ocid=ie6_countdown_bannercode"><img src="http://storage.ie6countdown.com/assets/100/images/banners/warning_bar_0027_Simplified%20Chinese.jpg" border="0" height="42" width="820" alt="You are using an outdated browser. For a faster, safer browsing experience, upgrade for free today." /></a></div><![endif]-->
<?php } ?>

