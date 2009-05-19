<?php
require_once 'common.php';
mustLogin();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>管理中心 - simple_news</title>
<link rel="stylesheet" type="text/css" href="/style.css" />
</head><body>

<h1>管理中心</h1>
<p>欢迎<b><?php echo htmlspecialchars($_SESSION['username']); ?></b>，<a href="logout.php">注销</a></p>

<h2>修改密码</h2>
<form action="change_password.php" method="post"><div>
<label for="password0">旧密码</label> <input type="password" name="password0"/><br/>
<label for="password1">新密码</label> <input type="password" name="password1"/><br/>
<label for="password2">新密码</label> <input type="password" name="password2"/><br/>
<input type="submit" value="修改密码"/>
</div></form>

<h2>添加新闻</h2>
<form action="post_news.php" method="post"><div>
<label for="title">标题</label> <input type="text" name="title"/><br/>
<label for="content">内容</label> <textarea name="content" rows="10" cols="80"></textarea><br/>
<input type="submit" value="添加新闻"/>
</div></form>

</body></html>