<?php
$course_name='数字信号处理';
$course_code=array('IS210');
$course_teacher=array('陈亚骏');
$course_link=array(
);
$course_keyword='超声波,水声信道,扩频,CDMA';
function course_content() {
?>
<ul>
<li><a href="p.wps" onclick="c('p.wps')">超声波水下扩频通信系统的设计</a> wps2007格式</li>
<li><a href="p.pdf" onclick="c('p.pdf')">超声波水下扩频通信系统的设计</a> pdf格式</li>
</ul>
<?php
}
require '../course.php';
?>