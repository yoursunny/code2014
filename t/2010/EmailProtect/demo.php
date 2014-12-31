<?php
$text=$_GET['text'];
$l=$_GET['l'];
//<img src="?l=1" style="background:url(?l=0)">
//<img src="?l=2"><img src="?l=3">


$strlen=strlen($text);
switch ($l) {
	case 2:
		$strlen=floor($strlen*0.618);
		$text=substr($text,0,$strlen);
		break;
	case 3:
		$strstart=floor($strlen*0.618);
		$strlen-=$strstart;
		$text=substr($text,$strstart);
		break;
}
$width=8*$strlen;
$height=16;

$img=imagecreate($width,$height);
$color_bg=imagecolorallocate($img,mt_rand(240,255),mt_rand(240,255),mt_rand(240,255));
$color_noise=array();
for ($i=0;$i<8;++$i) $color_noise[]=imagecolorallocate($img,mt_rand(160,191),mt_rand(160,191),mt_rand(160,191));
$color_fg=array();
for ($i=0;$i<8;++$i) $color_fg[]=imagecolorallocate($img,mt_rand(0,63),mt_rand(0,63),mt_rand(0,63));
$color_transparent=imagecolorallocate($img,128,128,128);
imagecolortransparent($img,$color_transparent);

$noise=$width*$height/16;
for ($i=0;$i<$noise;++$i) imagesetpixel($img,mt_rand(0,$width-1),mt_rand(0,$height-1),$color_noise[mt_rand(0,7)]);

for ($i=0;$i<$strlen;++$i) {
	$ch=substr($text,$i,1);
	if ($l<2) {
		$drawtype=sqrt(ord($ch)+$i);
		$drawtype=floor($drawtype*1000%1000/250);
		switch ($drawtype) {
			case 0://char on l0, transparent on l1
				if ($l==0) imagechar($img,4,8*$i,0,$ch,$color_fg[mt_rand(0,7)]);
				else imagefilledrectangle($img,8*$i,0,8*($i+1)-1,$height-1,$color_transparent);
				break;
			case 1://fill on l0, char transparent on l1
				if ($l==0) imagefilledrectangle($img,8*$i,0,8*($i+1)-1,$height-1,$color_fg[mt_rand(0,7)]);
				else imagechar($img,4,8*$i,0,$ch,$color_transparent);
				break;
			case 2://nothing on l0, char + transparent on l1
				if ($l==0) {
				} else {
					imagefilledrectangle($img,8*$i,0,8*($i+1)-1,$height-1,$color_transparent);
					imagechar($img,4,8*$i,0,$ch,$color_fg[mt_rand(0,7)]);
				}
				break;
			case 3://other char on l0, char on l1
				if ($l==0) imagechar($img,4,8*$i,0,chr(mt_rand(97,122)),$color_fg[mt_rand(0,7)]);
				else imagechar($img,4,8*$i,0,$ch,$color_fg[mt_rand(0,7)]);
				break;
		}
	} else {
		imagechar($img,4,8*$i,0,$ch,$color_fg[mt_rand(0,7)]);
	}
}

header('Content-Type: image/png');
imagepng($img);
imagedestroy($img);
?>