<?php
ob_start();
phpinfo();
file_put_contents('x.php.txt',ob_get_clean());
?>