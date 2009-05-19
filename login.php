<?php
require_once 'common.php';
$db->query_sql("SELECT username FROM user WHERE username='".$_POST['username']."' AND password=MD5('".$_POST['password']."')");#vulnerable to SQL injection here
$row=$db->read();
if ($row==NULL) header('Location: login.htm');
else {
	session_start();
	$_SESSION['username']=$row['username'];
	header('Location: admin.php');
}
?>