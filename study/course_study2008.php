<?php
require '../../lib/reCAPTCHA.php';
function course_study2008($title,$desc,$file,$link,$key) {
	global $course_code;
	if ($_SERVER['REQUEST_METHOD']=='POST') {
		$result=reCAPTCHA_verify($_POST['c'],$_POST['r']);
		header('Content-Type: application/json');
		$url=($result=='success')?('http://d.yoursunny.cn:81/study2008/'.$key):NULL;
		echo json_encode(array('result'=>$result,'url'=>$url));
		exit;
	}
	course_downbefore($title,$desc,$file);
?>
<p>你下载的文件 <b><?php echo htmlspecialchars($title); ?></b> 来自本站vip下载服务器。</p>
<script type="text/javascript">WebSite.writeAd('728x90');</script>
<form id="f">
请输入图片中验证码以继续下载（<a href="javascript:WebSite.reCAPTCHA.show('reCAPTCHA_show');">换一个验证码</a>）：<br/>
<span id="reCAPTCHA_show"></span><br/>
<span id="download_captcha">
<input type="text" id="reCAPTCHA_input" style="width:300px;"/>
<input type="submit" value="下载"/>
</span>
<div id="download_link" style="line-height:24pt;"></div>
</form>
<script type="text/javascript">//<![CDATA[
function get_download(event) {
	new Ajax.Request('index.php?d=<?php echo $file; ?>',{parameters:{c:WebSite.reCAPTCHA.c,r:$F('reCAPTCHA_input')},onComplete:go_download});
	Event.stop(event);
}
function go_download(resp) {
	var o=resp.responseJSON;
	if (o.result!='success') {
		WebSite.reCAPTCHA.show('reCAPTCHA_show');
		$('reCAPTCHA_input').clear();
		alert('验证码错误，请重试\n'+o.result);
		return;
	}
	$('download_link').update('<a href="'+o.url+'" style="font-size:18pt;">'+o.url+'</a><br/>感谢你输入reCAPTCHA验证码，为图书数字化作出一份贡献');
	$('download_captcha').hide();
	c('/study/course_study2008.reCAPTCHA.solved');
	location=o.url;
}
Event.observe('f','submit',get_download);
WebSite.reCAPTCHA.show('reCAPTCHA_show');
//]]></script>
<?php
	course_downafter($title,$desc,$file);
}
?>