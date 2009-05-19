<?php
require_once 'common.php';
mustLogin();
$db->execute_sql("INSERT INTO news (title,content) VALUES ('".$_POST['title']."','".$_POST['content']."')");#vulnerable to SQL injection here
header('Location: admin.php');
?>