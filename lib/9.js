// 9.js?lib1,lib2,...  'web' is always loaded
var WebSite={
	domain:'http://www.65536.cn',//主服务器域名
	goodUA:true//standard-compliant browser
};
(function(){
	//判断浏览器
	var pos,UA=navigator.userAgent;
	if (pos=UA.indexOf('MSIE ')>0) {
		var IEver=parseInt(UA.substr(pos+4));
		if (!isNaN(IEver) && IEver<8) WebSite.goodUA=false;
	}
	//寻找当前脚本标签
	var ss=document.getElementsByTagName('script'),pa=[];
	for (var i=0;i<ss.length;++i) {
		var s=ss[i].src;
		if (s.indexOf('9.js')>=0) {
			WebSite.domain=s.substr(0,s.lastIndexOf('/',s.lastIndexOf('/')-1));
			pos=s.indexOf('?');
			if (pos>0) pa=s.substr(pos+1).split(',');
			break;
		}
	}
	//默认配置
	var p={
		web:true,analytics:false,jquery:false,tinymce:false,prettify:false,blogger:false,//JS库
		cdn:false,//是否从CDN载入JS库
		loading:false//是否显示正在加载
	};
	//处理参数
	for (var i=0;i<pa.length;++i) {
		var pw=pa[i];
		if (p[pw]===false) p[pw]=true;
		if (pw.substr(0,3)=='no-') {
			var pk=pw.substr(3);
			if (p[pk]===true) p[pk]=false;
		}
		if (pw=='only-analytics') {
			p.web=false; p.analytics=true;
		}
	}
	//“正在加载”
	document.write('<div id="indi_loading" style="z-index:1;padding:5px 9px 5px 9px;background:#c44;right:0;top:0;color:#fff;'+(WebSite.goodUA?'position:fixed;':'position:absolute;')+(p.loading?'':'display:none;')+'">正在加载</div>');
	var hide=function(){var d=document.getElementById('indi_loading');d.style.display='none';d.innerHTML='';};
	if (window.addEventListener) { window.addEventListener('load',hide,false); }
	else if (window.attachEvent) { window.attachEvent('onload',hide); }
	//载入脚本
	var Script=function(f){document.write('<script type="text/javascript" src="'+f+'"></'+'script>');};
	var libScript=function(f){Script(WebSite.domain+'/lib/'+f);};
	for (var pw in p) {
		if (p[pw]) {
			switch (pw) {
				case 'web':
					if (p.cdn) { Script('http://ajax.googleapis.com/ajax/libs/prototype/1.6.0.3/prototype.js'); libScript('9/?web-ext'); }
					else libScript('9/?web');
					break;
				case 'jquery':
					if (p.cdn) {
						Script('http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js');
						document.write('<script type="text/javascript">$j=jQuery.noConflict();</'+'script>');
					}
					else libScript('9/?jquery');
					break;
				case 'analytics':
				case 'prettify':
				case 'blogger':
					libScript('9/?'+pw);
					break;
				case 'tinymce':
					libScript('tiny_mce/tiny_mce.js.php');
					libScript('9/?tinymce');
					break;
			}
		}
	}
})();
