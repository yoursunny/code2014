<?php
$b='课程,学分,成绩'."\r\n";
foreach ($courses as $C) {
	$b.='"'.str_replace(array('"'.'\\'),array('\\"','\\\\'),$C['name']).'",'
		.$C['credit'].','
		.$C['grade']
		."\r\n";
}
echo iconv('utf-8','gbk',$b);
?>