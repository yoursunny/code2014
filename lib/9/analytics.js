//统计代码

//本地测试网站
WebSite.isTest=location.host.match(/\.sunny$/)||location.host.match(/^test/)||location.host.match('/userfly\.com/');

WebSite.cauto=true;//是否自动统计，设置为false跳过自动统计，设置为字符串改变自动统计路径
WebSite.caccount='UA-935676-1';//Google Analytics的_uacct值
WebSite.cbase=unescape(location.pathname.replace(/[^\/]*$/,''));//统计基础地址
WebSite.ctracker=null;
WebSite.c=function(k) {
	var t=WebSite.ctracker;
	if (t==null) {
		WebSite.ctracker=t=_gat._getTracker(WebSite.caccount);
		t._addIgnoredRef("yoursunny.com");
		t._addIgnoredRef("www.65536.cn");
	}
	if ((typeof k=='undefined') || k==null) t._trackPageview();
	else t._trackPageview((k[0]=='/')?k:WebSite.cbase+k);
};
var c=function(k) {//统计调用
	if (WebSite.isTest) return;
	WebSite.c(k);
};
document.write('<script type="text/javascript" src="http://www.google-analytics.com/ga.js"></'+'script>');
//document.write('<script type="text/javascript" src="http://analytics.live.com/Analytics/msAnalytics.js"></'+'script>');

(function() {
	var load_analytics=function() {
		if (WebSite.cauto!==false)
		{
			//Google Analytics
			if (WebSite.cauto===true) c();
			else c(WebSite.cauto);
			//51.la
			var iframe=document.createElement('iframe');
			iframe.src='/lib/9/51la.htm';
			iframe.width=1; iframe.height=1;
			iframe.style.zIndex='-1';
			iframe.style.position='absolute';
			document.body.appendChild('iframe');
			//adCenter, 2008-11-25 test, 2009-03-08 closed
			//msAnalytics.ProfileId = 'D4A8';
			//msAnalytics.TrackPage();
		}
	};
	if (window.addEventListener) { window.addEventListener('load',load_analytics,false); }
	else if (window.attachEvent) { window.attachEvent('onload',load_analytics); }
})();