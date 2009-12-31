<?php
require 'course_downpage.php';
//网盘下载，iframe嵌入、显示tip红框

function course_brsbox($title,$desc,$file,$link,$key) {
	course_disk1($title,$desc,$file,'http://www.brsbox.com/filebox/down/fc/'.$key,800,300,615,180,2);
}
function course_namipan($title,$desc,$file,$link,$key) {
	course_disk1($title,$desc,$file,'http://www.namipan.com/d/'.$key,640,400,410,340,2);
}
function course_cech($title,$desc,$file,$link,$key) {
	// http://fs%1.bay.cech.com.cn/download/file_share_%2.html , $key=%1/%2
	$k=explode('/',$key);
	course_disk1($title,$desc,$file,'http://fs'.$k[0].'.bay.cech.com.cn/download/file_share_'.$k[1].'.html',400,370,75,205,1);
}
function course_skydrive($title,$desc,$file,$link,$key) {
	course_disk1($title,$desc,$file,'http://cid-1fa4aa816e7dc9f3.skydrive.live.com/embedrowdetail.aspx/'.urlencode(str_replace('_','|_',$key)),240,66,-1,-1,1);
}

//width=iframe宽度,height=iframe高度,left=红框左起位置(-1为不显示红框),top=红框上起位置,
function course_disk1($title,$desc,$file,$url,$width,$height,$left,$top,$style) {
	global $course_name,$course_code,$course_teacher,$course_link;
	course_downbefore($title,$desc,$file,$style);
?>
<iframe id="iframe_disk1" src="<?php echo $url; ?>" width="<?php echo $width; ?>" height="<?php echo $height; ?>" frameborder="0" scrolling="no"></iframe>
<?php if ($left>=0) { ?>
<div id="tip" onclick="$(this).hide()" style="display:none;position:absolute;z-index:100;width:100px;height:70px;border:solid 8px #FF0000;">&nbsp;</div>
<script type="text/javascript">
{
	var pos=$('iframe_disk1').cumulativeOffset();
	$('tip').setStyle({left:''+(pos.left+<?php echo $left; ?>)+'px',top:''+(pos.top+<?php echo $top; ?>)+'px'}).show();
}
</script>
<?php
}
	course_downafter($title,$desc,$file,$style);
}
?>