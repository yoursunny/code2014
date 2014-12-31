<?php
$path1 = explode('/',$_SERVER['REQUEST_URI']);
$path1 = ''.@$path1[1];
?>
<div class="navbar"><div class="navbar-inner">
<a class="brand" href="http://yoursunny.com">yoursunny</a>
<ul class="nav">
  <li<?php if ($path1=='m') echo ' class="active"'; ?>><a href="http://yoursunny.com/m/">Me</a>
  <li<?php if ($path1=='t') echo ' class="active"'; ?>><a href="http://yoursunny.com/t/">Technical</a>
  <li<?php if ($path1=='p') echo ' class="active"'; ?>><a href="http://yoursunny.com/p/">Products</a>
</ul>
<?php unset($path1);
if ($PR->altlang_get()) { ?>
<div class="btn-group pull-right">
  <a class="btn btn-mini active" href="javascript:;">English</a>
  <a class="btn btn-mini" href="<?php echo $PR->altlang_get('altlink'); ?>">中文</a>
</div>
<?php } ?>
</div></div>
<?php 
if (strpos($_SERVER['HTTP_USER_AGENT'],'MSIE 6.') !== FALSE) { ?>
<!--[if lt IE 7]><div style="clear:both;height:59px;padding:15px;position:relative;"><a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home?ocid=ie6_countdown_bannercode"><img src="http://storage.ie6countdown.com/assets/100/images/banners/warning_bar_0000_us.jpg" border="0" height="42" width="820" alt="You are using an outdated browser. For a faster, safer browsing experience, upgrade for free today." /></a></div><![endif]-->
<?php } ?>

