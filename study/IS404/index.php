<?php
$course_name='数据通信';
$course_code=array('IS404');
$course_teacher=array('张文军');
$course_link=array(
);
$course_keyword='数据通信,网络设计,OSI七层模型,OSI七层,信号编码,网络信号,局域网,接入网,cisco交换机vlan';
function course_content() {
?>
<p>2008-06-05测验内容</p>
<ol>
<li>基本概念<ul>
<li>基本网络拓扑结构？</li>
<li>信号传输模式？</li>
<li>链路线路配置有哪些模式？</li>
<li>复用方式主要包括哪些？</li>
<li>常见的有线传输介质包括哪些？</li>
<li>通信信道的分类？</li>
<li>数字链路的传输控制过程？</li>
<li>OSI模型下面3层的功能介绍？</li>
</ul></li>
<li>10011100的NRZ、曼彻斯特、差分曼彻斯特及AMI编码</li>
<li>计算110011的CRC冗余码（CRC多项式为1101）</li>
<li>四个250字节速率的数据源进行时分多路复用，给出数据源的数据速率、每个字符的持续时间、帧速率、每帧持续时间、每帧的位数和链路的数据速率</li>
<li>给出课本144页网络的基本路由、下一跳简化、网络地址简化，并且给出主机D的特定主机路由</li>
<li>给出课本204页网络结构的网络配置过程（配置主机和IP地址、配置Vlan（域名和密码为sjtu），并且进行模式切换，随后进行配置检测和保存）</li>
<li>给出图示网络的生成树<a href="http://i1.6.cn/tu.6.cn/6c/2d/d5/9bcfa33699f5fc93f2496bfe5df59d3a.jpg">查看图片</a></li>
</ol>
<?php
}
function course_down() {
//course_file('打包下载全部课件','','IS404.7z','http://www.namipan.com/d/27bee1eade533ab7aa13c96d94a5d89bd12d9b6527aaa901');
course_cate('概述');
course_file('01 数据通信系统','','01.ppt','brsbox:2d60ecefd6b63bb49a37331f37a8235c');
course_file('02 基本概念','','02.ppt','brsbox:03fbde680ffeb8c606d14f818603ee1c');
course_file('03 OSI网络参考模型','','03.ppt','brsbox:c16c5e27804d131a3e2eafdd6cfa0960');
course_cate('物理层');
course_file('04 信号','','04.ppt','brsbox:0762d0e64b3a483831a7208f5efb8f9c');
course_file('05 编码与调制','','05.ppt','brsbox:5e39d662315739c2a3c9dce45c3cdb1c');
course_file('06 数字数据传输','','06.ppt','brsbox:219e62be9341e8ea92f5ae23879244ef');
course_file('07 传输介质','','07.ppt','brsbox:a68457c2c9e03af65aa1c0d69f51e51b');
course_file('08 复用技术','','08.ppt','brsbox:f5fa1d6820a85e4b6855ed7c3795f0ac');
course_file('09 差错控制','','09.ppt','brsbox:0ffaafc641abebe07719a21b88f009fd');
course_cate('数据链路层');
course_file('10 数据链路控制','','10.ppt','brsbox:bf97a45c83d212ae6f8d7bb2770c31de');
course_file('11 数据链路协议','','11.ppt','brsbox:65127a95d054a24505ba84fcdad1baba');
course_cate('局域网');
course_file('12 局域网','','12.ppt','brsbox:e9e4ab641401b572665da35c1562eebe');
course_file('13 无线局域网','','13.ppt','brsbox:99d546c544ee3bd3dd5140fec1d4779d');
course_file('14 高速数字接入','','14.ppt','brsbox:723be78148b28bfa4f7f4998b2748ac5');
course_file('15 接入网、主干网、VLAN','','15.ppt','brsbox:e9af1eb5eae9c1c023ce5143a75b899d');
course_file('16 点对点协议','','16.ppt','brsbox:f9e4a33ddcb1465ffe5839a893425ca9');
course_file('17 路由器和第三层交换','','17.ppt','brsbox:f93a82820ee93d0f090d44335cfb6766');
course_cate('网络设备配置');
course_file('19 交换机、路由器配置','pptx/ppt','19.pptx','brsbox:d4b0adb640a1e04ad6e8bb6c44bf7f15');
course_file('20 CISCO路由器管理','pptx/ppt','20.pptx','brsbox:df3773b04c7312b40eac8942ac2a6ecd');
course_cate('网络设计');
course_file('01 网络基本需求','','21.ppt','brsbox:9b34227b3e80c9c8171005c32d07ddf6');
course_file('02 现有网络的特征分析','','22.ppt','brsbox:3ca7c866a34d00bc65794a0eaffa8178');
course_file('03 分析网络流量特征','','23.ppt','brsbox:430503941bf291ad6f62bc28c8cacf85');
course_file('04 设计网络拓扑结构','','24.ppt','brsbox:0f5f71f705571d44280422dcc68545b3');
course_file('05 设计编址和命名模型','','25.ppt','brsbox:494f6da2e6ca252e6d6c65efcafc094d');
course_file('06 选择交换和路由协议','','26.ppt','brsbox:68f22f3d3452a3dffa82d40164af1ee5');
course_file('07 制订网络安全策略','','27.ppt','brsbox:7021b061aa4288be20812756209563c5');
course_file('08 选择园区网络技术和设备','','28.ppt','brsbox:b65ecfe6273bc469273ae5433ae8c586');
}
require '../course.php';
?>