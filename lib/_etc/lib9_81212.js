// lib9.js

//Cookie读写
var Cookie={set:function(C,D,B){var A="";if(B!=undefined){var E=new Date();E.setTime(E.getTime()+(86400000*parseFloat(B)));A="; expires="+E.toGMTString()}return(document.cookie=escape(C)+"="+escape(D||"")+A)},get:function(A){var B=document.cookie.match(new RegExp("(^|;)\\s*"+escape(A)+"=([^;\\s]*)"));return(B?unescape(B[2]):null)},erase:function(A){var B=Cookie.get(A)||true;Cookie.set(A,"",-1);return B}}

//Event.onReady(function)，在window的DOM能被操作时发生的事件，lowpro-0.2
Object.extend(Event,{_domReady:function(){if(arguments.callee.done)return;arguments.callee.done=true;if(Event._timer)clearInterval(Event._timer);Event._readyCallbacks.each(function(f){f()});Event._readyCallbacks=null;},onReady:function(f){if(!this._readyCallbacks){var domReady=this._domReady;if(domReady.done)return f();if(document.addEventListener)
document.addEventListener("DOMContentLoaded",domReady,false);if(Prototype.Browser.IE){document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");document.getElementById("__ie_onload").onreadystatechange=function(){if(this.readyState=="complete"){domReady();}};}
if(/WebKit/i.test(navigator.userAgent)){this._timer=setInterval(function(){if(/loaded|complete/.test(document.readyState))domReady();},10);}
Event.observe(window,'load',domReady);Event._readyCallbacks=[];}
Event._readyCallbacks.push(f);}});
//Event.bindReady(function)，兼容老代码
Event.bindReady=function(f){Event.onReady(f);};

//字符串格式化 '%1 %2'.format('a','b') => 'a b'
String.prototype.format=function() {
	var a=arguments;
	var p=new RegExp('%([1-'+arguments.length+'])','g');
	return this.replace(p,function(match,i){return a[i-1];});
};
//字符串HTML特殊字符编码，不使用DOM操作
String.prototype.encodeHTML=function() {
	return this.replace(/&/g,'&amp;').replace('/</g','&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
};

//针对IE8的脚本加速
if (window.JSON && JSON.parse) {
	//Object.toJSON=JSON.stringify; buggy (extra \)
	String.prototype.evalJSON=function(){return JSON.parse(String(this));};
}

