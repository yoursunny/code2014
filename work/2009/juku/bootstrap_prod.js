// yoursunny JukuHelper bootstrap

(function(){
var baseurl='http://www.65536.cn/work/2009/juku/';
if (location.host!='club.msn.cn') {//非聚酷站内，启动分享到聚酷
	location.href=baseurl+'share/?'+encodeURIComponent(location.href+'|'+document.title);
	return;
}
if (window.yoursunnyJukuHelper) return;//聚酷助手已经载入，直接退出
var $=window.jQuery;
var J=window.yoursunnyJukuHelper={
	base:baseurl,
	load:function(u,cb) {//载入脚本
		var s=document.createElement('script');
		s.type='text/javascript';
		s.src=u[0]=='?'?J.base+'s/'+u:u;
		s.charset='utf-8';
		var done=false;
		s.onload=s.onreadystatechange=function(){
			if (!done && (!this.readyState || this.readyState=='loaded' || this.readyState=='complete')) {
				done=true;
				if (cb) cb();
				s.onload=s.onreadystatechange=null;
				document.body.removeChild(s);
			}
		};
		document.body.appendChild(s);
	},
	error:function(msg){B.start=function(){B.error(msg);};}
};
$.extend(J,{
	quit:function() {//清理并退出
		$('.yoursunnyJukuHelper').remove();
		delete window.yoursunnyJukuHelper;
	},
	remove_on_quit:[],
	stylesheet:null,
	addStyleRule:function(selector,css) {
		if (J.stylesheet==null) {
			$('head').append(document.createElement('style'));
			J.stylesheet=document.styleSheets[document.styleSheets.length-1];
		}
		if (typeof J.stylesheet.insertRule!='undefined') {
			J.stylesheet.insertRule(selector+' {'+css+'}',0);
		} else {
			J.stylesheet.addRule(selector,css,0)
		}
	},
	backuplet:function() {//调用backuplet
		J.load('http://www.65536.cn/work/2009/backuplet/s/');
	}
});

$('#footer_app div.QBar').html('<a href="http://www.65536.cn/work/2009/juku/" target="_blank">聚酷助手</a> <a href="javascript:;" onclick="yoursunnyJukuHelper.backuplet()">备份消息</a> <a href="javascript:;" onclick="yoursunnyJukuHelper.quit()">【关闭】</a>');

J.load('?i=uifix');
J.load('?i=timeline');
J.load('?i=hompy');




})();