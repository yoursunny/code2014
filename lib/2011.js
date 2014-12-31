//Copyright 2006-2011 yoursunny.com

// Google Analytics
window._gaq=[['_setAccount','UA-935676-1'],['_addIgnoredRef','yoursunny.com'],['_addIgnoredRef','yoursunny.cn'],['_setSiteSpeedSampleRate',20]];
if (/yoursunny\.cn/.test(location.host)) _gaq.push(['_trackPageview','/cn'+unescape(location.pathname)]);
else _gaq.push(['_trackPageview']);
function c(k){//send specific url to Google Analytics
	var u=(k.charAt(0)=='/')?k:unescape(location.pathname.replace(/[^\/]*$/,''))+k;
	if (/yoursunny\.cn/.test(location.host) && !/^\/out/.test(k)) u='/cn'+u;
	_gaq.push(['_trackPageview',u]);
}

var W={
	noop:function(){},
	resolveURL:function(u){
		if (u[0]=='/') return (location.host=='your.sunny'?'http://your.sunny':'http://yoursunny.com')+u;
		return u;
	},
	loadjs:function(u,cb){//load a script
		var s=document.createElement('script');
		s.type='text/javascript';
		s.src=W.resolveURL(u);
		s.async=true;
		var head=document.getElementsByTagName('head')[0];
		var done=false;
		s.onload=s.onreadystatechange=function(){
			if (!done && (!this.readyState || this.readyState=='loaded' || this.readyState=='complete')) {
				done=true;
				if (cb) cb();
				s.onload=s.onreadystatechange=null;
				head.removeChild(s);
			}
		};
		head.appendChild(s);
	},
	bind:function(obj,evt,cb){
		if (typeof cb!='function') return;
		if (obj.addEventListener) {
			obj.addEventListener(evt,cb,false);
		} else if (obj.attachEvent) {
			obj.attachEvent('on'+evt,cb);
		} else {
			var ocb=obj['on'+evt];
			obj['on'+evt]=function(){
				if (typeof ocb=='function') ocb();
				cb();
			};
		}
	},
	ready:function(cb){
		var done=false;
		W.bind(window,'DOMContentLoaded',function(){ if(!done){done=true;cb();} });
		W.bind(window,'load',function(){ if(!done){done=true;cb();} });
	},
	loadjquery:function(){
		document.write('<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>');
	},
	track:function(hide){
		var b='<script type="text/javascript" src="http://www.google-analytics.com/ga.js"></script><script type="text/javascript" src="http://js.users.51.la/1697972.js"></script>';
		if (location.host!='yoursunny.com' && location.host!='yoursunny.cn') b='[track]';
		if (hide) b='<div style="display:none;">'+b+'</div>';
		document.write(b);
	},
	trackout:function(u){
		if (!/^http/.test(u) || /(?:yoursunny\.)|(?:\.sunny)/.test(u)) return;
		c('/out/'+u.replace(/https?\:\/\//,''));
	}
};
W.ready(function(){
	W.ready=function(cb){cb();};
	var BODY=document.getElementsByTagName('BODY')[0];
	if (/MSIE 6/.test(navigator.userAgent)) BODY.className+=' ie6';
});


/* ---- page-specific script ---- */
W.ready(function(){
	if (!window.jQuery) return;
	$('.markdown a').click(function(){
		var $a = $(this), u = $a.attr('href');
		if (!/^http/.test(u) || /(?:yoursunny\.)|(?:\.sunny)/.test(u)) return;
		W.trackout(u);
		window.open(u);
		return false;
	});
});


