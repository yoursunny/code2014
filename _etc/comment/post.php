<?php
require_once '../common.php';
$page=$_POST['page'];
$person=$_POST['person'];
$link=$_POST['link'];
$msg=$_POST['msg'];

$db->execute('INSERT INTO ###comment (page,t,person,link,msg,pass) VALUES (?page,NOW(),?person,?link,?msg,0)',array('page'=>$page,'person'=>$person,'link'=>$link,'msg'=>$msg));

echo 'OK';
?>