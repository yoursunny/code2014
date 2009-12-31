<?php
$course_name='信息安全的数学基础';
$course_code=array('IS201','IS202');
$course_teacher=array('邱卫东','陈恭亮');
$course_link=array(
	array('作业题','','homework.htm'),
	array('学习情况调查','','survey.htm'),
	array('课程主页','res.jpkc','http://infosec.sjtu.edu.cn/jpkc/index.htm'),
	array('分解质因数程序','','divide_element.htm'),
);
$course_keyword='群环域,循环群,Galois域,椭圆曲线,椭圆曲线密码系统,陈恭亮';
function course_content() {
/*<iframe src="http://spreadsheets.google.com/embeddedform?key=p4UHwBUXxMl7mH9ond-s5bw&hl=en" width="728" height="180" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>*/
?>
<p>作业题：<a href="homework.htm" style="color:#FF3300;">信息安全的数学基础 作业题</a></p>
<p><a href="http://www.google.cn/intl/zh-CN/jobs/prepare.html" onclick="c('res.kaifulee')">李开复博士建议中国学生：</a>（4）不放弃数学。数学是思维的体操，数学无处不在。尤其当你对一些“数学密集型”的领域有兴趣，例如视频、图像处理等等，你需要使它成为你的利器。</p>
<p>我的作品：<a href="divide_element.htm">分解质因数</a></p>
<?php
}
function course_down() {
//course_file('打包下载全部课件','(仅含陈恭亮课件)','IS202.7z','http://www.namipan.com/d/9ad2fc8f27bfd40d16cecff291f031aabceafa07dcc54900');
course_cate('解题模板 --阳光男孩原创作品');
course_file('考试范围','odt/pdf','exam.odt','brsbox:2ae9425ceef03912a9a4be2993027a3c');
course_file('01 置换分解','odt/pdf','t01.odt','brsbox:d034e5c383a3da616a050532971a3e56');
course_file('02 有限域-不可约多项式','odt/pdf','t02.odt','brsbox:ec09f903c50a4f24fab1664199c1b81e');
course_file('03 本原多项式、周期','odt/pdf','t03.odt','brsbox:0a1a362fe3b3a0fc8b392182ee964046');
course_file('04 正规基','odt/pdf','t04.odt','brsbox:0deabfd14f5edecd5d99a22978390bc1');
course_file('05 生成元','odt/pdf','t05.odt','brsbox:8646d48460eb7f4e9fa217270e21d644');
course_file('06 低次同构','odt/pdf','t06.odt','brsbox:db39612d5441285805c968e32509474f');
course_cate('解题程序');
course_file('饮水思源connnent网友的解题程序','[复习.pdf]第4、5、6页3题+求正规基','connnent.cpp','brsbox:967edca2833cea14592c84c66a68a593');
course_cate('陈恭亮课件');
course_file('第08章 群','','08.pdf','brsbox:a35e916f429dd53727fae41804ea6aeb');
course_file('第09章 群的结构','','09.pdf','brsbox:039aa02029511f0a886f8c6c8abb6929');
course_file('第10章 环','含Z/nZ问题英文论文','10.pdf','brsbox:ee7f248a712c18e25512df50fee97e0b');
course_file('第11章 域和Galois理论','','11.pdf','brsbox:4005f02e1391bc29b52ff43e08c9d828');
course_file('第12章 域的结构','','12.pdf','brsbox:e20bb23f2123560f7f2a1074a313a21c');
course_file('第13章 椭圆曲线','','13.pdf','brsbox:bef97c332f12d0612141447fc59f6b4f');
course_file('复习','2005考卷和解答，考试范围，复习课例题','exam.zip','brsbox:b4af1cd9f415a3c0c8578d2db442b21c');
course_cate('教材');
//course_file('教材PDF版','每章1个文件','book.7z','brsbox:');
course_file('教材PDF版','总共1个文件','ematerial.pdf','http://infosec.sjtu.edu.cn/jpkc/ematerial.pdf');
//course_cate('邱卫东课件');
//course_file('公钥密码的数学原理','','encrypt.ppt','brsbox:');
}
require '../course.php';
?>