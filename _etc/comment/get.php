<?php
require_once '../common.php';
$page=$_POST['page'];

$db->query('SELECT * FROM ###comment WHERE page=?page AND pass=1 ORDER BY t DESC LIMIT 0,30',array('page'=>$page));

$a=array();
while (NULL!==($row=$db->read()))
{
	$row['time']=date('Y-m-d H:i:s',strtotime($row['t']));
	array_push($a,$row);
}

header('Content-Type: application/json');
echo json_encode($a);
?>