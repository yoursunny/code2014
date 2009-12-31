GPA.Translator=Class.create({//课程名称翻译器
	initialize:function() {
		this.H=$H();
		this.GoogleTranslatePending=[];
	},
	PrepareCourseCollection:function(L,cb) {//为CourseCollection中的课程名称准备数据
		GPA.stat('translator.prepare');
		var a=[];
		L.each(function(id,course){
			a.push(course.name);
		});
		new Ajax.Request('translator.php',{contentType:'text/plain',postBody:a.join('\n'),onComplete:this.PrepareResponse.bind(this)});
	},
	PrepareResponse:function(resp) {
		this.H=this.H.merge(resp.responseJSON);
		(this.onUpdate||Prototype.emptyFunction)(Object.keys(resp.responseJSON));
	},
	onUpdate:null,//当课程名称翻译器获得新的数据时回调此函数，参数为本次获得的课程名称
	Translate:function(name,no_request) {//翻译一个课程名称
		name=name.strip();
		if (name=='') return '';
		var v=this.H.get(name);
		if (!v && !no_request) {
			this.GoogleTranslate(name);
		}
		return v?v:'';
	},
	//private
	GoogleTranslatePending:null,
	GoogleTranslate:function(name) {
		if (this.GoogleTranslatePending.include(name)) return;
		if (this._GoogleTranslate) return this._GoogleTranslate(name);
		if ($('translator_google')==null) {
			$(document.body).insert('<iframe id="translator_google" src="translator-google.htm" width="1" height="1" style="display:none;"></iframe>');
		}
		this.GoogleTranslate.bind(this,name).delay(1);
	},
	GoogleTranslateCallback:function(name,translation) {
		this.H.set(name,translation);
		(this.onUpdate||Prototype.emptyFunction)([name]);
		GPA.stat('translator.google');
	},
	H:null
});