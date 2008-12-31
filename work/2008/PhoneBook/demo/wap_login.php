<?php
require_once 'common.php';
header('Content-Type: text/vnd.wap.wml');
echo '<'.'?xml version="1.0"?>'; ?>

<!DOCTYPE wml PUBLIC "-//WAPFORUM//DTD WML 1.1//EN" "http://www.wapforum.org/DTD/wml_1.1.xml">
<wml>
<?php if (!isset($_GET['u'])) { ?>

<card title="个人电话本">
<p>
<b>个人电话本</b>手机登录入口。请用计算机访问并申请短网址和设置PIN码，然后用短网址登录。
</p>
</card>
<?php } else if (WapCheckLogin()) {
?>

<card title="个人电话本 - 登录成功" ontimer="wap_main.php?<?php echo WapLoginString(); ?>">
<timer value="30"/>
<p>
<b>个人电话本</b><br/>
登录成功<br/>
<a href="wap_main.php?<?php echo WapLoginString(); ?>">进入主页</a>
(3秒后自动进入)
</p>
</card>
<?php } else { ?>

<card title="个人电话本 - 登录">
<do type="accept" label="登录"><go href="wap_login.php?u=<?php echo $_GET['u']; ?>&amp;p=$(PIN)"/></do>
<p>
登录到<b>个人电话本</b><br/>
PIN：<input name="PIN" size="8"/><br/>
</p>
</card>
<?php } ?>

</wml>