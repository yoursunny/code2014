<?php
$course_name='大学英语听力与时俱进MP3';
$course_code=array('EN001','EN002','EN003','EN004');
$course_teacher=array('刘雅敏');
$course_link=array(
	array('外语学院大学英语教学部','res.sjtu_english','http://english.sjtu.edu.cn/'),
	//array('VOA','','./?voa='.date('Ymd')),
);
function course_content() {
?>
<?php
}
function course_down() {
course_cate('Special English');
course_file('01～15 MP3','','special1.7z','brsbox:d8382fb440791c432842c1b8852a51e5');
course_file('01～15文本','','special1.rtf','brsbox:801b8c641018c7ea301b818f4fe68243');
course_file('16～30 MP3','','special2.7z','brsbox:528c9139ebcb785d53372a294d87dc49');
course_file('16～30文本','','special2.rtf','brsbox:71a52fb879d1f8b348d264dba1616f8e');
course_file('31～45 MP3','','special3.7z','brsbox:c502f1ba9761f8637d6cb17d549c1390');
course_file('31～45文本','','special3.rtf','brsbox:bc94010b90d594ef1ebaaeb28b493da0');
course_cate('Standard English');
course_file('01～10 MP3','','standard1.7z','brsbox:19d752673f6fb7002bbe792fa28c3367');
course_file('01～10文本','','standard1.rtf','brsbox:15d5f06700dfc107144e8f8bb30bf890');
course_file('11～20 MP3','','standard2.7z','brsbox:04ddd63022e2f76717bddf9a103f84ca');
course_file('11～20文本','','standard2.rtf','brsbox:15f1d9cabfa0f5621522e180afc3801b');
}
if (isset($_GET['voa']))
	require 'voa.php';
else 
	require '../course.php';
?>