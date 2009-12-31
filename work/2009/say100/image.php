<?php
header('Content-type: image/png');
$q=iconv('gbk','utf-8',$_GET['q']);
$im=imagecreate(500,300);
$bg=imagecolorallocatealpha($im,255,255,255,127);
$textcolor=imagecolorallocate($im,0,0,255);
imagettftext($im,12,0,0,150,$textcolor,realpath('fzytk.ttf'),$q);
imagepng($im);
imagedestroy($im);
?>
