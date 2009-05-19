<?php
require_once 'common.php';
mustLogin();
if ($_POST['password1']==$_POST['password2']) {
	$db->execute_sql("UPDATE user SET password=MD5('".$_POST['password1']."') WHERE username='".$_SESSION['username']."' AND password=MD5('".$_POST['password0']."')");#vulnerable to SQL injection here
	if ($db->num_rows()>0) {
		header('Location: change_password_success.htm');
		exit;
	}
}
header('Location: change_password_failure.htm');
?>