<?php

if (preg_match('/^59\.78\.(?:20|28)\.\d{1,3}$/',$_SERVER['REMOTE_ADDR']))
{
	header('Content-Type: application/vnd.ms-powerpoint');
	header('Content-Disposition: attachment; filename=rev.ppt');
	header('Content-Encoding: gzip');
	readfile('rev.ppt.gz');
}

?>