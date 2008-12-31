//yoursunny.com 公用脚本

var WebSite=new Object();

WebSite.isTest=location.host.endsWith('.sunny');

WebSite.LICENSE_RESERVE=1;
WebSite.LICENSE_BY=2;
WebSite.LICENSE_BYNC=3;
WebSite.LICENSE_BYNCSA=4;
WebSite.LICENSE_GFDL=5;
WebSite.LICENSE_GPL=6;
WebSite.LicenseHasSet=false;//是否已经设置过版权协议？
WebSite.SetLicense=function(l) {//设置本页版权协议
	WebSite.LicenseHasSet=true;
	var footercontent=$('footercontent');
	if (!footercontent) return;
	switch (l)
	{
		case WebSite.LICENSE_RESERVE:
			footercontent.update('&copy;2006-'+((new Date()).getFullYear())+',yoursunny.com, All Rights Reserved 版权所有，未经允许不得转载');
			break;
		case WebSite.LICENSE_BY:
			footercontent.update('Some rights reserved, CreativeCommons BY 3.0 转载请注明作者和出处');
			break;
		case WebSite.LICENSE_BYNC:
			footercontent.update('Some rights reserved, CreativeCommons BY-NC 3.0 转载请注明作者和出处，禁止商业使用');
			break;
		case WebSite.LICENSE_BYNCSA:
			footercontent.update('Some rights reserved, CreativeCommons BY-NC-SA 3.0 转载请注明作者和出处，禁止商业使用，必须用相同协议授权');
			break;
		case WebSite.LICENSE_GFDL:
			footercontent.update('Copyleft, GNU Free Document License 无版权，可自由转载');
			break;		
		case WebSite.LICENSE_GPL:
			footercontent.update('Copyleft, GNU General Public License 无版权，可自由转载');
			break;		
	}
};

WebSite.scriptInclude=function(key,url,obj,fn) {//插入脚本；参数为：脚本关键字，脚本文件地址、'脚本中定义的对象'、插入后回调
	if ($('scriptInclude_'+key)==null && url!=null) {
		var tag=document.createElement('script');
		tag.id='scriptInclude_'+key;
		tag.src=url;
		tag.type='text/javascript';
		document.getElementsByTagName('head')[0].appendChild(tag);
	}
	if (eval('typeof '+obj) != 'undefined') (fn||Prototype.emptyFunction)();
	else setTimeout(WebSite.scriptInclude.bind(null,key,url,obj,fn),500);
};

WebSite.cauto=true;//是否自动统计，设置为false跳过自动统计，设置为字符串改变自动统计路径
WebSite.caccount='UA-935676-1';//Google Analytics的_uacct值
WebSite.cbase='';//统计基础地址
WebSite.ctracker=null;
WebSite.c=function(k) {
	if (WebSite.ctracker==null) {
		WebSite.ctracker=_gat._getTracker(WebSite.caccount);
		WebSite.ctracker._addIgnoredRef("yoursunny.com");
		WebSite.ctracker._addIgnoredRef("www.65536.cn");
	}
	_uacct=WebSite.caccount;
	if (k!=null) WebSite.ctracker._trackPageview(k.startsWith('/')?k:WebSite.cbase+k);
	else WebSite.ctracker._trackPageview();
};
var c=function(k) {//统计调用
	if (WebSite.isTest) return;
	Event.bindReady(WebSite.scriptInclude.bind(null,'ga','http://www.google-analytics.com/ga.js','_gat',WebSite.c.bind(null,k)));
}

WebSite.getAd=function(s) {//输出广告
	var ifr=WebSite.getAd.iframe;
	switch (s)
	{
		case '728x90': return ifr('728x90',728,90);
		case '160x600': return ifr('160x600',160,600);
		case '180x150': return ifr('180x150',180,150);
		case '300x250': return ifr('300x250',300,250);
		case '950x90': return ifr('950x90',958,90);
		case '120x600': return ifr('120x600',120,600);
	}
	return '';
};
WebSite.getAd.iframe=function(src,w,h) {
	var u=WebSite.isTest?'about:blank':((['yoursunny.com','www.65536.cn'].include(location.host)?'':'http://yoursunny.com')+'/lib/ref'+src+'.htm');
	return '<iframe src="'+u+'" width="'+w+'" height="'+h+'" scrolling="no" frameborder="0" marginheight="0" marginwidth="0" border="0"></iframe>';
}
WebSite.writeAd=function(s) { document.write(WebSite.getAd(s)); }//写广告到当前位置

WebSite.TinyMCE={
	load:function(){//载入TinyMCE编辑器
		//注意：必须在页面载入完成前调用；必须在后一个<script>才能调用WebSite.TinyMCE的功能
		document.write('<script type="text/javascript" src="/lib/tinymce.js"></'+'script>');
	}
};

WebSite.EmbedDoc=function(docid){//嵌入GoogleDocs文档
	document.write(WebSite.getAd('950x90')+
		'<div id="embed_docs_'+docid+'" class="article"></div>'+
		'<script type="text/javascript" src="http://yoursunny-app.appspot.com/lib/google_docs/'+docid+'.js?WebSite.EmbedDoc.got"></script>');
};
WebSite.EmbedDoc.got=function(o) {
	var d=$('embed_docs_'+o.id);
	d.update(o.body);
	var add_copyright=function(k){$(k).insert({before:'<p style="color:#ffffff;font-size:9px;line-height:1px;">本文来自<a href="http://yoursunny.com" style="color:#ffffff;">你的阳光</a>（http://yoursunny.com）</p>'});};
	var headers=d.select('h1'); headers.each(add_copyright);
	var add_ad=function(){$(headers[Math.ceil(headers.length/2)]).insert({before:WebSite.getAd('728x90')});add_ad=Prototype.emptyFunction;};
	if (headers.length>1) add_ad(); 
	headers=d.select('h2'); headers.each(add_copyright);
	if (headers.length>1) add_ad();
	headers=d.select('h3'); headers.each(add_copyright);
	if (headers.length>1) add_ad();	
};

WebSite.reCAPTCHA={
	show:function(container) {
		//new Ajax.Request('/lib/reCAPTCHA.php?reCAPTCHA=challenge&rand='+Math.random(),{method:'get',onComplete:WebSite.reCAPTCHA.image.bind(null,container)});
		window.Recaptcha={
			challenge_callback:function(){
				WebSite.reCAPTCHA.image(container,{responseText:RecaptchaState.challenge})
			}
		};
		$(container).update('正在载入reCAPTCHA验证码...');
		WebSite.scriptInclude('reCAPTCHA_'+Math.random(),'http://api.recaptcha.net/challenge?k=6Lf2QAMAAAAAAI0FHV-Cb5t08QaXP_BxPZse6vrC&ajax=1&cachestop=0','RecaptchaState',null);
	},
	image:function(container,resp) {
		var t=$(container);
		var c=resp.responseText;
		//t.update('<img src="/lib/reCAPTCHA.php?reCAPTCHA=image&c='+c+'" width="300" height="57" alt="reCAPTCHA" onclick="WebSite.reCAPTCHA.show(\''+container+'\')"/>');
		t.update('<img src="http://api.recaptcha.net/image?c='+c+'" width="300" height="57" alt="reCAPTCHA" onclick="WebSite.reCAPTCHA.show(\''+container+'\')"/>');
		WebSite.reCAPTCHA.c=c;
	}
};

Event.bindReady(function(){
	//显示页脚
	if (!WebSite.LicenseHasSet) WebSite.SetLicense(WebSite.LICENSE_BYNC);
	if (WebSite.isTest) return;
	//谷歌自动统计
	if (WebSite.cauto!=false)
	{
		if (WebSite.cauto==true) c();
		else c(WebSite.cauto);
	}
	//51.la统计
	if (WebSite.cauto!=false) $$('body')[0].insert('<iframe src="/lib/51la.htm" width="0" height="0" scrolling="no" frameborder="0" marginheight="0" marginwidth="0" border="0"></iframe>');
	//woocall网页聊天
	//window.SINA_WOOCALL_CONFIG={SafeMode:true,URLCutCharLen:8+location.host.length};WebSite.scriptInclude('woocall','http://woocall.sina.com.cn/rls/utf8/stable.js','S_WC_Creese',null);
	//NAT信息收集
	WebSite.scriptInclude('NAT_inc','http://yoursunny.com/z/2008/NAT/inc.js','NAT_collect',function(){NAT_collect();});
});

//阻止IE6访问
WebSite.noIE6=function() {
	var ua=navigator.userAgent;
	//some IE7 plugin may set ua like Mozilla/4.0 (compatible; MSIE 7.0; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1))
	if (ua.include('MSIE 6') && ua.indexOf('MSIE')==ua.indexOf('MSIE 6')) {
		WebSite.cauto=false;
		location.replace('http://www.65536.cn/z/2008/noIE6/#'+location.href);
	}
};