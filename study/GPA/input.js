
//启动输入方式
GPA.Input=function(t) {
	GPA.stat('input-'+t+'.start');
	GPA.Input.current_type=t;
	(GPA.Input.current=new (GPA.Input[t])()).start();
};
GPA.Input.Base=Class.create({//输入方式
	start:function() { },//启动输入界面
	get:function() { return null; },//获取结果CourseCollection
	alertInvalid:function() { alert('没有找到课程信息'); }//提示课程信息错误、不能继续
});
Object.extend(GPA.Input,{
	get:function() {//获取结果
		return GPA.Input.current.get();
	},
	done:function() {
		var L=GPA.Input.get();
		if (!L || L.Count()<1) return GPA.Input.current.alertInvalid();
		GPA.stat('input-'+GPA.Input.current_type+'.done');
		GPA.Calc.Courses=L;
		GPA.LoadComponent('algorithm');
		GPA.Algorithm.UI.start();
	},
	cancel:function() {
		GPA.StepUI('input_choose');
	}
});

//输入：上海交大修业查询
GPA.Input.SJTU=Class.create(GPA.Input.Base,{
	start:function() {
		GPA.showLoading();
		GPA.StepUI('input').update(
			'<h2>输入课程信息：上海交大修业查询</h2>'
			+'<p><a href="javascript:GPA.Input.cancel();">选择其他输入方式</a></p>'
			+'<p>访问<a href="javascript:;" onclick="window.open(\'http://jwb.jwc.sjtu.edu.cn/xsbyshj/\');">本科修业情况查询</a>，'
			+'用你的jAccount登录(用户名密码与交大邮箱、portal个人存储FTP相同)。出现结果后，按下CTRL+A键全选，按下CTRL+C键复制，然后点击下面的文本框、按下CTRL+V键粘贴。</p>'
			+(GPA.xiaonei_app?
				'<iframe src="input-sjtu.htm" width="720" height="200" scrolling="no" frameborder="0" marginheight="0" marginwidth="0" border="0"></iframe>'
				:'<iframe src="input-sjtu.htm" width="800" height="200" scrolling="no" frameborder="0" marginheight="0" marginwidth="0" border="0"></iframe>')
			+'<p>粘贴完毕后，<a href="javascript:GPA.Input.done();">继续</a></p>'
		);
	}
	//input-sjtu.htm提供更多函数
});

GPA.Input.jAccount=Class.create(GPA.Input.Base,{
	start:function() {
		GPA.StepUI('input').update(
			'<h2>输入课程信息：上海交大jAccount</h2>'
			+'<p><a href="javascript:GPA.Input.cancel();">选择其他输入方式</a></p>'
			+'<p>jAccount帐号<input id="GPA_input_jAccount_u" type="text"/> '
			+'密码<input id="GPA_input_jAccount_p" type="password"/> '
			+'<input type="button" value="提取成绩信息" onclick="GPA.Input.current.fetch();"/></p>'
			+'<p>jAccount帐号就是你的交大邮箱地址@之前的部分，或portal个人存储的用户名。<br/>'
			+'阳光GPA计算器不会记录你的jAccount和其他个人资料。<br/>'
			+'如果你不愿意在此输入jAccount帐号，请使用<a href="javascript:GPA.Input(\'SJTU\')">上海交大修业查询</a>输入方式。'
		);
	},
	fetch:function() {
		GPA.stat('input-jAccount.fetch');
		this.data=null;
		var u=$F('GPA_input_jAccount_u');
		var p=$F('GPA_input_jAccount_p');
		WebSite.loadJS(null,'https://yoursunny-app.appspot.com/study/GPA/json?'+Object.toQueryString({u:u,p:p,cb:'GPA.Input.current.callback'}));
	},
	callback:function(data) {
		this.data=data;
		GPA.Input.done();
	},
	data:null,
	get:function() {
		if (!this.data) return null;
		var L=new GPA.CourseCollection();
		this.data.each(function(h){
			var c=new GPA.Course();
			c.code=h.code;
			c.name=h.name;
			c.credit=h.credit;
			c.grade=h.grade;
			c.selected=[0,1].include(h.type);
			L.Add(c);
		});
		return L;
	},
	alertInvalid:function() { alert('没有找到课程信息，请检查帐号、密码是否正确'); }
});

//输入：表格录入
GPA.Input.Table=Class.create(GPA.Input.Base,{
	start:function() {
		GPA.StepUI('input').update(
			'<h2>输入课程信息：表格录入</h2>'
			+'<p><a href="javascript:GPA.Input.cancel();">选择其他输入方式</a></p>'
			+'<p>提示：学分、成绩必须录入，课程名称可以留空；如需删除一门课程，只需将学分或成绩留空</p>'
			+'<table id="InputTable"><tr><th>课程名称</th><th>学分</th><th>成绩</th></tr>'
			+this.input_course.times(10)
			+'</table>'
			+'<p><a href="javascript:GPA.Input.current.more();">录入更多课程信息</a>；录入完毕后，<a href="javascript:GPA.Input.done();">继续</a></p>'
		);
	},
	startAsEditor:function(L,cb) {//修改CourseCollection
		var t='<tr id="InputTable_c%4" class="InputTable_course%5"><td><input type="text" value="%1"/></td><td><input type="text" value="%2"/></td><td><input type="text" value="%3"/></td></tr>';
		var b='';
		L.each(function(id,course) {
			b+=t.format(course.name,course.credit,course.grade,id,course.selected?'':' InputTable_noselect');
		});
		GPA.StepUI('input').update(
			'<h2>编辑课程信息</h2>'
			+'<p>如需删除一门课程，只需将学分或成绩留空</p>'
			+'<table id="InputTable"><tr><th>课程名称</th><th>学分</th><th>成绩</th></tr>'
			+b
			+'</table>'
			+'<p><a href="javascript:GPA.Input.current.more();">录入更多课程信息</a>；录入完毕后，<a href="javascript:;" id="InputTable_OK">继续</a></p>'
		);
		Event.observe.defer('InputTable_OK','click',cb?cb:GPA.Input.done);
	},
	more:function() {
		$('InputTable').insert(this.input_course.times(5));
	},
	get:function() {
		var L=new GPA.CourseCollection();
		$$('#InputTable tr.InputTable_course').each(function(TR){
			var v=function(i){return TR.select('input')[i].value.strip();};
			var credit=v(1),grade=v(2);
			if (credit=='' || grade=='') return;
			credit=parseFloat(credit,10); grade=parseInt(grade,10);
			if (isNaN(credit) || isNaN(grade)) return;
			var course=new GPA.Course();
			if (TR.id && TR.id.startsWith('InputTable_c')) course.id=TR.id.substr(12);
			course.name=v(0);
			course.credit=credit;
			course.grade=grade;
			if (TR.hasClassName('InputTable_noselect')) course.selected=false;
			L.Add(course);
		});
		return L;
	},
	input_course:'<tr class="InputTable_course"><td><input type="text"/></td><td><input type="text"/></td><td><input type="text"/></td></tr>'
});

//输入：CSV/TXT文件上传
GPA.Input.CSV=Class.create(GPA.Input.Base,{
	start:function() {
		GPA.StepUI('input').update(
			'<h2>输入课程信息：CSV/TXT文件上传</h2>'
			+'<p><a href="javascript:GPA.Input.cancel();">选择其他输入方式</a></p>'
			+'<form enctype="multipart/form-data" action="input-csv.php" method="POST" target="input_csv_frame">'
			+'选择CSV/TXT文件：<input name="u" type="file" />'
			+' <input type="submit" value="上传" />'
			+'</form>'
			+'<p>CSV或TXT文件需为ANSI或GBK编码，每行包含课程名称(可选)、成绩、学分，用空格或英文逗号隔开，样例：</p>'
			+'<blockquote>'
			+'高等数学 70 5<br/>'
			+'96 2.5<br/>'
			+'大学物理 68 4<br/>'
			+'82 1.0<br/>'
			+'</blockquote>'
			+'<p>导入后，如果发现部分课程信息有误，请在计算结果页面点击顶部“编辑课程信息”；<br/>'
			+'注意：成绩必须是整数，学分在成绩后面</p>'
			+'<iframe id="input_csv_frame" name="input_csv_frame" width="1" height="1" style="display:none;"></iframe>'
			+'<p>声明：CSV/TXT上传需要提交文件内容到服务器；yoursunny.com承诺不存储您的信息。<br/>继续操作表示你认同上述声明。</p>'
		);
	},
	get:function() {
		var L=new GPA.CourseCollection();
		L.AddRange(this.getJSON().evalJSON().collect(function(a){return Object.extend(new GPA.Course(),a);}));
		return L;
	}
});

//输入：XHTML文件上传
GPA.Input.XHTML=Class.create(GPA.Input.Base,{
	start:function() {
		GPA.StepUI('input').update(
			'<h2>输入课程信息：XHTML文件上传</h2>'
			+'<p><a href="javascript:GPA.Input.cancel();">选择其他输入方式</a></p>'
			+'<form enctype="multipart/form-data" action="input-xhtml.php" method="POST" target="input_xhtml_frame">'
			+'选择上次导出的XHTML文件：<input name="u" type="file" />'
			+' <input type="submit" value="上传" />'
			+'</form>'
			+'<iframe id="input_xhtml_frame" name="input_xhtml_frame" width="1" height="1" style="display:none;"></iframe>'
			+'<p>声明：XHTML上传需要提交文件内容到服务器；yoursunny.com承诺不存储您的信息。<br/>继续操作表示你认同上述声明。</p>'
		);
	}
	//input-xhtml.php提供更多函数
});

//输入：JSON导入
GPA.Input.JSON=Class.create(GPA.Input.Base,{
	start:function() {
		GPA.StepUI('input').update(
			'<h2>输入课程信息：JSON导入</h2>'
			+'<p><a href="javascript:GPA.Input.cancel();">选择其他输入方式</a></p>'
			+'<p>请粘贴上次导出的JSON代码，代码不能修改。</p>'
			+'<textarea id="input_json"></textarea>'
			+'<p>粘贴完毕后，<a href="javascript:GPA.Input.done();">继续</a></p>'
		);
	},
	get:function() {
		var a;
		try { a=$F('input_json').evalJSON(); }
		catch(ex) { return null; }
		var L=new GPA.CourseCollection();
		L.AddRange(a);
		return L;
	},
	alertInvalid:function() {
		alert('粘贴的JSON数据不完整。请勿修改代码，否则不能识别。');
	}
});



