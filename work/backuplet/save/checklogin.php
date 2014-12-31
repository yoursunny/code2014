<?php
//check login status
require_once 'config.php';
$cb=@$_GET['cb'];
if (!is_callback($cb)) die('invalid callback');

require_once '../../../lib/login/loginsession.php';
$ls=loginsession_get();
$name=$ls['name'];
if (!$name) $name=$ls['uid'];

header('Content-Type: text/javascript');
echo $cb.'('.($ls?json_encode($name):'false').');';
?>