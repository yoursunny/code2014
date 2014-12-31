<!doctype html>
<html>
<head>
<meta http-equiv="content-type" content="text/html;charset=utf-8">
<title>阳光GPA计算器 - HTML报表</title>
<style type="text/css">/*<![CDATA[*/
table { border-left:solid 1px #9cf; border-top:solid 1px #9cf; border-collapse:collapse; }
th,td { border-right:solid 1px #9cf; border-bottom:solid 1px #9cf; }
/*]]>*/</style>
</head>
<!-- 8b75b07b-e9f8-44b2-93b3-75add8c1726d -->
<body>
<table>
<thead>
<tr><th>选中</th><th>课程名称</th><th>学分</th><th>成绩</th><th>等第</th><th>绩点</th><th>分组</th></tr>
</thead>
<tbody>
<?php
foreach ($courses as $C) {
	echo '<tr><td>'.($C['selected']=='true'?'√':'&nbsp;')
		.'</td><td>'.htmlspecialchars($C['name'])
		.'</td><td>'.$C['credit']
		.'</td><td>'.$C['grade']
		.'</td><td>'.$C['level']
		.'</td><td>'.$C['point']
		.'</td><td>'.($C['groups']==''?'&nbsp;':htmlspecialchars($C['groups']))
		.'</td></tr>'."\r\n";
}
?>
</tbody>
</table>
<p>欢迎您再次使用<a href="http://yoursunny.com/study/GPA/">阳光GPA计算器</a>。</p>
</body>
</html>
