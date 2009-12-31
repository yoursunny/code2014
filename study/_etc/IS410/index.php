<?php
$course_name='路由器原理';
$course_code=array('IS410');
$course_teacher=array('刘军荣');
$course_link=array(
array('工大瑞普Cisco网络技术论坛','ciscobbs','http://ciscobbs.njut.edu.cn')
);
$course_keyword='路由器,IP寻址,ip route,cisco,RIP,BGP,路由过滤';
function course_content() {
?>
<p>某MM要求我弄一份实验报告，但是我弄不到。于是就搞了一个实验环境，无奈自己的计算机内存不足无法做实验。<br/>
用工大瑞普改编的Dynamips搭建的，自己写了拓扑文件（net/IS410.net）和画了拓扑图（top/top.png）。</p>
<?php
}
function course_down() {
course_file('Dynamips实验环境+拓扑','系统需求：1G内存、3G硬盘','Dynamips.7z','http://www.namipan.com/d/a4ae998d5a4356d431d5b1d25a98a94801b0b0d8b331c000');
}
require '../course.php';
?>