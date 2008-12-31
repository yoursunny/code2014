<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>审核评论</title>
</head>

<body>
<dl>
<?php
define('PW','870212');//正确密码
if (isset($_COOKIE['comment_password']) && $_COOKIE['comment_password']==PW) ;
else if (isset($_GET['k']) && $_GET['k']==PW) setcookie('comment_password',PW);
else die('<dt>请输入评论管理密码</dt><dd>pass.php?k=密码</dd></dl></body></html>');

require_once '../common.php';

if (isset($_GET['pass']))
{
	$db->execute('UPDATE ###comment SET pass=1 WHERE ID=?0id',array('0id'=>$_GET['pass']));
}
if (isset($_GET['del']))
{
	$db->execute('DELETE FROM ###comment WHERE ID=?0id',array('0id'=>$_GET['del']));
}

$db->query('SELECT * FROM ###comment WHERE pass=0 ORDER BY t');
while (NULL!==($row=$db->read()))
{
	echo '<dt><a href="?pass='.$row['ID'].'">通过</a> <a href="?del='.$row['ID'].'">删除</a> '.htmlspecialchars($row['person']).' <a href="'.$row['link'].'">'.$row['link'].'</a></dt><dd>'.htmlspecialchars($row['msg']).'</dd>';
}
?>
</dl>
</body>
</html>
