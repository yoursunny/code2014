<?php
//网盘下载，iframe嵌入、显示tip红框

function course_brsbox($title,$desc,$file,$link,$key) {
	course_disk1($title,$desc,$file,'http://www.brsbox.com/filebox/down/fc/'.$key,800,300,615,180);
}
function course_namipan($title,$desc,$file,$link,$key) {
	course_disk1($title,$desc,$file,'http://www.namipan.com/d/'.$key,640,400,410,340);
}

//width=iframe宽度,height=iframe高度,left=红框左起位置,top=红框上起位置,
function course_disk1($title,$desc,$file,$url,$width,$height,$left,$top) {
	global $course_name,$course_code,$course_teacher,$course_link;
	course_downbefore($title,$desc,$file);
?>
<iframe id="iframe_disk1" src="<?php echo $url; ?>" width="<?php echo $width; ?>" height="<?php echo $height; ?>" frameborder="0" scrolling="no"></iframe>
<script type="text/javascript">WebSite.writeAd('728x90');</script>
<div id="tip" onclick="$(this).hide()" style="display:none;position:absolute;z-index:100;width:100px;height:70px;border:solid 8px #FF0000;">&nbsp;</div>
<script type="text/javascript">
{
	var pos=$('iframe_disk1').cumulativeOffset();
	$('tip').setStyle({left:''+(pos.left+<?php echo $left; ?>)+'px',top:''+(pos.top+<?php echo $top; ?>)+'px'}).show();
}
</script>
<?php
	course_downafter($title,$desc,$file);
}
?>