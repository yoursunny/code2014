//COOKIE处理，参考清华大学出版社《JavaScript示例导学》
document.getCookie=function(name) {//读取cookie
	var cookies=document.cookie;
	var start=cookies.indexOf(name+'=');
	if (start==-1) return null;
	var len=start+name.length+1;
	var end=cookies.indexOf(';',len);
	if (end==-1) end=cookies.length;
	return unescape(cookies.substring(len,end));
};

document.setCookie=function(name, value, expires, path, domain, secure) {//写入cookie
	value=escape(value);
	expires=expires?';expires='+expires.toGMTString():'';
	path=path?';path='+path:'';
	domain=domain?';domain='+domain:'';
	secure=secure?';secure':'';
	document.cookie=name+'='+value+expires+path+domain+secure;
};

document.deleteCookie=function(name, path, domain) {//删除cookie
	var expires=';expires=Thu, 01-Jan-70 00:00:01 GMT';
	path=path?';path='+path:'';
	domain=domain?';domain='+domain:'';
	if (document.getCookie(name))
	document.cookie=name+'='+expires+path+domain;
};

//XSLT转换，参考Manning出版社《Ajax in Action》http://www.manning.com/crane，较大改动
//使用方法：
//var xslt=new Ajax.XSLTUpdater(容器ID或对象,{onSuccess:成功完成回调,onNotSupported:不支持XSLT回调});
//new Ajax.Request(XML地址,{onSuccess:xslt.xmlLoad});
//new Ajax.Request(XSL地址,{onSuccess:xslt.xslLoad});
Ajax.XSLTUpdater=Class.create();
Ajax.XSLTUpdater.isXSLTSupported = function() {
	if (window.XMLHttpRequest && window.XSLTProcessor) return true;
	if (!window.ActiveXObject) return false;
	try { new ActiveXObject("Microsoft.XMLDOM"); return true; }
	catch(err) { return false; }
};
Ajax.XSLTUpdater.prototype={
	options:{},
	initialize:function(container,options) {
		this.container=$(container);
		Object.extend(this.options,options||{});
		this.xmlLoad=this.xmlLoad_.bind(this);
		this.xslLoad=this.xslLoad_.bind(this);
	},
	xmlLoad_:function(transport) {
		this.xml=transport.responseXML;
		this.update();
	},
	xslLoad_:function(transport) {
		this.xsl=transport.responseXML;
		this.update();
	},
	update:function() {
		if (this.xml==null || this.xsl==null) return;
		if (!Ajax.XSLTUpdater.isXSLTSupported())
		{
			(this.options.onNotSupported||Prototype.emptyFunction)();
			return;
		}
		if (window.XMLHttpRequest&&window.XSLTProcessor) this.updateMozilla();
		else if (window.ActiveXObject) this.updateIE();
		(this.options.onSuccess||Prototype.emptyFunction)();
	},
	updateMozilla:function() {
		var processor=new XSLTProcessor();
		processor.importStylesheet(this.xsl);
		var fragment=processor.transformToFragment(this.xml,document);
		this.container.innerHTML='';
		this.container.appendChild(fragment);
	},
	updateIE:function(container) {
		this.container.innerHTML=this.xml.transformNode(this.xsl);
	}
};

//http://www.codebit.cn/pub/html/javascript/tip/get_viewport_info/
document.windowSize=null;
document.prepareWindowSize=function() {//获取浏览器窗口中文档（视口）可用尺寸
	var w = (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth;
	var h = (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;
	document.windowSize={w:w,h:h};
};

//表单对象必须填写
Form.must=function(ele,msg) {
	ele=$(ele);
	if (!ele) return;
	var v=$F(ele);
	if (v.length<1)
	{
		alert(msg);
		ele.focus();
		return null;
	}
	return v;
};

//获得浏览器版本信息，参考http://static.xiaonei.com/js/fb/base.js，少量改动
var UserAgent={
	ie:function(){return this._ie;},
	firefox:function(){return this._firefox;},
	opera:function(){return this._opera;},
	safari:function(){return this._safari;},
	windows:function(){return this._windows;},
	osx:function(){return this._osx;},
	prepare:function(){
		var agent=/(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso).(\d+\.\d+))|(?:Opera.(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))/.exec(navigator.userAgent);
		var os=/(Mac OS X;)|(Windows;)/.exec(navigator.userAgent);
		if(agent) {
			ua._ie=agent[1]?parseFloat(agent[1]):NaN;
			ua._firefox=agent[2]?parseFloat(agent[2]):NaN;
			ua._opera=agent[3]?parseFloat(agent[3]):NaN;
			ua._safari=agent[4]?parseFloat(agent[4]):NaN;
		} else {
			ua._ie=ua._firefox=ua._opera=ua._safari=NaN;
		}
		if(os) {
			ua._osx=!!os[1];
			ua._windows=!!os[2];
		} else {
			ua._osx=ua._windows=false;
		}
	}
};

//XPath支持，参考http://js-xpath.sourceforge.net/
function XPath(dom,xpath)
{
	if (document.evaluate)
	{
		var r=document.evaluate(xpath,dom,null,5,null);//XPathResult.ORDERER_NODE_ITERATOR_TYPE=5
		var a=[];
		var t;
		while (t=r.iterateNext()) a.push(t);
		return a;
	}
	else if (Prototype.Browser.IE)
	{
		return dom.selectNodes(xpath);
	}
	else return null;
}

//对Enumerable的所有对象应用模板
//en=Enumerable对象
//it1=迭代器1(在应用模板前执行，默认Prototype.K)
//it2=迭代器2(在应用模板后执行，默认Prototype.K)
//sep=连接处字符串(默认空字符串)
Template.prototype.evalAll=function(en,it1,it2,sep) {
	it1=it1||Prototype.K;
	it2=it2||Prototype.K;
	sep=sep||'';
	return en.collect(function(o){
		return it2(this.evaluate(it1(o)));
	}.bind(this)).join(sep);
};

//移除SELECT的所有选项
Form.clearSelect=function(sel) {
	while (sel.length>0) sel.options[0]=null;
	return sel;
}