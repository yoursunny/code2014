<?php
//error_reporting(-1);
//ini_set('display_errors','On');
date_default_timezone_set('Asia/Shanghai');
require_once 'dbMySQL.php';
$db=new dbMySQL('localhost','web5050369043','j2r9wEXe4hKFuUxu','web5050369043');

function query_json($sql,$param)
{
	global $db;
	header('Content-type: application/json');
	$a=array();
	$db->query($sql,$param);
	while (NULL!==($r=$db->read())) {
		array_push($a,$r);
	}
	echo json_encode($a);
}
?>