<?php
$course_name='下一代网络及软交换原理';
$course_code=array('IS409');
$course_teacher=array('陈凯');
$course_link=array(
	array('Wireshark','wireshark.website','http://www.wireshark.org'),
	array('voip-info.org','voip-info.website','http://www.voip-info.org'),
	array('Lua 5.1 Reference Manual','lua.manual','http://www.lua.org/manual/5.1/manual.html'),
	array('我的作品：ScoreBoard','','ScoreBoard.htm'),
	array('用Lua语言编写Wireshark dissector插件','','http://www.65536.cn/t/2008/Wireshark-Lua-dissector.htm'),
);
$course_keyword='NGN,SIP,Softswitch,H.323';
function course_content() {
?>
<h3>课程时间</h3>
<ul>
<li>6周上课</li>
<li>3周大作业，包括2次答疑：周2、周5下午3点 @ <a href="http://comic.sjtu.edu.cn/map/mh/?lat=-0.08789059053082421&lng=-79.27734375&zoom=5&type=Pic" onclick="c('comic.map')">老电工力学楼322</a></li>
</ul>
<h3>课程评分</h3>
<ul>
<li>24分平时成绩：每次课随机点名，每次不到扣2分</li>
<li>36分大作业1，40分大作业2</li>
</ul>
<div id="homework_text">
<h3>大作业1</h3>
<p>安装VoIP软件，可以进行点对点通话，用Wireshark截包</p>
<ol>
<li>每组提交一份文档，分析说明VOIP通话流程，至少画出流程图，并对协议细节分析说明</li>
<li>每组提交Wireshark截包原始报文</li>
</ol>
<p>说明</p>
<ul>
<li>只能够用Wireshark，其它软件不行</li>
<li>每个小组的VOIP软件不一样</li>
<li>一旦发现Wireshark截包中两个小组MAC地址一样，则认为抄袭</li>
</ul>
<p>提交日期：2009-01-09 18:00，上传到 ftp://kchen:public@public.sjtu.edu.cn</p>
<h3>大作业2</h3>
<p>学习网络编程和Wireshark软件插件编程，自定义一个网络协议，就该网络协议编写Wireshark插件，可以识别自定义协议</p>
<ol>
<li>自定义协议基于UDP</li>
<li>每组提交一份文档，说明自己网络协议，以及说明Wireshark插件流程图，文档中包括Wireshark截屏图</li>
<li>附录Wireshark源代码，Wireshark可执行库，以及原始截包文件</li>
</ol>
<p>提交日期：2008-12-18 20:00，上传到 ftp://kchen:public@public.sjtu.edu.cn</p>
</div>
<?php
}
function course_down() {
course_cate('课件');
course_file('课程安排','大作业要求','homework.ppt','kankan:gDcKL');
course_file('1 语音网络','电话,程控交换','01.ppt','skydrive:study2008/IS409_01.zip');
course_file('2 数据网络','Internet,IP,ATM,ADSL','02.ppt','skydrive:study2008/IS409_02.zip');
course_file('3 NGN体系结构','软交换Softswitch是NGN的核心','03.ppt','skydrive:study2008/IS409_03.zip');
course_file('4 NGN协议','VoIP：SIP和H.323协议','04.ppt','skydrive:study2008/IS409_04.zip');
course_file('5 NGN高级话题','下一代网络的安全','05.ppt','skydrive:study2008/IS409_05.zip');
course_cate('软件');
course_file('Wireshark 1.0.4 for Windows','','wireshark.win32','http://wireshark.zing.org/download/win32/wireshark-setup-1.0.4.exe');
course_file('Wireshark (other downloads)','','wireshark.download','http://wireshark.zing.org/download/');
course_file('Open Source VOIP Software','voip-info.org','voip-info.opensource','http://www.voip-info.org/wiki/view/Open+Source+VOIP+Software');
}
require '../course.php';
?>