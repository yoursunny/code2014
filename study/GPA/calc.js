GPA.Calculator.addMethods({
	updatePoint:function() {//计算所有课程的绩点
		var algorithm=this.Algorithm;
		this.Courses.each(function(id,course){
			course.point=algorithm.p(course.grade);
			course.cp=course.credit*course.point;
		});
	},
	calcGPA:function(selected_only) {//根据课程绩点统计总平均绩点
		var credit=0,cp=0,cg=0;
		var L=this.Courses;
		var f=function(id,course){
			credit+=course.credit;
			cp+=course.cp;
			cg+=course.grade*course.credit;
		};
		if (selected_only) {
			L=L.Selected();
			f=f.curry(-1);
		}
		L.each(f);
		var gpa=(credit==0)?0:(cp/credit);
		var grade=(credit==0)?0:(cg/credit);
		return {selected_only:selected_only,credit:credit,cp:cp,grade:grade,gpa:gpa,count:L.length};
	}
});

Number.prototype.Round1=function() {//保留1位小数
	var n=(this*10).round().toPaddedString(2,10);
	return n.substr(0,n.length-1)+'.'+n.substr(n.length-1);
};
Number.prototype.Round4=function() {//保留4位小数
	var n=(this*10000).round().toPaddedString(5,10);
	return n.substr(0,n.length-4)+'.'+n.substr(n.length-4);
};

GPA.Calculator.addMethods({
	UIstart:function() {
		this.updatePoint();
		GPA.StepUI('calc').update(
			'<h2>GPA计算结果：<span id="calc_resultGPA"></span></h2>'
			+'<p>当前算法：'+this.Algorithm.name.encodeHTML()+' <a href="javascript:;" onclick="GPA.StepUI(\'algorithm\')">更换算法</a></p>'
			+'<div id="calc_result"></div>'
			+'<div id="calc_table"></div>'
			+'<ul>'
			+'<li><a href="javascript:GPA.Calc.startEditor();GPA.stat(\'calc.edit-course\');">编辑课程信息</a> 在表格中修改学分、成绩等课程信息</li>'
			+(this.Translator?'':'<li id="calc_translate"><a href="javascript:GPA.Calc.Translate()">翻译课程名称</a> 将课程名称翻译成英文</li>')
			+'<li><a href="javascript:GPA.Calc.Export(\'xhtml\')">导出XHTML</a> 将课程信息和计算结果导出成XHTML格式，以便离线查看或编程分析</li>'
			+'<li><a href="javascript:GPA.Calc.Export(\'json\')">导出JSON</a> 将课程信息导出成JSON格式，下次使用阳光GPA计算器时可以导入</li>'
			+'</ul>'
		);
		(function(){
			this.updateTable();
			this.updateResult();
		}).bind(this).defer();
		if (GPA.xiaonei_app && !GPA.xiaonei_app_minifeed) {
			GPA.xiaonei_app_minifeed=true;
			new Ajax.Request('xiaonei-minifeed.php',{parameters:location.search.substr(1)});
		}
	},
	UIshow:function() {
		GPA.StepUI('calc');
	},
	startEditor:function() {
		GPA.Input.current=new GPA.Input.Table();
		GPA.Input.current.startAsEditor(this.Courses,function(){this.Courses=GPA.Input.get();this.UIstart();}.bind(this));
	},
	updateTable:function() {
		var translator=this.Translator;
		var b='<table><tr><th>&nbsp;</th><th>课程名称</th>'+(translator?'<th>英文名称</th>':'')+'<th>成绩</th><th>学分</th><th>绩点</th><th>学分×绩点</th></tr>';
		var t='<tr id="calc_course_%1"><td><input type="checkbox" id="calc_select_%1" %2 on'+(Prototype.Browser.IE?'click':'change')+'="GPA.Calc.clickSelect(%1)"/></td><td>%3</td>'+(translator?'<td>%8</td>':'')+'<td>%5</td><td>%4</td><td>%6</td><td>%7</td></tr>';
		this.Courses.each(function(id,course){
			b+=t.format(id,course.selected?' checked="checked"':'',course.name.encodeHTML(),course.credit,course.grade,course.point,course.cp.Round1(),translator?translator.Translate(course.name).encodeHTML():'');
		});
		b+='</table>';
		$('calc_table').update(b);
	},
	updateResult:function(result) {
		if (!result) result=this.calcGPA(true);
		var gpa=result.gpa.Round4();
		var grade=result.grade.Round1();
		$('calc_result').update('%1门课程，总学分=%2，加权平均成绩=%3，GPA=%4'.format(result.count,result.credit,grade,gpa));
		$('calc_resultGPA').update(gpa);
	},
	clickSelect:function(id) {
		this.Courses.Select(id,$('calc_select_'+id).checked);
		this.updateResult();
		GPA.stat('calc.click-select');
	},
	Translate:function() {
		GPA.LoadComponent('translator');
		$('calc_translate').remove();
		this.Translator=new GPA.Translator();
		this.Translator.onUpdate=this.TranslateUpdate.bind(this);
		this.Translator.PrepareCourseCollection(this.Courses);
	},
	TranslateUpdateDelay:0,
	TranslateUpdate:function(n) {
		window.clearTimeout(this.TranslateUpdateDelay);//避免更新过于频繁
		this.TranslateUpdateDelay=this.updateTable.bind(this).defer();
	},
	Export:function(format) {
		GPA.LoadComponent('export');
		switch (format) {
			case 'xhtml':
				GPA.Export.XHTML(this);
				break;
			case 'json':
				GPA.Export.JSON(this);
				break;
		}
	}
});
