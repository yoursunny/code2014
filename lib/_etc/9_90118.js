// 9.js?lib1,lib2,...  'web' is always loaded
var WebSite={
	domain:'http://www.65536.cn',//主服务器域名
	goodUA:true//standard-compliant browser
};

(function(){
	//判断浏览器
	var UA=navigator.userAgent;var pos=UA.indexOf('MSIE ');
	if (pos>0) {
		var IEver=parseInt(UA.substr(pos+4));
		if (!isNaN(IEver) && IEver<8) WebSite.goodUA=false;
	}
	//显示正在加载，在主脚本末尾隐藏
	document.write('<div id="indi_loading" style="z-index:1;padding:5px 9px 5px 9px;background:#c44;right:0;top:0;color:#fff;'+(WebSite.goodUA?'position:fixed;':'position:absolute;')+'">正在加载</div>');
	var hide=function(){var d=document.getElementById('indi_loading');d.style.display='none';d.innerHTML='';};
	if (window.addEventListener) { window.addEventListener('load',hide,false); }
	else if (window.attachEvent) { window.attachEvent('onload',hide); }//保证隐藏
	//寻找当前脚本标签
	var want=['web'];
	var ss=document.getElementsByTagName('script');
	for (var i=0;i<ss.length;++i) {
		var s=ss[i].src;
		if (s.indexOf('9.js')>=0) {
			WebSite.domain=s.substr(0,s.lastIndexOf('/',s.lastIndexOf('/')-1));
			pos=s.indexOf('?');
			if (pos>0) want=want.concat(s.substr(pos+1).split(','));
			break;
		}
	}
	//导入IE专有CSS
	if (!WebSite.goodUA) {
		ss=document.getElementsByTagName('link');
		for (var i=0;i<ss.length;++i) {
			var s=ss[i];
			if (s.rel=='stylesheet' && s.href.indexOf('images/9/')>0) {
				document.write('<link rel="stylesheet" href="'+WebSite.domain+'/images/9/ie.css"/>');
				break;
			}
		}
	}
	//载入脚本
	var writeScript=function(f){document.write('<script type="text/javascript" src="'+(WebSite.domain.indexOf('.sunny')<0?'http://www.65536.cn':WebSite.domain)+'/lib/'+f+'"></'+'script>');}
	for (var i=0,len=want.length;i<len;++i) {
		if (want[i]=='tinymce') writeScript('tiny_mce/tiny_mce.js.php');
		writeScript('9/?'+want[i]);
	}
})();
