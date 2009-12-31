//GPA计算器 study.yoursunny.com

var GPA={};

GPA.Course=Class.create({//课程
	id:-1,//自动编号
	//基本属性
	name:'',//课程名称
	credit:'',//学分
	grade:'',//成绩
	//扩展属性
	code:'',//课程代码
	//计算属性
	selected:true,//是否选中
	point:0,//绩点
	cp:0//学分×绩点
});

GPA.CourseCollection=Class.create({//课程集合
	initialize:function() {
		this.H=$H();
	},
	Add:function(course) {//将课程加入集合，返回课程id；如果id未设置则自动生成
		if (course.id<0) {
			do course.id=(Math.random()*0x1000000).floor(); while (this.Contains(course.id));
		}
		this.H.set(course.id,course);
		return course.id;
	},
	AddRange:function(courses,start,length) {//将课程数组加入集合
		if (arguments.length<3) {
			start=0;
			length=courses.length;
		}
		for (var i=start,end=start+length;i<end;++i) {
			this.Add(courses[i]);
		}
	},
	Remove:function(id) {//将课程从集合删除，返回课程对象
		return this.H.unset(id);
	},
	Contains:function(id) {//判断课程是否存在
		return this.Get(id)!=null;
	},
	Count:function() {//课程数量
		return this.H.keys().length;
	},
	Get:function(id) {//获取课程
		var course=this.H.get(id);
		return course?course:null;
	},
	each:function(f) {//对所有课程执行f(id,course)
		if (!Object.isFunction(f)) return;
		this.H.each(function(pair){f(pair.key,pair.value);});
	},
	toArray:function() {//获取所有课程对象
		return this.H.values();
	},
	Select:function(id,selected) {//选中/不选中课程
		var course=this.Get(id);
		if (course) course.selected=selected;
	},
	Selected:function() {//获取所有“选中”课程对象
		return this.toArray().select(function(course){return course.selected;});
	},
	//private
	H:null//Hash, id => course
});

GPA.Algorithm=Class.create({//算法
	name:'',
	initialize:function(name) { if (name) this.name=name; },
	p:function(grade) { return grade; },//成绩=>绩点 映射
	ToJS:function() { return '(new GPA.Algorithm('+this.name.inspect()+'))'; },//用于创建本算法的JS表达式
	canEdit:false,//是否可以编辑
	Viewer:function(container) { },//查看算法
	Editor:function(container) { },//编辑算法
	EditorSave:function(container) { }//保存算法，返回新的算法对象
});

GPA.Calculator=Class.create({//计算器
	Courses:null,
	Algorithm:null,
	Translator:null
	//calc.js提供更多函数
});
GPA.Calc=new GPA.Calculator();//计算器实例

GPA.LoadComponent=function() {//加载组件
	var components=$A(arguments);
	var loads=[components].flatten().without.apply(components,GPA.LoadComponent.a);
	if (loads.length<1) return;
	GPA.showLoading();
	new Ajax.Request('component.php?'+loads.join(','),{asynchronous:false,method:'get',evalJS:'force'});
	GPA.hideLoading();
};
GPA.LoadComponent.a=[];//组件末尾应该在此数组中添加标志
GPA.showLoading=WebSite.showLoading.curry('正在下载GPA计算器组件');
GPA.hideLoading=WebSite.hideLoading.defer.bind(WebSite.hideLoading);

GPA.CheckUA=function() {//检查浏览器兼容性
	var browser_no=[],browser_critical=true,UA=navigator.userAgent,disable_jAccount=true;
	if (Prototype.Browser.Gecko) {
		browser_critical=false;
	}
	else if (Prototype.Browser.IE) {
		var IEver=parseInt(UA.substr(UA.indexOf('MSIE ')+4));
		if (IEver>=6) browser_critical=false;
		if (IEver==6) browser_no.push('计算结果漂浮效果');
	} else if (Prototype.Browser.Opera) {
		browser_critical=false;
		browser_no.push('上海交大修业查询');
	} else if (Prototype.Browser.WebKit) {
		browser_critical=false;
		browser_no.push('算法自定义');
		if (UA.include('iPhone')) {
			browser_no.push('上海交大修业查询');
			disable_jAccount=false;
		} else if (UA.include('Android')){
			disable_jAccount=false;
		}
	}
	var okUA='Firefox3,IE8,IE7';
	if (browser_critical) $('browser_warning').show().update('GPA计算器不支持你的浏览器，请使用兼容的浏览器：'+okUA);
	else if (browser_no.length>0) $('browser_warning').show().update('GPA计算器不完全支持你的浏览器，无法正常使用的功能：'+browser_no.join(',')+'，建议使用兼容的浏览器：'+okUA);
	if (disable_jAccount) $('input_jAccount').update('上海交大jAccount输入方式仅对手机WML版和iPhone、Android浏览器开放');
};

GPA.StepUI=function(id) {//步骤UI切换
	$$('.step').invoke('hide');
	return $('step_'+id).show();
};

GPA.Restart=function() {//重新开始
	if (!confirm('重新开始将删除所有未导出数据，是否继续？')) return;
	GPA.stat('core.Restart');
	GPA.StepUI('input_choose');
	GPA.Calc=new GPA.Calculator();
};

GPA.stat=function(k) {//统计调用
	if (GPA.stat.a.include(k)) return;
	GPA.stat.a.push(k);
	c(k);
};
GPA.stat.a=[];
