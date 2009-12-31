<?php
$course_name='计算机通信网络';
$course_code=array('IS204');
$course_teacher=array('蒋兴浩');
$course_link=array(
);
$course_keyword='';
function course_down() {
course_cate('课件');
course_file('00 课程要求','','00.pdf','brsbox:322fd2d9aa2efc7e170eba7b592edc53');
course_file('01 概述','','01.pdf','brsbox:79df68c2c10949a415731cf737edc59a');
course_file('02 协议分层的基本原理','','02.pdf','brsbox:06566502a0a82a611c20e4832611c853');
course_file('03 现代通信网及其交换技术','','03.pdf','brsbox:5164dc9e5cc981d703334d59209f5509');
course_file('04 数据链路层','','04.pdf','brsbox:ab8d70fe55cb2a53957dd2faedba7267');
course_file('05 介质接入控制','','05.pdf','brsbox:c9b46632685964d830d310ceed92db09');
course_file('06 路由选择及网络拥塞控制','','06.pdf','brsbox:314f85248cd357be221661cec6ed9ed3');
course_file('07 网络互联','','07.pdf','brsbox:9803aa382522018a47dc26896bb72208');
course_file('08 传输层','','08.pdf','brsbox:b0f6ae720dd6f90b8f0864edf22238ff');
course_file('09 计算机通信网的高层','','09.pdf','brsbox:30bb497de5fee3fa3dc3ffd766653006');
course_file('复习课','','rev.pdf','brsbox:ec44470b09bdded1fcf1b09723a3cb27');
}
require '../course.php';
?>