<?php
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename=GPA.htm');
echo @$_POST['x'];
?>