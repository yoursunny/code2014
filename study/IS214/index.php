<?php
$course_name='数据库原理';
$course_code=array('IS214');
$course_teacher=array('马进');
$course_link=array(
);
$course_keyword='';
function course_content() { ?>
<a href="digi.htm">数据库应用系统设计作业：数码商品进销存管理</a>
<?php }
function course_down() {
course_cate('课件');
course_file('01 数据库系统概论','','01.pdf','skydrive:study2008/IS214_01.zip');
course_file('02 关系模型和关系运算','','02.pdf','skydrive:study2008/IS214_02.zip');
course_file('03 关系规范化基础','','03.pdf','skydrive:study2008/IS214_03.zip');
course_file('04 结构化查询语言SQL','','04.pdf','skydrive:study2008/IS214_04.zip');
course_file('05 数据库应用系统设计','','05.pdf','skydrive:study2008/IS214_05.zip');
course_file('06 数据库安全性','','06.pdf','skydrive:study2008/IS214_06.zip');
}
require '../course.php';
?>