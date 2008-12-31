//yoursunny.com TinyMCE载入脚本
document.write('<script type="text/javascript" src="/lib/tiny_mce/tiny_mce_gzip.js"></'+'script>');
//必须使用document.write输出，否则IE6会出错
WebSite.TinyMCE={
	load:Prototype.emptyFunction,//载入——已经载入
	init:function(options){//初始化TinyMCE
		WebSite.scriptInclude('tiny_mce_gzip',null,'tinyMCE_GZ',function(){
			tinyMCE_GZ.init({//调用GZip服务端压缩脚本
				plugins:'contextmenu,inlinepopups,nonbreaking,searchreplace,style,table',
				themes:'advanced',
				languages:'en,zh',
				disk_cache:true,
				debug:false
			});
		});
		WebSite.scriptInclude('tiny_mce',null,'tinymce',function(){
			tinymce.EditorManager.init(Object.extend(Object.extend({
				//默认的选项
				browsers:'msie,gecko,opera',
				language:'zh',
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
			},options||{}),	{
				//不允许覆盖的选项
				plugins:'contextmenu,inlinepopups,nonbreaking,searchreplace,style,table',
				skin:'o2k7',
				theme:'advanced'
			}));
		});
	},
	create:function(element,width,height){//创建一个编辑器
		var ele=$(element).setStyle({width:''+width+'px',height:''+height+'px'});
		WebSite.scriptInclude('tiny_mce',null,'tinyMCE',function(){
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
	}
};
