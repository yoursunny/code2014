<?php
$course_name='Internet安全协议与标准';
$course_code=array('IS216');
$course_teacher=array('张保稳');
$course_link=array(
);
$course_keyword='';
function course_content() {
?>
<a href="./?question=list">练习题</a>
<?php
}
function course_down() {
course_cate('电子书');
course_file('安全协议理论和方法','范红 冯登国','book.pdf','brsbox:45b02ae33aa90d55c327ae3737e5dd8c');
course_cate('课件');
course_file('概论','概论、安全协议','intro.zip','brsbox:1476ad1afe84d378408d2c1f0ac886df');
course_file('安全协议','Kerberos、IPSec、SSL、SET、PGP、CSP','protocol.zip','brsbox:476642f3d48da3d5d5c1b85338662ab1');
course_file('协议分析','BAN、SVO、CSP、串空间','analyze.zip','brsbox:9027b87102ec3c50dbd23f3fdf241287');
course_file('课程总结','Kerberos、IPSec、SSL、SET、PGP、CSP','review.ppt','kankan:z1Zxd');
}
if (isset($_GET['question'])) {
	require '../topic.php';
	$byline=<<<EOT
<a href="?question=list">返回目录</a>
<a id="show_all_keys" href="javascript:;" onclick="$$('.q .hidekey').each(function(d){d.innerHTML=d.key;d.removeClassName('hidekey');})">显示所有答案</a>
<script type="text/javascript">//<![CDATA[
Event.bindReady(function(){
	var show_key=function(){
		this.innerHTML=this.key;
		this.removeClassName('hidekey');
	};
	var keys=$$('.q .key');
	if (keys.length<1) $('show_all_keys').hide();
	keys.each(function(d){
		d.key=d.innerHTML;
		d.addClassName('hidekey');
		d.innerHTML='显示答案';
		d.observe('click',show_key);
	});
});
//]]></script>

EOT;
	$basestyle=<<<EOT
.q { font-size:11pt; }
.q .key { color:#006600; }
.q .hidekey { color:#3366FF; cursor:pointer; }

EOT;
	topic('topic.htm',$_GET['question'],$byline,$basestyle);
} else 
	require '../course.php';
?>