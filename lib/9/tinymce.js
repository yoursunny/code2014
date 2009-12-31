var tinyMCE_GZ = {
	settings : {
		themes : '',
		plugins : '',
		languages : '',
		disk_cache : true,
		page_name : 'tiny_mce_gzip.php',
		debug : false,
		suffix : ''
	},
	init : function(s, cb, sc) {
		this.baseURL='/lib/tiny_mce';
		s=Object.extend(this.settings,s);
		if (!this.coreLoaded) this.loadScripts(0, s.themes, s.plugins, s.languages, cb, sc);
	},
	loadScripts : function(co, th, pl, la, cb, sc) {
		var t=this,s=t.settings;
		var q='js=true&diskcache='+(s.disk_cache?'true':'false')+'&core='+(co?'true':'false')+'&suffix='+escape(s.suffix)+'&themes='+escape(th)+'&plugins='+escape(pl)+'&languages='+escape(la);
		if (co) t.coreLoaded=1;
		new Ajax.Request(this.baseURL+'/'+s.page_name+'?'+q,{method:'get',onComplete:function(x){
			t.loaded=1;
			t.start();
			tinymce.dom.Event.domLoaded=true;
			(cb||Prototype.emptyFunction).call(sc||t,x);
		},asynchronous:false});
	},
	start : function() {
		var t=this,s=t.settings,ln=s.languages.split(',').select(Prototype.K);
		tinymce.suffix = s.suffix;
		function load(u) { tinymce.ScriptLoader.markDone(tinyMCE.baseURI.toAbsolute(u)); };
		ln.each(function(c) { load('langs/'+c+'.js'); });
		s.themes.split(',').select(Prototype.K).each(function(n) {
			load('themes/'+n+'/editor_template'+s.suffix+'.js');
			ln.each(function(c) { load('themes/'+n+'/langs/'+c+'.js'); });
		});
		s.plugins.split(',').select(Prototype.K).each(function(n) {
			load('plugins/'+n+'/editor_plugin'+s.suffix+'.js');
			ln.each(function(c) { load('plugins/'+n+'/langs/'+c+'.js'); });
		});
	},
	end : function() { },
	eval : function(co) {
		if (!window.execScript) {
			if (Prototype.Browser.Gecko) eval(co, w);
			else eval.call(w, co);
		} else window.execScript(co);
	}
};
WebSite.TinyMCE={
	create:function(element,width,height){//创建一个编辑器
		var ele=$(element).setStyle({width:''+width+'px',height:''+height+'px'});
		WebSite.scriptInclude('tiny_mce',null,'tinymce',function(){
			tinymce.EditorManager.execCommand('mceAddControl',true,ele.id);
		});
	},
	getEditor:function(element){//获取编辑器对象
		return tinymce.EditorManager.get($(element).id);
	},
	getHTML:function(element){//获取编辑器内HTML代码
		return WebSite.TinyMCE.getEditor(element).getContent();
	},
	setHTML:function(element,value){//设置编辑器内HTML代码
		WebSite.TinyMCE.getEditor(element).setContent(value);
	},
	init:function(options,options_GZ){//初始化，必须在页面载入完毕前调用
		tinyMCE_GZ.init(Object.extend({
			plugins:'contextmenu,inlinepopups,nonbreaking,searchreplace,style,table',
			themes:'advanced',
			languages:'en'
		},options_GZ||{}));
		tinymce.EditorManager.init(Object.extend({
			language:'en',
			mode:'none',
			plugins:'contextmenu,inlinepopups,nonbreaking,searchreplace,style,table',
			skin:'o2k7',
			theme:'advanced',
			apply_source_formatting:true,
			identation:'2em',
			remove_trailing_nbsp:true,
			relative_urls:false,
			theme_advanced_toolbar_location:'top',
			theme_advanced_toolbar_align:'left',
			theme_advanced_buttons1:'fontselect,fontsizeselect,removeformat,|,bold,italic,underline,strikethrough,sub,sup,backcolor,forecolor,|,bullist,numlist,outdent,indent,|,justifyleft,justifycenter,justifyright,justifyfull',
			theme_advanced_buttons2:'tablecontrols,|,image,blockquote,hr,link,unlink,charmap,|,search,replace,styleprops',
			theme_advanced_buttons3:''
		},options||{}));
	}
};
