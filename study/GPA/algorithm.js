GPA.Algorithm.RangeMap=Class.create(GPA.Algorithm,{//范围=>绩点映射型算法
	map:null,
	//声明性定义new GPA.Algorithm.RangeMap(名称,4.3,95,4.0,90, ...);从大到小排列
	initialize:function() {
		var u=Number.POSITIVE_INFINITY,a=$A(arguments);
		this.name=a.shift();
		this.map=a.eachSlice(2,function(g){var e=new GPA.Algorithm.RangeMap.Entry(g[1],u,g[0]);u=g[1];return e;});
	},
	p:function(grade) {
		var point=0;
		this.map.each(function(entry){
			if (entry.range.include(grade)) {
				point=entry.point;
				throw $break;
			}
		});
		return point;
	},
	ToJS:function() {
		return '(new GPA.Algorithm.RangeMap('+this.name.inspect()+','+this.map.collect(function(e){return [e.point,e.range.start].join(',');}).join(',')+'))';
	},
	canEdit:true,
	Viewer:function(container) {
		$(container).update(
			'<table><caption>'+this.name.encodeHTML()+'</caption>'
			+'<tr><th>成绩</th><th>绩点</th></tr>'
			+this.map.collect(function(e){
				return '<tr><td>%2 ~ %3</td><td>%1</td></tr>'.format(e.point,e.range.start,isFinite(e.range.end)?e.range.end:'');
			}).join('')
			+'</table>'
		);
	},
	Editor:function(container,cb) {
		var TR_insert='<tr><td><input type="text" class="AlgorithmEditor_grade" value=""/></td><td><input type="text" class="AlgorithmEditor_point" value=""/></td><td><input type="button" class="AlgorithmEditor_ins" value="插入"/></td></tr>';
		$(container).update(
			'<table><tr class="AlgorithmEditor_h"><th>成绩≥</th><th>绩点</th><th>操作</th></tr>'
			+this.map.collect(function(e){
				return '<tr><td><input type="text" class="AlgorithmEditor_grade" value="%2"/></td><td><input type="text" class="AlgorithmEditor_point" value="%1"/></td><td><input type="button" class="AlgorithmEditor_del" value="删除"/></td></tr>'.format(e.point,e.range.start);
			}).join('')
			+TR_insert
			+'</table>'
		);
		(function(){
			var f=function(e){
				var btn=Event.element(e);
				var TR=Event.findElement(e,'tr');
				if (!TR || TR==document) return;
				if (btn.hasClassName('AlgorithmEditor_ins')) {
					$(btn).removeClassName('AlgorithmEditor_ins').addClassName('AlgorithmEditor_del').value='删除';
					$(TR).insert({after:TR_insert});
					(function(){$(container).select('.AlgorithmEditor_ins').invoke('observe','click',f);}).defer();
				} else {
					$(TR).remove();
				}
			};
			$(container).select('.AlgorithmEditor_del','.AlgorithmEditor_ins').invoke('observe','click',f);
		}).defer();
	},
	EditorSave:function(container,name) {
		var a=new GPA.Algorithm.RangeMap(name);
		var u=Number.POSITIVE_INFINITY;
		a.map=$(container).select('tr:not(.AlgorithmEditor_h)').collect(function(TR){
			var point=parseFloat(TR.select('.AlgorithmEditor_point').first().value,10);
			var grade=parseInt(TR.select('.AlgorithmEditor_grade').first().value,10);
			if (isNaN(point) || isNaN(grade)) return null;
			return [point,grade];
		}).compact().sortBy(function(p){return p.grade;}).collect(function(g){
			var e=new GPA.Algorithm.RangeMap.Entry(g[1],u,g[0]);u=g[1];return e;
		});
		return a;
	}
});
GPA.Algorithm.RangeMap.Entry=Class.create({//范围=>绩点映射型算法的一个成绩范围=>绩点
	range:null,
	point:0,
	initialize:function(min,max,point) {//最小成绩,最大成绩(不含),绩点
		this.range=$R(min,max,true);
		this.point=point;
	}
});
GPA.Algorithm.ArithmeticMap=Class.create(GPA.Algorithm,{//算术函数型算法
	initialize:function(name,p,js,info) {
		this.name=name;
		this.p=p;
		this.ToJS=function() { return js; };
		this.Viewer=function(container) { $(container).update(name+'<hr/>'+info); }
	}
});

//预定义算法
GPA.Algorithm.Predefined={
	SJTU:new GPA.Algorithm.RangeMap('上海交通大学',//http://jwc.sjtu.edu.cn/2007.pdf
		4.3,95,4,90,3.7,85,3.3,80,3,75,2.7,70,2.3,67,2,65,1.7,62,1,60,0,0),
	US1:new GPA.Algorithm.RangeMap('美国1',//http://www.taisha.org/bbs/viewthread.php?tid=31209
		4,90,3,80,2,70,1,60,0,0),
	US2:new GPA.Algorithm.RangeMap('美国2',//http://www.taisha.org/bbs/viewthread.php?tid=31209
		4,90,3.5,85,3,80,2.5,75,2,70,1.5,65,1,60,0,0),
	US3:new GPA.Algorithm.RangeMap('美国3',//http://www.taisha.org/bbs/viewthread.php?tid=31209
		4,90,3.7,87,3.3,83,3,80,2.7,77,2.3,73,1.7,70,1,60,0,0),
	PKU:new GPA.Algorithm.RangeMap('北京大学（2006级及之前）',//http://dean.pku.edu.cn/student/jd.html
		4,90,3.7,85,3.3,82,3,78,2.7,75,2.3,72,2,68,1.5,64,1,60,0,0),
	Canada:new GPA.Algorithm.RangeMap('加拿大',4.3,90,4,85,3.7,80,3.3,75,3,70,2.7,65,2.3,60,0,0),
	ZJU:new GPA.Algorithm.ArithmeticMap('浙江大学',//http://www.qsc.zju.edu.cn/redir.php?catalog_id=43462&object_id=99243
		function(grade) {
			if (grade>=85) return 4.0;
			if (grade<60) return 0;
			return 1.5+(grade-60)/10;
		},'GPA.Algorithm.Predefined.ZJU','85 ~ 100 =&gt; 4.0<br/>60 ~ 84 =&gt; 1.5 ~ 3.9（分数每高1分GPA增加0.1分）'),
	PKU7:new GPA.Algorithm.ArithmeticMap('北京大学（2007级及之后）',//http://dean.pku.edu.cn/student/jd.html，刘菲晖（http://xiaonei.com/profile.do?id=234676691）提供
		function(grade) {
			if (grade<60) return 0;
			return ((4-3*(100-grade)*(100-grade)/1600)*100).round()/100;
		},'GPA.Algorithm.Predefined.PKU7','0 ~ 59 =&gt; 0<br/>60 ~ 100 =&gt; 4-3*(100-X)<sup>2</sup>/1600'),
	FUDAN:new GPA.Algorithm.RangeMap('复旦大学',//http://www.jwc.fudan.edu.cn/showinfoAction.do?contid=004010009
		4,90,3.7,85,3.3,82,3,78,2.7,75,2.3,71,2,66,1.7,62,1.3,60,0,0),
	SHU:new GPA.Algorithm.RangeMap('上海大学',//http://www.shu.edu.cn/Default.aspx?tabid=2741&ctl=Detail&mid=4171&Id=15319&SkinSrc=[L]Skins/zhengwu_con1/zhengwu_con1
		4,90,3.7,85,3.3,82,3,78,2.7,75,2.3,72,2,68,1.7,66,1.5,64,1,69,0,0)
};

//在Cookie中存储算法
GPA.Algorithm.CookieSave={
	CookieName:'GPA_Algorithm_Saved',
	Read:function() {//读取cookie中保存的自定义算法
		var s=Cookie.get(GPA.Algorithm.CookieSave.CookieName);
		if (!s) return [];
		try { return eval(s); }
		catch(ex) { Cookie.erase(GPA.Algorithm.CookieSave.CookieName); return []; }
	},
	Write:function(algorithms) {//自定义算法写入cookie
		Cookie.set(GPA.Algorithm.CookieSave.CookieName,'['+algorithms.invoke('ToJS').join(',')+']',60);
	},
	Add:function(algorithm) {
		var algorithms=GPA.Algorithm.CookieSave.Read();
		algorithms.unshift(algorithm);
		if (algorithms.length>15) algorithms.splice(15,algorithms.length-15);
		GPA.Algorithm.CookieSave.Write(algorithms);
	}
};

//算法选择步骤
GPA.Algorithm.UI={
	start:function() {
		GPA.Algorithm.UI.CookieSaveAlgorithms=GPA.Algorithm.CookieSave.Read();
		var li=function(choose,n,algorithm) {
			return '<li onmouseover="GPA.Algorithm.UI.Choose%1(%2,2)"><input type="button" onclick="GPA.Algorithm.UI.Choose%1(%2,0);" value="选用"/> <input type="button" onclick="GPA.Algorithm.UI.Choose%1(%2,1);" value="修改"%4/> <a href="javascript:GPA.Algorithm.UI.Choose%1(%2,0);">%3</a></li>'.format(choose,n,algorithm.name.encodeHTML(),algorithm.canEdit?'':' disabled="disabled"');
		};
		GPA.StepUI('algorithm').update(
			'<p>请选择GPA算法</p>'
			+'<div id="algorithm_view" class="f-right"></div>'
			+'<ul>'
			+Object.keys(GPA.Algorithm.Predefined).collect(function(n){
				return li('Predefined',n.inspect(),GPA.Algorithm.Predefined[n]);
			}).join('')
			+GPA.Algorithm.UI.CookieSaveAlgorithms.collect(function(algorithm,i){
				return li('CookieSave',i,algorithm);
			}).join('')
			+'<li><a href="javascript:GPA.Algorithm.UI.CreateCustom();">创建自定义算法</a></li>'
			+'</ul>'
		);
	},
	CookieSaveAlgorithms:null,
	ChoosePredefined:function(n,action) {
		if (action==0) GPA.stat('algorithm-'+n+'.choose');
		if (action==1) GPA.stat('algorithm-'+n+'.edit');
		GPA.Algorithm.UI.ChooseAlgorithm(GPA.Algorithm.Predefined[n],action);
	},
	ChooseCookieSave:function(i,action) {
		if (action==0) GPA.stat('algorithm-custom.choose');
		if (action==1) GPA.stat('algorithm-custom.edit');
		GPA.Algorithm.UI.ChooseAlgorithm(GPA.Algorithm.UI.CookieSaveAlgorithms[i],action);
	},
	CreateCustom:function() {
		GPA.stat('algorithm-custom.create');
		GPA.Algorithm.UI.current=new GPA.Algorithm.RangeMap('新建自定义算法');
		GPA.Algorithm.UI.Editor();
	},
	current:null,
	ChooseAlgorithm:function(algorithm,action) {
		GPA.Algorithm.UI.current=algorithm;
		switch (action) {
			case 0://选用
				GPA.Algorithm.UI.Done();
				break;
			case 1://修改
				GPA.Algorithm.UI.Editor();
				break;
			case 2://预览
				GPA.Algorithm.UI.Viewer();
				break;
		}
	},
	Viewer:function() {
		GPA.Algorithm.UI.current.Viewer('algorithm_view');
	},
	Editor:function() {//打开算法编辑器
		$('step_algorithm').update(
			'<p>GPA算法：<input type="text" id="AlgorithmEditor_name" value="'+GPA.Algorithm.UI.current.name.encodeHTML()+'#'+(Math.random()*1024).floor()+'"/></p>'
			+'<div id="AlgorithmEditor_t"></div>'
			+'<p><input type="button" onclick="GPA.Algorithm.UI.EditDone();" value="保存并继续"/> <a href="javascript:GPA.Algorithm.UI.start();">取消编辑</a></p>'
		);
		GPA.Algorithm.UI.current.Editor.bind(GPA.Algorithm.UI.current,'AlgorithmEditor_t').defer();
	},
	EditDone:function() {//结束编辑
		var a=GPA.Algorithm.UI.current.EditorSave('AlgorithmEditor_t',$F('AlgorithmEditor_name'));
		GPA.stat('algorithm.editor-save');
		GPA.Algorithm.CookieSave.Add(a);
		GPA.Algorithm.UI.current=a;
		GPA.Algorithm.UI.Done();
	},
	Done:function() {//完成算法选择、进入下一步
		GPA.Calc.Algorithm=GPA.Algorithm.UI.current;
		GPA.LoadComponent('calc');
		GPA.Calc.UIstart();
	}
};
