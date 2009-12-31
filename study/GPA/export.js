GPA.Export={};
GPA.Export.XHTML=function(calculator) {//XHTML导出
	GPA.stat('export-XHTML.start');
	var translator=calculator.Translator;
	if (!translator) translator={Translate:function(){return '';}};
	var b='';
	var a=function(s){b+=s+'\r\n';};
	a('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
	a('<html xmlns="http://www.w3.org/1999/xhtml">');
	a('<head>');
	a('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />');
	a('<title>阳光GPA计算器 - 你的阳光学习频道 study.yoursunny.com</title>');
	a('<style type="text/css">/*<![CDATA[*/');
	a('table { border-left:solid 1px #9cf; border-top:solid 1px #9cf; border-collapse:collapse; }');
	a('th,td { border-right:solid 1px #9cf; border-bottom:solid 1px #9cf; }');
	a('/*]]>*/</style>');
	a('</head><body>');
	a('<h1>阳光GPA计算器 - XHTML报表</h1>');
	a('<div>算法：'+calculator.Algorithm.name.encodeHTML());
	a('<div id="algorithm" style="display:none;">'+calculator.Algorithm.ToJS().encodeHTML()+'</div>');
	a('</div>');
	a('<div>计算结果：');
	var result=calculator.calcGPA(true);
	a('%1门课程，总学分=%2，GPA=%3'.format(result.count,result.credit,result.gpa.Round4()));
	a('</div>')
	a('<table>');
	a('<tr><th>选中</th><th>课程名称</th><th>英文名称</th><th>成绩</th><th>学分</th><th>绩点</th><th>学分×绩点</th></tr>');
	var t='<tr id="course_%1"><td>%2</td><td>%3</td><td>%8</td><td>%5</td><td>%4</td><td>%6</td><td>%7</td></tr>';
	calculator.Courses.each(function(id,course){
		a(t.format(id,course.selected?'1':'0',course.name.encodeHTML(),course.credit,course.grade,course.point,course.cp.Round1(),translator.Translate(course.name)));
	});
	a('</table>');
	a('<p>欢迎您再次使用<a href="http://yoursunny.com/study/GPA/">阳光GPA计算器</a>。</p>');
	a('</body></html>');
	GPA.StepUI('export').update(
		'<h2>XHTML导出</h2>'
		+'<p>声明：XHTML导出需要提交课程信息和计算结果到服务器；yoursunny.com承诺不存储您的信息。<br/>继续操作表示你认同上述声明。</p>'
		+'<iframe id="export_xhtml_frame" name="export_xhtml_frame" width="1" height="1" style="display:none;"></iframe>'
		+'<form action="export-xhtml.php" method="post" target="export_xhtml_frame" onsubmit="GPA.stat(\'export-XHTML.submit\');">'
		+'<input type="hidden" name="x" id="export_xhtml_x"/>'
		+'<input type="submit" value="导出报表"/>'
		+'</form>'
		+'<p><a href="javascript:GPA.Calc.UIshow();">返回到计算结果</a></p>'
	);
	(function(){$('export_xhtml_x').value=b;}).defer();
};
GPA.Export.JSON=function(calculator) {//JSON导出
	GPA.stat('export-JSON.start');
	var b=Object.toJSON(calculator.Courses.toArray().collect(function(c){
		return {id:c.id,name:c.name,credit:c.credit,grade:c.grade,code:c.code,selected:c.selected};
	}));
	GPA.StepUI('export').update(
		'<h2>JSON导出</h2>'
		+'<p>请复制下列代码并妥善保存，代码不能修改。</p>'
		+'<textarea>'+b.encodeHTML()+'</textarea>'
		+'<p><a href="javascript:GPA.Calc.UIshow();">返回到计算结果</a></p>'
	);
};
