<?php
$course_name='操作系统';
$course_code=array('IS206');
$course_teacher=array('李小勇','刘功申');
$course_link=array(
	array('Nachos专题页','','nachos.htm'),
	array('教师FTP','teacher.ftp','ftp://xiaoyongli:public@202.120.2.2/os-ppt/'),
	array('电子工程系《操作系统》课程网站','res.EE-OS','http://ee.sjtu.edu.cn:8080/os/default.asp'),
	array('软件工程系《操作系统》课程网站','res.SE-OS','http://cse.sjtu.edu.cn/OS/OS.htm'),
	array('饮水思源OS板精华区','res.bbs-OS','http://bbs.sjtu.edu.cn/bbs0an?path=%2Fgroups%2FGROUP%5F3%2FOS'),
);
$course_keyword='Nachos,进程调度,虚拟存储,虚拟内存,文件系统原理,目录项,页表项';
function course_content() {
?>
<p><b>Nachos: Not Another Completely Heuristic Operating System</b><br />
Nachos是一个操作系统课程的教学软件。关于Nachos的所有信息，请查看本站的<a href="nachos.htm">Nachos专题页</a>。</p>
<?php
}
function course_down() {
course_cate('课件PPT');
//course_file('打包下载全部课件','','IS206.7z','http://www.namipan.com/d/e40015643b47eb3c9a064bb00faf3f5b2121478a7a517200');
course_file('课程简介','','00.ppt','brsbox:28727be257584fe9ad374758d1bcdea0');
course_file('01讲 计算机系统发展回顾','','01.ppt','brsbox:1aab662bb7a69a291faf5ff401b20a9b');
course_file('02讲 计算机系统概述','','02.ppt','brsbox:9384bd7b26781805f3538c2b9266e427');
course_file('03讲 进程管理、线程管理','','03.ppt','brsbox:1fedf9049424e7877ec6eb4179b477d2');
course_file('04讲 进程通信','','04.ppt','brsbox:170fd930ab7771668e43fa689195183b');
course_file('05讲 存储管理','','05.ppt','brsbox:634955d98110dbf7b3c40e67df0ff7ba');
course_file('06讲 文件系统','','06.ppt','brsbox:efb99edfa2529da99cfd4b39a5112bff');
course_file('07讲 文件系统:ext2','','07.ppt','brsbox:83dc7f17c437ea1a94b2e76549f6048e');
course_file('08讲 IO系统','','08.ppt','brsbox:c80d5bc8b3d6da48ede91a3215b0c722');
course_cate('Nachos相关资源');
course_file('Nachos专题页','','','nachos.htm');
course_file('Nachos介绍课件','','nachos-intro.ppt','brsbox:c93b7172bcde0481e3bc0e0499fbbd98');
course_file('C++ 4.1 源码','','nachos_cpp41.zip','cech:1/11417071');
course_file('Java 5.0 源码','','nachos_java50.zip','cech:1/11417081');
course_cate('陆松年《操作系统教程》第2版');
course_file('第1章 操作系统概论','','book01.pdf','http://ee.sjtu.edu.cn:8080/os/PDF/JiaoCai/01.pdf');
course_file('第2章 存储管理','','book02.pdf','http://ee.sjtu.edu.cn:8080/os/PDF/JiaoCai/02.pdf');
course_file('第3章 进程管理','','book03.pdf','http://ee.sjtu.edu.cn:8080/os/PDF/JiaoCai/03.pdf');
course_file('第4章 进程通信','','book04.pdf','http://ee.sjtu.edu.cn:8080/os/PDF/JiaoCai/04.pdf');
course_file('第5章 设备管理','','book05.pdf','http://ee.sjtu.edu.cn:8080/os/PDF/JiaoCai/05.pdf');
course_file('第6章 文件系统','','book06.pdf','http://ee.sjtu.edu.cn:8080/os/PDF/JiaoCai/06.pdf');
}
require '../course.php';
?>