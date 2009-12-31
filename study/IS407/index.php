<?php
$course_name='现代密码学';
$course_code=array('IS407');
$course_teacher=array('黄征');
$course_link=array(
);
$course_keyword='';
function course_content() {
?>
<a href="p/">现代密码学 样卷</a>
<?php
}
function course_down() {
course_file('考试范围','','points.txt','kankan:biayce');
course_cate('课件');
course_file('01 概述','','01.pdf','skydrive:study2008/IS407_01.zip');
course_file('02 古典加密','','02.pdf','skydrive:study2008/IS407_02.zip');
course_file('03 分组加密技术','+对称加密算法动画演示','03.pdf','skydrive:study2008/IS407_03.zip');
course_file('04 保密通讯','','04.pdf','skydrive:study2008/IS407_04.zip');
course_file('05 公钥密码','RSA,ECC,可证安全','05.pdf','skydrive:study2008/IS407_05.zip');
course_file('06 认证、散列函数、数字签名','+相同MD5值的不同程序','06.pdf','skydrive:study2008/IS407_06.zip');
course_file('07 密钥管理','','07.pdf','skydrive:study2008/IS407_07.zip');
/*
course_cate('参考书 [arwin提供]');
course_file('Lecture Notes on Cryptography','麻省理工学院密码学讲义','book1.pdf','namipan:ff617bf5044012e5938c927a9fa59c136ba7da0830b21600');
course_file('密码编码学与网络安全：原理与实践（第三版）','[美]William Stllings著','book2.pdf','namipan:2086d0d0d0d19f89170c12b0ca82c4c9920ab36b33f6ec01');
course_file('现代密码学理论与实践','[英]Wenbo Mao著','book3.pdf','namipan:c10467a184153782ea2877a00915c82b71c8023648e71701');
course_file('应用密码学','王衍波 薛通编著','book4.pdf','namipan:048340b38f09c8be4aa35b612cdba79eb250f85bb2ac5a00');
*/
}
require '../course.php';
?>