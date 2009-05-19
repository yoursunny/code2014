<?php
require_once 'common.php';
session_destroy();
header('Location: logout.htm');
?>