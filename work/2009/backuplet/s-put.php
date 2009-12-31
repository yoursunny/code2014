<?php
//put some data to a session file
$sid=@$_GET['sid'];
if (!preg_match('/^[\w\.]+$/',$sid)) die('invalid sid');

if (!file_exists('userdata/'.$sid.'.txt')) die('unknown sid');

file_put_contents('userdata/'.$sid.'.txt',$_POST['data'],FILE_APPEND);
?>