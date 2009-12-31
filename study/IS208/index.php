<?php
$course_name='数字系统设计、FPGA应用实验';
$course_code=array('IS208','IS209');
$course_teacher=array('宦飞');
$course_link=array(
);
$course_keyword='Verilog,VHDL,数字电路,数电,数字逻辑,组合逻辑,时序逻辑,Verilog语法,Verilog举例,Verilog标准,IEEE1364,Xilinx,Altera,SoC,SoPC,FPGA,CPLD,FPGA设计,FPGA实验,Verilog编程,Verilog参考';
function course_content() {
/*<h2>教学工具光盘</h2>
<ul>
<li>仿真工具Mentor Graphics ModelSim SE 6.1f</li>
<li>综合工具Synplify Pro v8.1</li>
<li>安装说明</li>
</ul>
<p>光盘下载地址：<a href="ftp://IS208:Verilog@202.120.54.34" target="_blank" onclick="c('cdrom.ftp')">ftp://IS208:Verilog@202.120.54.34</a> 用户名IS208 密码Verilog (每IP允许2个登录，总共10个登录)<br />
允许的IP地址范围：59.78.17.0/23,59.78.29.0/23,59.78.25.0/24,59.78.27.0/23<br />
教学工具仅限学习和研究使用，严禁用于商业用途，否则后果自负！</p>
<h2>作业</h2>
<p>共18题，截止时间为2008-06-02 08:00<br/>
<a href="homework.htm">作业题在线阅读</a>，PDF及我的答案在下面资源下载区</p>
2008年7月考试重点：课本2,3,4,5,6,7,8,12,14章

<a href="change-time.htm">实验时间变更申请</a>
*/
?>
实验报告样本已到，请看下载区。
<?php
}
function course_down() {
course_cate('FPGA应用实验');
course_file('00 实验准备 熟悉开发环境和开发板','','lab00.pdf','kankan:c5g2b');
course_file('01 利用8个发光二极管（LED）形成流水灯显示','','lab01.pdf','kankan:i4dddj');
course_file('02 发光二极管（LED）的开关电路设计','','lab02.pdf','kankan:q4dc3c');
course_file('03 蜂鸣器发声控制电路模块设计','','lab03.pdf','kankan:w4cacac');
course_file('04 发光二极管（LED）的编码控制开关电路设计','','lab04.pdf','kankan:x4bddcf');
course_file('05 设计一个逆序循环计数器','','lab05.pdf','kankan:u4bu0');
course_file('06 使用4个LED数码管显示秒计数','','lab06.pdf','kankan:u4aIdg');
course_file('07 设计一个电子时钟','','lab07.pdf','kankan:d4Y5i');
course_file('08 设计一个十字路口的交通信号灯控制器','','lab08.pdf','kankan:j4Qabb');
course_file('全部实验题目','','labs.7z','study2008:IS209_labs.7z');
course_file('实验报告样本','','report-sample.doc','study2008:IS209_report-sample.zip');
//course_file('打包下载全部课件','+作业答案','IS208.7z','http://www.namipan.com/d/34f840b259da17094e29d342e17bc2310aeaa77bc8fbea00');
course_cate('课件');
course_file('数字系统设计概述','','00.pdf','brsbox:e93f2df1b1b955b03d831079cde94058');
course_file('01 SoC(SoPC)设计基础','','01.pdf','brsbox:1a2e0d68944984636c97e1396af69ace');
course_file('02 Verilog的基本概念','','02.pdf','brsbox:90e117821373619c93f1d4bc95878d2a');
course_file('03 Verilog的语言基础','+ ModelSim仿真教程','03.pdf','brsbox:51c598aafc0a7de1299887c544ca3ab0');
course_file('04 门级建模','','04.pdf','brsbox:8245fa40528e9335365744aadc4d603e');
course_file('05 数据流建模','','05.pdf','brsbox:f094b6052cf24ca6966f43cba97f362f');
course_file('06 行为建模','','06.pdf','brsbox:f178073a1c62756db29ddfb5397b2c22');
course_file('07 任务和函数','','07.pdf','brsbox:23f75d72b4218438047834c0ce9a224e');
course_file('08 用户自定义原语(UDP)','','08.pdf','brsbox:a56d2490a113113d72defea9e5870b37');
course_file('10 组合逻辑设计','','10.pdf','brsbox:c30b607c1f8bd955658de43512be6f06');
course_file('11 时序逻辑设计','','11.pdf','brsbox:de054e105598fc6ee0f81008fdb2f75d');
course_file('12 使用VerilogHDL进行综合','+ FPGA技术、器件和工具','12.pdf','brsbox:54346a718d5e0c15b481e7e41c1a4989');
//course_cate('教学工具 &amp; 参考资料');
//course_file('教学工具光盘','ModelSim和Synplify','cdrom.ftp','ftp://IS208:Verilog@202.120.54.34');
course_cate('参考资料');
course_file('IEEE 1364-2001','','IEEE13642001.pdf','brsbox:3e71982f20fd37a12a355037781268cc');
course_file('IEEE 1364-2005','','IEEE13642005.pdf','brsbox:7fa548f7c5dfd40ecd7b2a49bf3af24b');
course_cate('作业');
course_file('作业题','+ 模板、辅助材料','homework.pdf','brsbox:cdeba2ae270c731d8f2d949efe3597d6');
course_file('作业题','在线阅读','','homework.htm');
course_file('参考答案','教师提供','a.zip','brsbox:4b9431070f348a8be1d9ab3e21d9f716');
course_file('我的答案','解压后打开index.htm查看','w.7z','brsbox:48f6db3616b9a7eef28dee5c88305a20');
}
require '../course.php';
?>