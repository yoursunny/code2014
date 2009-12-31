<?php
header('Content-Type: text/javascript');
header('Cache-Control: max-age=0');
$f=@$_GET['f'];
if (in_array($f,array('init.js','talk.js','main.js','signin.js','conversation.js'))) readfile($f);
?>