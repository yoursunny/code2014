<?php
$course_name='信息安全工程原理';
$course_code=array('IS221');
$course_teacher=array('周宁');
$course_link=array(
);
$course_keyword='';
function course_content() {
?>
<a href="./?topic=index">知识要点</a>
<?php
}
function course_down() {
course_file('作业说明','','homework.pdf','kankan:wddVsj');
course_cate('课件');
course_file('01 绪论：信息安全与信息安全工程','','01.pdf','skydrive:study2008/IS221_01.zip');
course_file('02 系统工程与信息系统安全工程','','02.pdf','brsbox:87b4e01e61605770eb99fe92910bab1f');
course_file('03 SSE-CMM','系统安全工程能力成熟模型,过程域,能力级别','03.pdf','skydrive:study2008/IS221_03.zip');
course_file('04 风险管理','风险管理,风险评估','04.pdf','brsbox:a1c08dd85bca96372e71bf58765df46a');
course_file('05 CC','共同准则','05.pdf','brsbox:74c0d376b9c3739d10bdb76cd02571a6');
course_file('复习要点','','review.ppt','brsbox:93b3ea0c54f4b719e52e5ad9494b5bd7');
}
if (isset($_GET['topic'])) {
	require '../topic.php';
	$byline=<<<EOT
<a href="?topic=index">返回目录</a>
<script type="text/javascript">//<![CDATA[
Event.bindReady(function(){
	var show_key=function(){
		this.innerHTML=this.key;
		this.removeClassName('hidekey');
	};
	$$('.q .key').each(function(d){
		d.key=d.innerHTML;
		d.addClassName('hidekey');
		d.innerHTML='显示答案';
		d.observe('click',show_key);
	});
});
//]]></script>

EOT;
	$basestyle=<<<EOT
.q { font-family:"楷体_GB2312"; font-size:11pt; }
.q .key { color:#006600; }
.q .hidekey { color:#3366FF; cursor:pointer; }

EOT;
	topic('topic.htm',$_GET['topic'],$byline,$basestyle);
} else 
	require '../course.php';
?>