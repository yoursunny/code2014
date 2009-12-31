<?php
include 'utf8pinyin.php';
echo @$py->str2py($_REQUEST['q']);
?>