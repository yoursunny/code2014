<?php
$course_name='网络信息安全基础';
$course_code=array('IS215');
$course_teacher=array('张全海');
$course_link=array(
);
function course_content() {
?>
<p>网络安全入门课程。<br />
阳光男孩在考试前精心制作了<a href="outline.htm">一份提纲</a>，欢迎参考。</p>
<?php
}
function course_down() {
//course_file('打包下载全部课件','','IS215.rar','http://www.namipan.com/d/422ff6b26fe2fc47f235ccf58d21b10bdff3ccbfb6dd5f02');
course_cate('第一章 网络基础知识');
course_file('第01讲 网络基础知识','','01.ppt','cech:1/11417121');
course_cate('第二章 信息安全内涵');
course_file('第02讲 信息安全内涵','','02.ppt','cech:1/11417131');
course_cate('第三章 网络安全框架与评估标准');
course_file('第03讲 网络安全威胁与攻击','','03.ppt','cech:1/11417141');
course_file('第04讲 网络安全服务','','04.ppt','cech:1/11417151');
course_file('第05讲 安全体系结构、模型','','05.ppt','cech:1/11417161');
course_file('第06讲 安全等级与标准','','06.ppt','cech:1/11417171');
course_file('第07讲 标准与评估','','07.ppt','cech:1/11417181');
course_file('第08讲 IPSec','','08.ppt','cech:1/11417191');
course_cate('第四章 密码学');
course_file('第09讲 密码学发展及传统加密技术','','09.ppt','cech:1/11417201');
course_file('第10讲 对称密码体系DES/IDEA','','10.ppt','cech:1/11417211');
course_file('第11讲 公钥密码体制，密钥分配与管理','','11.ppt','cech:1/11417221');
course_file('第12讲 报文鉴别，散列函数','','12.ppt','cech:1/11417231');
course_file('第13讲 数字签名，信息隐藏','','13.ppt','cech:1/11417241');
course_cate('第五章 网络安全技术');
course_file('第14讲 身份认证','','14.ppt','cech:1/11417251');
course_file('第15讲 访问控制','','15.ppt','cech:1/11417261');
course_file('第16讲 公钥基础设施PKI和授权管理基础设施PMI','','16.ppt','cech:1/11417271');
course_file('第17讲 电子邮件、Web与电子商务的安全','','17.ppt','cech:1/11417281');
course_cate('第六章 网络安全防护技术和产品');
course_file('第18讲 防火墙和UTM','','18.ppt','cech:1/11417291');
course_file('第19讲 VPN和TPN','','19.ppt','cech:1/11417301');
course_file('第20讲 入侵检测','','20.ppt','cech:1/11417311');
course_file('第21讲 网络病毒及防范','','21.ppt','cech:1/11417321');
}
require '../course.php';
?>