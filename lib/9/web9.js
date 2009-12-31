// web9.js

//本地测试网站
WebSite.isTest=location.host.endsWith('.sunny')||location.host.startsWith('test')||location.host.include('userfly.com');

//载入外部脚本
//  key=关键字，避免重复载入；null无条件载入
//  url=脚本文件地址；null不载入新脚本
//  obj=脚本内定义的变量名(字符串)；此变量被定义后时回调fn
//  fn=回调函数
WebSite.loadJS=function(key,url,obj,fn) {
	if ((key==null || $('loadJS_'+key)==null) && url!=null) {
		var tag=document.createElement('script');
		if (key) tag.id='loadJS_'+key;
		tag.src=url;
		tag.type='text/javascript';
		document.getElementsByTagName('head')[0].appendChild(tag);
	}
	if (!Object.isFunction(fn)) return;
	if (eval('typeof '+obj) != 'undefined') (fn||Prototype.emptyFunction)();
	else setTimeout(WebSite.loadJS.curry(key,url,obj,fn),500);
};
WebSite.scriptInclude=WebSite.loadJS;//legacy

//如果对象存在，则插入
WebSite.insert=function(o,h) {
	if (Object.isArray(o) && o.length>0) return $(o[0]).insert(h);
	o=$(o); if (o&&Object.isFunction(o.insert)) o.insert(h);
};

//统计
WebSite.cauto=true;//是否自动统计，设置为false跳过自动统计，设置为字符串改变自动统计路径
WebSite.caccount='UA-935676-1';//Google Analytics的_uacct值
WebSite.cbase=unescape(location.pathname.replace(/[^\/]*$/,''));//统计基础地址
WebSite.ctracker=null;
WebSite.c=function(k) {
	if (WebSite.ctracker==null) {
		var t=WebSite.ctracker=_gat._getTracker(WebSite.caccount);
		t._addIgnoredRef("yoursunny.com");
		t._addIgnoredRef("www.65536.cn");
	}
	if (Object.isUndefined(k) || k==null) WebSite.ctracker._trackPageview();
	else WebSite.ctracker._trackPageview(k.startsWith('/')?k:WebSite.cbase+k);
};
var c=function(k) {//统计调用
	if (WebSite.isTest) return;
	if (WebSite.ctracker) WebSite.c(k);
	else WebSite.loadJS('ga','http://www.google-analytics.com/ga.js','_gat',WebSite.c.curry(k));
};

//广告
WebSite.getAd=function(s) {//输出广告
	var ifr=WebSite.getAd.iframe;
	switch (s)
	{
		case 'banner': return ifr('banner',728,90);
		case 'post': return ifr('post',468,60);
		case 'sidebar': return '<div class="p ad-sidebar"><div class="p-wrap">'+ifr('sidebar',250,250)+'</div></div>';
		case 'study': return ifr('study',950,90);
	}
	return '';
};
WebSite.getAd.iframe=function(src,w,h) {
	//var u=WebSite.isTest?'about:blank':((['yoursunny.com','www.65536.cn'].include(location.host)?'':'http://yoursunny.com')+'/lib/9/ad-'+src+'.htm');
	var u=WebSite.isTest?'about:blank':((['yoursunny.com'].include(location.host)?'':'http://yoursunny.com')+'/lib/9/ad-'+src+'.htm');
	//u='/lib/9/ad-'+src+'.htm';
	return '<div class="ad ad-%4 ad-%2x%3"><iframe src="%1" width="%2" height="%3" scrolling="no" frameborder="0" marginheight="0" marginwidth="0" border="0"></iframe></div>'.format(u,w,h,src);
};
WebSite.writeAd=function(s) { document.write(WebSite.getAd(s)); };//写广告到当前位置
WebSite.replaceAd=function() {//替换广告代码
	['banner','post','sidebar'].each(function(t){$$('div.ad-'+t+':empty').invoke('replace',WebSite.getAd(t));});
};
WebSite.bannerAd=true;

//图片验证码
WebSite.reCAPTCHA={
	show:function(container) {
		window.Recaptcha={
			challenge_callback:function(){
				WebSite.reCAPTCHA.image(container,{responseText:RecaptchaState.challenge})
			}
		};
		$(container).update('正在载入reCAPTCHA验证码...');
		if (window.RecaptchaState) delete RecaptchaState;
		WebSite.loadJS(null,'http://api.recaptcha.net/challenge?k=6Lf2QAMAAAAAAI0FHV-Cb5t08QaXP_BxPZse6vrC&ajax=1&cachestop=0','RecaptchaState');
	},
	image:function(container,resp) {
		var t=$(container);
		var c=resp.responseText;
		t.update('<img src="http://api.recaptcha.net/image?c='+c+'" width="300" height="57" alt="reCAPTCHA" onclick="WebSite.reCAPTCHA.show(\''+container+'\')"/>');
		WebSite.reCAPTCHA.c=c;
	}
};

//新窗口打开
WebSite.NewWinLink=function(){$$('a[rel~=external]:not([target])','a.newwin:not([target])','form.newwin:not([target])').invoke('writeAttribute','target','_blank');};

//进度指示
WebSite.showLoading=function(msg){
	var d=$('indi_loading');
	if (!d) { $(document.body).insert({top:'<div id="indi_loading" style="z-index:1;padding:5px 9px 5px 9px;background:#c44;right:0;top:0;color:#fff;position:fixed"></div>'}); d=$('indi_loading'); }
	d.update(msg).show();
};
WebSite.hideLoading=function(){ var d=$('indi_loading');if(d){d.hide().update();} }

//Google Friend Connect, 2008-12-05 test
WebSite.FC={
	init:function(cb) {
		WebSite.loadJS('google_friend_connect','http://www.google.com/friendconnect/script/friendconnect.js','gadgets',function(){
			google.friendconnect.container.setParentUrl('/lib/google-friend-connect/');
			(cb||Prototype.emptyFunction)();
		});
	},
	base_skin:{
		BORDER_COLOR:'#F7F7EF',
		ENDCAP_BG_COLOR:'#F7F7EF',
		ENDCAP_TEXT_COLOR:'#336699',
		ENDCAP_LINK_COLOR:'#0000FF',
		ALTERNATE_BG_COLOR:'#FFFFFF',
		CONTENT_BG_COLOR:'#FFFFFF',
		CONTENT_LINK_COLOR:'#0000FF',
		CONTENT_TEXT_COLOR:'#333333',
		CONTENT_SECONDARY_LINK_COLOR:'#7777CC',
		CONTENT_SECONDARY_TEXT_COLOR:'#666666',
		CONTENT_HEADLINE_COLOR:'#333333'
	},
	skin:function(o1,o2) {
		return Object.extend(Object.extend(Object.extend({},WebSite.FC.base_skin),o1||{}),o2||{});
	},
	site:'02145106343004500556',
	SignIn:function(container,skin) {
		WebSite.FC.init(function(){
			google.friendconnect.container.renderSignInGadget(
				{
					id:$(container).id,
					site:WebSite.FC.site
				},
				WebSite.FC.skin({ALIGNMENT:'right'},skin)
			);
		});
	},
	Members:function(container,skin) {
		WebSite.FC.init(function(){
			google.friendconnect.container.renderMembersGadget(
				{
					id:$(container).id,
					site:WebSite.FC.site
				},
				WebSite.FC.skin({HEIGHT:'300'},skin)
			);
		});
	},
	Review:function(container,skin,docid) {
		WebSite.FC.init(function(){
			google.friendconnect.container.renderReviewGadget(
				{
					id:$(container).id,
					site:WebSite.FC.site,
					'view-params':{disableMinMax:"false",scope:"ID",docId:docid,startMaximized:"true"}
				},
				WebSite.FC.skin({
					DEFAULT_COMMENT_TEXT:'\u5199\u4e0b\u4f60\u7684\u8bc4\u4ef7',
					HEADER_TEXT:'\u5bf9\u6b64\u5185\u5bb9\u7684\u8bc4\u4ef7',
					POSTS_PER_PAGE:'5'
				},skin)
			);
		});
	}
};

//userfly鼠标轨迹跟踪，2009-01-03 test
WebSite.userfly=function() {
	if (!location.host.include('userfly.com')) {
		//Event.onReady(WebSite.loadJS.curry('userfly','http://asset.userfly.com/users/2388/userfly.js'));
		Event.onReady(function(){
			if (Object.isUndefined(window.jQuery)) WebSite.loadJS('jquery',WebSite.domain+'/lib/9/?jquery','jQuery',WebSite.loadJS.curry('userfly','/lib/9/?userfly'));
			else WebSite.loadJS('userfly',WebSite.domain+'/lib/9/?userfly');
		});
	}
};

//PDF保存，2009-01-12 test
WebSite.SaveAsPDF=function() {
	return 'http://savepageaspdf.pdfonline.com/pdfonline/pdfonline.asp?cURL='+escape(location.href)+'&author_id=982E6EF4-1D45-4466-AD53-7CD1D1DA82A9&page=1&top=0.5&bottom=0.5&left=0.5&right=0.5';
};

//Google Related Links, 2009-11-08 test
WebSite.RelatedLinks=function() {
	var sidebar=$$('div.sidebar');
	if (sidebar.length<1) return;
	var id=null,u=document.URL;
	if (u.startsWith('http://www.65536.cn/work/')||u.startsWith('http://www.65536.cn/t/')) id='10148_3458508127999445231';
	if (!id) return;
	sidebar[0].insert('<div class="p"><div class="p-wrap"><div id="relatedlinks_container_div"></div></div></div>');
	var escFun=window.encodeURIComponent?window.encodeURIComponent:escape;
	WebSite.loadJS('RelatedLinks','http://relatedlinks.googlelabs.com/client/client.js?url='+escFun(u)+'&referrer='+escFun(document.referrer)+'&relatedlinks_id='+id+'&title='+escFun(document.title));
};

//页面载入后执行
Event.onReady(function(){
	WebSite.hideLoading();
	//Google Custom Search + banner ad
	WebSite.insert($$('.header ul'),{after:($('cse-search-box')?'':'<form action="http://yoursunny.com/lib/search/" id="cse-search-box"><div><input type="hidden" name="cx" value="016439686750744889237:i6z5lva1ths" /><input type="hidden" name="cof" value="FORID:10" /><input type="hidden" name="ie" value="UTF-8" /><input type="text" name="q" class="search-box" /><input type="submit" name="sa" value="阳光搜索" class="search-btn" /></div></form>')+(WebSite.bannerAd?WebSite.getAd('banner'):'')});
	if (!WebSite.bannerAd) $$('.header').invoke('addClassName','noBannerAd');
	{var f=$('cse-search-box');if(f){var q=f.q;if(navigator.platform=='Win32'){q.style.cssText='border: 1px solid #7e9db9; padding: 2px;';}var b=function(){if(q.value==''){q.style.background='#FFFFFF url(http:\x2F\x2Fwww.google.com\x2Fcoop\x2Fintl\x2Fen\x2Fimages\x2Fgoogle_custom_search_watermark.gif) left no-repeat';}};var f=function(){q.style.background='#ffffff';};q.onfocus=f;q.onblur=b;if(!/[&?]q=[^&]/.test(location.search)){b();}}};
	//新窗口打开
	WebSite.NewWinLink();
	//广告
	WebSite.replaceAd();
	//Google Related Links
	WebSite.RelatedLinks();
	//本地测试网站脚本执行结束
	if (WebSite.isTest) return;
	if (WebSite.cauto!==false)
	{
		//Google Analytics
		if (WebSite.cauto===true) c();
		else c(WebSite.cauto);
		//51.la
		$(document.body).insert('<iframe id="iframe_51la" src="/lib/9/51la.htm" width="1" height="1" style="z-index:-1;position:absolute;"></iframe>');
		//adCenter, 2008-11-25 test, 2009-03-08 closed
		//WebSite.scriptInclude('adCenter','http://analytics.live.com/Analytics/msAnalytics.js','msAnalytics',function(){
			//msAnalytics.ProfileId = 'D4A8';
			//msAnalytics.TrackPage();
		//});
	}
	//NAT信息收集
	//WebSite.scriptInclude('NAT_inc','http://yoursunny.com/z/2008/NAT/inc.js','NAT_collect',function(){NAT_collect();});
});
