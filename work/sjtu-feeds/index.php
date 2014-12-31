<?php
if (@$_GET['a']=='opml') {
	header('Content-Type: text/x-opml');
	header('Content-Disposition: attachment; filename=sjtu-feeds.opml');
	readfile('opml.xml');
	exit;
}
include '../include/work.php';
?>