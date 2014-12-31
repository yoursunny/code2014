<?php
//课程英文名称查询脚本
//POST请求：课程中文名，每行一个
//响应：JSON对象，课程中文名:课程英文名，不存在课程不返回
$q=explode("\n",file_get_contents('php://input'));
$a=array();
$f=fopen('translate-sjtu_kcdm.txt','r');
fgets($f);//跳过开头空行
while (FALSE!==($l=fgets($f))) {//遍历所有课程
	$r=explode("\t",$l);
	if (count($r)==2 && in_array($r[0],$q)) {
		$a[$r[0]]=trim($r[1]);//该课程被请求
	}
}
fclose($f);
header('Content-Type: application/json');
echo json_encode($a);//JSON响应
?>
