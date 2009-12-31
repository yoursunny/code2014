<?php
$course_name='Windows安全原理与技术';
$course_code=array('IS219');
$course_teacher=array('王轶骏');
$course_link=array(
);
$course_keyword='';
function course_content() {
?>
<p><a href="http://kankan.baihui.com/docs/ddbm0d" rel="external" onclick="c('homework.req')">小作业要求</a>，12月28日交；<a href="http://www.65536.cn/t/2008/UAC.htm">我的作品</a></p>
<h2>yoursunny自编习题</h2>
<ul>
<li><a href="p1.htm">Windows NT安全基础，Windows 2000安全基础 习题</a></li>
<li><a href="p2.htm">活动目录，身份验证，访问控制 习题</a></li>
<li><a href="p3.htm">文件系统安全，网络传输安全，应用服务安全 习题</a></li>
<li><a href="p4.htm">组策略，安全配置与分析，安全审核，公钥基础结构 习题</a></li>
</ul>
<?php
}
function course_sidebar() {
?>
<p>我是第一个交作业的，我通常不压缩我的作业，结果——<br/>
<a href="http://tinypic.com/view.php?pic=walzb5&amp;s=5" rel="external"><img src="http://i39.tinypic.com/walzb5.png" width="250" height="267" alt="保持队形 2008-12-28 09:27"></a><br/>
所有同学都没有上传压缩包，而是建立学号目录。好一个“保持队形”！</p>
<?php
}
function course_down() {
course_cate('教材、参考书');
course_file('Windows系统安全原理与技术','薛质 王轶骏 李建华 编著','book.7z','brsbox:847784523dc435faaeb49b642639d869');
course_cate('课件');
course_file('PDF压缩包','以下所有课件，不含教材','all.7z','namipan:8ed78b435d925417bc4251bff04d9565d04056920f068c00');
course_file('01 Windows系统安全概述','','01.pdf','brsbox:c26b339067da732c916201d28c0ca8fd');
course_file('02 WindowsNT安全','','02.pdf','brsbox:ad1aae0911a4fd8a090f52939ebbaae6');
course_file('03 Windows2000安全基础','','03.pdf','brsbox:e7bbcc77c434647e32042ee3a965f301');
course_file('04 活动目录','','04.pdf','brsbox:a7fe9fdfd7007e61de09cf9397fd8a7a');
course_file('05 身份验证','','05.pdf','brsbox:4eee22cf97acd4c408892e7756413edb');
course_file('06 访问控制','','06.pdf','brsbox:5ef8d40d739b2a1588ef2b95a07be7c5');
course_file('07 文件系统安全','','07.pdf','brsbox:edf41242ab3843826156d7b692b690d3');
course_file('网络协议基础及安全性分析','','protocol.pdf','brsbox:63d8cc12a21a09fbbcc2b3cd1e78d15e');
course_file('08 网络传输安全','','08.pdf','brsbox:3e4c45b37e4b40b85242647e42a287b0');
course_file('09 应用服务安全','','09.pdf','brsbox:6e5b7138b75dfe1e60c74889ed144636');
course_file('Windows远程控制、Rootkit及检测分析','','rootkit.pdf','brsbox:a65b89d4c12d6766d5318bc7e36cf6c0');
course_file('10 组策略','','10.pdf','brsbox:c794f2a04474994bbe85626340d09d92');
course_file('11 安全配置与分析','','11.pdf','brsbox:ddf9c20e7c20dbb5abee403c87c9ccc0');
course_file('12 安全审核','','12.pdf','brsbox:8a3555d460cb43159c81e1831300d02e');
course_file('13 公钥基础结构','','13.pdf','brsbox:abc6d671835fdcee057cf41ed312f061');
}
require '../course.php';
?>