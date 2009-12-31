<?php
//start a backuplet save session
$cb=@$_GET['cb'];
if (!preg_match('/^[\w\.]+$/',$cb)) die('invalid callback');

$sid=time().'_'.mt_rand();
touch('userdata/'.$sid.'.txt');

echo $cb.'("'.$sid.'");';

//cleanup
$sfiles=scandir('userdata');
$wipe=filemtime('userdata/'.$sid.'.txt')-3600;
foreach ($sfiles as $sfile) {
	if ($sfile{0}!='.' && filemtime('userdata/'.$sfile)<$wipe) {
		unlink('userdata/'.$sfile);
	}
}
?>