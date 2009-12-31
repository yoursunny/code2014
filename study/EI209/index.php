<?php
$course_name='计算机组成与体系结构';
$course_code=array('EI209');
$course_teacher=array('陆海宁');
$course_link=array(
	array('教师FTP','source.ftp','ftp://hnlu:public@202.120.2.2'),
	array('网络教育学院《计算机组成与系统结构》精品课程','onlinesjtu.jpkc','http://www.onlinesjtu.com/jpkc/jsjzc/index.asp')
);
$course_keyword='计算机组成,计算机体系结构,总线,cache,计算机算术,CPU结构,CPU体系结构,RISC,精简指令集,CISC,复杂指令集,指令集并行性,并行计算,超标量,流水线,指令流水';
function course_content() {
?>
<a href="?topic=index">知识要点</a>
<?php
}
function course_down() {
//course_file('打包下载全部课件','','EI209.7z','http://www.namipan.com/d/f4238bffef91921dd1a41a49b9adec1f121c5ed2ae2d9702');
course_file('作业答案','','a.zip','brsbox:31ee5c17ce717878cf766c8bd6d915e4');
course_cate('概述');
course_file('01 简介','','01.ppt','brsbox:8db2275a9bd11ec3dae98b3b57f01ff7');
course_file('02 计算机的演变和性能','','02.ppt','brsbox:069fdf8c75eeec14ddc3bc9d377023ba');
course_cate('计算机系统');
course_file('03 系统总线','','03.ppt','brsbox:ab65c7052197ba2b9df272c42904be63');
course_file('04 cache','','04.ppt','brsbox:62bfc2e490cd7f78dab7785c2431ed63');
course_file('05 内部存储器','','05.ppt','brsbox:95c3c0a330488f8275f944d17a357381');
course_file('06 外部存储器','','06.ppt','brsbox:db5b7f743c3b923c35dd8f70335897fe');
course_file('07 输入输出','','07.ppt','brsbox:bfd1e52164f555d90fdf5574ffef13b9');
course_cate('中央处理器');
course_file('09 计算机算术','','09.ppt','brsbox:f2505ed4d448e3ab6d509b82876ab27a');
course_file('10 指令集:特征和功能','','10.ppt','brsbox:aeb2979a5e0c31e133d0f28b6569e1a6');
course_file('11 指令集:寻址方式 指令格式','','11.ppt','brsbox:514ff3b4af20cdc3b441e8561b54b2c5');
course_file('12 CPU结构和功能','','12.ppt','brsbox:75e0f445dd05f75b9141c3b2a1c9a436');
course_file('13 RISC精简指令集计算机','','13.ppt','brsbox:360f8e7de61f800c2cfa84e149bdc8e2');
course_file('14 指令集并行性 超标量处理器','','14.ppt','brsbox:427933fd1dc2561570d1085fbb511e5a');
course_cate('控制器');
course_file('16 控制器操作','','16.ppt','brsbox:c8c994a63e5e6a8ccee2ae35714c221b');
course_file('17 微程序式控制','','17.ppt','brsbox:04a46b7d4b756bbabee57f56d3ce2ef3');
course_file('18 并行处理','','18.ppt','brsbox:429314a4c11e0140b9be8b3f7a2c45f1');
course_cate('网络教育学院精品课程资源');
course_file('在线测试1','','onlinesjtu.test1','http://www.onlinesjtu.com/jpkc/jsjzc/online_test.asp?zhangid=18');
course_file('在线测试2','第2,4,5,6题超纲','onlinesjtu.test2','http://www.onlinesjtu.com/jpkc/jsjzc/online_test.asp?zhangid=5');
course_file('在线测试3','','onlinesjtu.test3','http://www.onlinesjtu.com/jpkc/jsjzc/online_test.asp?zhangid=6');
course_file('在线测试4','第6题超纲','onlinesjtu.test4','http://www.onlinesjtu.com/jpkc/jsjzc/online_test.asp?zhangid=13');
course_file('在线测试5','第2,9题超纲','onlinesjtu.test5','http://www.onlinesjtu.com/jpkc/jsjzc/online_test.asp?zhangid=14');
course_file('在线测试6','','onlinesjtu.test6','http://www.onlinesjtu.com/jpkc/jsjzc/online_test.asp?zhangid=15');
course_file('在线测试8','','onlinesjtu.test8','http://www.onlinesjtu.com/jpkc/jsjzc/online_test.asp?zhangid=17');
course_file('试卷下载','(题目与在线测试不同)','onlinesjtu.doc','http://www.onlinesjtu.com/jpkc/jsjzc/tech_test.asp');
}
if (isset($_GET['topic'])) {
	require '../topic.php';
	topic('topic.htm',$_GET['topic'],'<a href="?topic=index">返回目录</a>','');
} else 
	require '../course.php';
?>