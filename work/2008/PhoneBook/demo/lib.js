//频次列表，用于对象及其计数
var FrequencyList=Class.create({
	initialize:function(l){
		//l<enumerable>:[{n:name,c:count},...]
		this.h=new Hash();
		l.each(function(p){this.set(p.n,p.c);}.bind(this.h));
	},
	h:null,//用于存储列表的Hash
	count:function(n) {//计数
		var c=this.h.get(n);
		if (Object.isUndefined(c)) return 0;
		else return c;
	},
	has:function(n) {//是否存在
		return (this.count(n)>0);
	},
	add:function(n) {//添加一个
		var c=this.count(n);
		++c;
		this.h.set(n,c);
	},
	remove:function(n) {//删除一个
		var c=this.count(n);
		--c;
		if (c>0) this.h.set(n,c);
		else this.h.unset(n);
	},
	all:function() {//全部
		return this.h.keys();
	},
	asc:function() {//全部，升序排列
		return this.all().sortBy(function(k){return this.count(k);}.bind(this));
	},
	desc:function() {//全部，降序排列
		return this.asc().reverse();
	},
	include:function(q) {//是否有任一对象包含关键字
		return this.all().any(function(k){return k.include(q);});
	}
}); 

//XSLT转换，参考Manning出版社《Ajax in Action》http://www.manning.com/crane，较大改动
//使用方法：
//var xslt=new Ajax.XSLTUpdater(容器ID或对象,{onSuccess:成功完成回调,onNotSupported:不支持XSLT回调});
//new Ajax.Request(XML地址,{onSuccess:xslt.xmlLoad});
//new Ajax.Request(XSL地址,{onSuccess:xslt.xslLoad});
Ajax.XSLTUpdater=Class.create({
	options:{},
	xml:null,
	xsl:null,
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
});
Ajax.XSLTUpdater.isXSLTSupported = function() {
	if (window.XMLHttpRequest && window.XSLTProcessor) return true;
	if (!window.ActiveXObject) return false;
	try { new ActiveXObject("Microsoft.XMLDOM"); return true; }
	catch(err) { return false; }
};

//XPath支持
var XPath=Class.create({
	d:null,//document
	ns:null,//前缀->命名空间URL对应表
	initialize:function(d) {
		this.d=d;
		this.ns=new Hash();
	},
	//添加命名空间记录
	addNS:function(prefix,url) {
		this.ns.set(prefix,url);
	},
	//Gecko,namespaceResolver
	NSresolver:function(prefix) {
		return this.ns.get(prefix);
	},
	//MSXML,setProperty
	setProp:function() {
		this.d.setProperty('SelectionNamespaces',this.ns.collect(function(pair){return 'xmlns:'+pair.key+'="'+pair.value+'"';}).join(' '));
		this.d.setProperty('SelectionLanguage','XPath');		
	},
	//计算XPath表达式
	select:function(node,xpath) {
		if (document.evaluate) {//Gecko
			var r=this.d.evaluate(xpath,node,this.NSresolver.bind(this),5,null);//XPathResult.ORDERER_NODE_ITERATOR_TYPE=5
			var a=[]; var t;
			while (t=r.iterateNext()) a.push(t);
			return a;
		} else if (Prototype.Browser.IE) {//MSXML
			this.setProp();
			var r=node.selectNodes(xpath);
			var a=[];
			for (var i=0;i<r.length;++i) a.push(r.item(i));
			return a;
		}
	},
	//计算XPath表达式，返回第一个结果
	select1:function(node,xpath) {
		var s=this.select(node,xpath);
		return s.length>0?s[0]:null;
	},
	//计算XPath表达式，返回第一个结果内的文本
	selectT:function(node,xpath) {
		var s=this.select1(node,xpath);
		return s==null?'':s.firstChild.nodeValue;
	}
});
