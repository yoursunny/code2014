<?php
$course_name='嵌入式系统原理与应用';
$course_code=array('IS222');
$course_teacher=array('刘海涛');
$course_link=array(
	array('复习提纲','','outline.htm'),
	array('OldLinux Linux内核讨论','res.oldlinux','http://oldlinux.org'),
);
$course_keyword='SkyEye,ARM';
function course_content() {
?>
<a href="outline.htm">复习提纲</a><br/>
<a href="w1.htm">作业一：嵌入式系统市场 之 家用游戏主机</a><br/>
<a href="w2.htm">作业二：Linux@ARM</a>
<?php
}
require '../course.php';
?>