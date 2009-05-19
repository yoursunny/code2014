<?php
require_once 'dbMySQL.php';
# WARNING: According to customer's request, this application is vulnerable to SQL injection attacks. No production use!
$db=new dbMySQL('127.0.0.1','simple_news','MnzBxYhrfsQGbCR6','simple_news','',FALSE);

function mustLogin() {
	session_start();
	if (!isset($_SESSION['username'])) {
		header('Location: login.htm');
		die;
	}
}
?>