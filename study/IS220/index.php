<?php
$course_name='信息安全管理体系及技术';
$course_code=array('IS220');
$course_teacher=array('张少俊');
$course_link=array(
);
$course_keyword='SNMP,CIM';
function course_content() {
?>
<h2>yoursunny自编习题</h2>
<ul>
<li><a href="p1.htm">信息安全管理体系 习题</a></li>
<li><a href="p2.htm">网络安全管理协议 习题</a></li>
<li><a href="p3.htm">网络安全事件管理 习题</a></li>
<li><a href="p4.htm">网络安全策略管理 习题</a></li>
</ul>
<p>引用小磊的口头禅：<b>没有我你就挂了</b>～enjoy</p>
<?php
}
function course_down() {
course_cate('课件 (ppt only)');
course_file('全部课件ppt','6个ppt的zip包','all.ppt','skydrive:study2008/IS220_ppt.zip');
//course_cate('课件+资料');
//course_file('课件+资料 请到教师的FTP获取','ftp://zshaojun:public@202.120.2.2','teacher.ftp','ftp://zshaojun:public@202.120.2.2');
}
require '../course.php';
?>