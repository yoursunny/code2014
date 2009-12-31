<?php
$m='['.$_REQUEST['u'].'] '.$_REQUEST['m'];
require_once 'fetion.php';
$fetion=new Fetion('15900941215');
$fetion->login('o7j7k3w5');
$fetion->sendSMS(NULL,$m);
?>