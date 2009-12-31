// lib9.js

//Cookie读写
var Cookie={set:function(C,D,B){var A="";if(B!=undefined){var E=new Date();E.setTime(E.getTime()+(86400000*parseFloat(B)));A="; expires="+E.toGMTString()}return(document.cookie=escape(C)+"="+escape(D||"")+A)},get:function(A){var B=document.cookie.match(new RegExp("(^|;)\\s*"+escape(A)+"=([^;\\s]*)"));return(B?unescape(B[2]):null)},erase:function(A){var B=Cookie.get(A)||true;Cookie.set(A,"",-1);return B}}

//Event.onReady(function)，在window的DOM能被操作时发生的事件
Event.onReady=Event.bindReady=function(f){document.observe('dom:loaded',function(){f();});};

//字符串格式化 '%1 %2'.format('a','b') => 'a b'
String.prototype.format=function() {
	var a=arguments;
	var p=new RegExp('%([1-'+a.length+'])','g');
	return this.replace(p,function(match,i){return a[i-1];});
};
//字符串HTML特殊字符编码，不使用DOM操作
String.prototype.encodeHTML=function() {
	return this.gsub('&','&amp;').gsub('<','&lt;').gsub('>','&gt;').gsub('"','&quot;').gsub("'",'&apos;');
};

//日期格式化
Date.prototype.format=function(fmt) {
	return fmt.gsub('Y',this.getFullYear().toPaddedString(4)).gsub('m',(this.getMonth()+1).toPaddedString(2)).gsub('d',this.getDate().toPaddedString(2)).gsub('H',this.getHours().toPaddedString(2)).gsub('i',this.getMinutes().toPaddedString(2)).gsub('s',this.getSeconds().toPaddedString(2));
};

//针对IE8的脚本加速
if (window.JSON && JSON.parse) {
	//Object.toJSON=JSON.stringify; buggy (extra \)
	String.prototype.evalJSON=function(){return JSON.parse(String(this));};
}

