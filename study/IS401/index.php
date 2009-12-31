<?php
$course_name='移动通信';
$course_code=array('IS401');
$course_teacher=array('吴越','易平');
$course_link=array(
array('无线网络安全实验室','link.lab','http://infosec.sjtu.edu.cn/lab/wxwl.jsp')
);
$course_keyword='无线通信,无线网络,移动计算,GSM,CDMA,IS-95,无绳电话,handover,3G,3G标准,3G技术,TD-SCDMA,CDMA2000,WCDMA,WiMAX,无线城市,无线嘉定,Mesh,ad hoc';
function course_sidebar() {
?>
<script type="text/javascript" src="http://feeds.delicious.com/feeds/json/yoursunny/telecom"></script>
<script type="text/javascript">
var course_link=$$('.course_link')[0];
Delicious.posts.each(function(p){
	course_link.insert('<li><a href="'+p.u+'" target="_blank">'+p.d.escapeHTML()+'</a></li>');
});
course_link.setStyle({height:'18em',overflow:'auto'});
</script>
<?php
}
function course_down() {
//course_file('打包下载全部课件','','IS401.7z','http://www.namipan.com/d/961949340698fd76e2b938636d545b7eaa530ab609783f02');
course_cate('无线通信');
course_file('01 Wireless History','','01.pdf','brsbox:9c147b3d95e0b9666a6ab87b3aedfadb');
course_file('02 Radio Propagation in Mobile Environment','','02.pdf','brsbox:e00e0ca226503ea0e2343308e51eb9ef');
course_file('03 Modulation Techniques for Mobile Radio','','03.pdf','brsbox:06a54d993b1623be20b1e15f33b8fc6c');
course_file('04 Equalization,Diversity, and Channel Coding','','04.pdf','brsbox:fba09ce6296c7fc4a52a83c23bfd6603');
course_file('05 Multiple Access','','05.pdf','brsbox:6d46857c81931f193a7b0345589b9734');
course_cate('无线网络');
course_file('01 无线网络与移动计算概述','','06.ppt','brsbox:398ac57153852f57d39817eb286c5730');
course_file('02 蜂窝移动通信系统','','07.ppt','brsbox:86d702952a46d86da30612dd87bf843d');
course_file('03 移动性管理','','08.ppt','brsbox:911bf3d601bf1d97d2baa9a86d4778c0');
course_file('04 第三代移动通信系统','','09.ppt','brsbox:3a045da66cc50b3a7823113158e5f8f0');
course_file('05 移动通信展望(4G)','上课不讲','10.ppt','brsbox:e92cd3f08c739fe91f34f7e79967e60a');
course_file('06 移动IP','','11.ppt','brsbox:443b92a6d9d455a99a56cd5356e0e2c5');
course_file('07 移动数据网络','','12.ppt','brsbox:a1ea16be4ed7b64e9e999666929b9520');
course_file('08 无线局域网','','13.ppt','brsbox:35ef2900ec6cb45a862375df4678c5ab');
course_file('09 移动ad hoc网络','上课不讲','14.ppt','brsbox:38cbce53ca216e18f40fd1146bf7b86a');
course_file('10 无线MESH网络','+无线网络实验室项目介绍','15.ppt','brsbox:e065b40e000c6e7ed2a8ca25055ee3df');
course_file('11 移动ad hoc网络安全','上课不讲','16.ppt','brsbox:4cf6a2df37f7eedece789a1b3923b111');
course_file('无线网络作业模板','王寒芷,QQ:423712515','w2.doc','brsbox:3946d5ca89f7aaa1bd30d59280a1b6a8');
}
require '../course.php';
?>