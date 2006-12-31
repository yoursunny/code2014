<?php
$count=3;
header('Status: 302 Moved');
header('Location: '.rand(1,$count).'.mp3');
?>