<?php
require_once 'common.php';
if ($uid==NULL) {
	header('HTTP/1.1 403 Please Login');
	header('X-PhoneBook-Login: required');
	die('Please Login');
}
header('Content-Type: application/xml');
header('Content-Disposition: attachment; filename='.$uid.'.xml');
readfile(UserFileName());
?>