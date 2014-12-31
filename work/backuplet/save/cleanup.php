<?php
require_once 'config.php';

if (!isset($txtfile)) {
	$txtfile=getfilename('0_0');
	touch($txtfile);
}

$sfiles=scandir(USERDATA_DIR);
$wipe=filemtime($txtfile)-3600;
foreach ($sfiles as $sfile) {
	if ($sfile{0}!='.' && filemtime(USERDATA_DIR.$sfile)<$wipe) {
		unlink(USERDATA_DIR.$sfile);
	}
}
?>