<?php
$tar_file='php_manual_zh.tar.gz';
$tar_isgz=TRUE;
$get_file=$_SERVER['PATH_INFO'];
if ($get_file=='') {
	header('HTTP/1.1 403 Forbidden');
	exit;
}
$mime=array(
	'htm'=>'text/html',
	'html'=>'text/html',
	'css'=>'text/css',
	'js'=>'text/javascript',
	'jpg'=>'image/jpeg',
	'png'=>'image/png',
	'gif'=>'image/gif',
);

$tar=fopen($tar_file,'rb');
if ($tar_isgz) {
	fseek($tar,10);
	stream_filter_append($tar,'zlib.inflate');
}
$archive_end=str_repeat(chr(0),512);
$found_file=FALSE;
while (FALSE !== ($header=fread($tar,512))) {
	if ($header==$archive_end) break;
	$fname=substr($header,0,100);
	$fname='/'.substr($fname,0,strpos($fname,chr(0)));
	$fsize=octdec(substr($header,124,12));
	$blocks=ceil($fsize/512);
	$last_block_size=$fsize%512;
	$last_block=$last_block_size==0?$blocks:$blocks-1;
	$output=($fname==$get_file);
	if ($output) {
		header('Content-Length: '.$fsize);
		if (FALSE!==($ext=strrchr($fname,'.'))) {
			$ext=strtolower(substr($ext,1));
			if (array_key_exists($ext,$mime)) header('Content-Type: '.$mime[$ext]);
		}
	}
	for ($i=0;$i<$blocks;++$i) {
		if (!$output) fread($tar,512);
		else {
			if ($i<$last_block) echo fread($tar,512);
			else {
				echo fread($tar,$last_block_size);
				$found_file=TRUE;
				break;
			}
		}
	}
}
if (!$found_file) {
	header('HTTP/1.1 404 Not Found');
}
fclose($tar);
?>