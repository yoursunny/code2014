//Copyright 2006-2010 yoursunny.com

/* ---- common script ---- */

// Google Analytics early initialize; track.js is also required
window._gaq=[['_setAccount','UA-935676-1'],['_addIgnoredRef','yoursunny.com'],['_addIgnoredRef','yoursunny.cn'],['_setSiteSpeedSampleRate',20],['_trackPageview']];
function c(k){//send specific url to Google Analytics
	_gaq.push(['_trackPageview',(k.charAt(0)=='/')?k:unescape(location.pathname.replace(/[^\/]*$/,''))+k]);
}

var W={
	resolveURL:function(u){
		if (u[0]=='/' && u[1]!='/') return (location.host=='your.sunny'?'http://your.sunny':'http://yoursunny.com')+u;
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
	load_jquery:function(cb){
		W.loadjs('//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js',function(){
			W.ready=function(cb){$(cb);};
			if(cb) cb();
		});
		W.load_jquery=function(cb){ if(cb) cb(); };
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
	getTagClass:function(tag,className){//$('#tag.className')
		var ELEs=document.getElementsByTagName(tag),
			a=[],cls=' '+className+' ';
		for (var i=0;i<ELEs.length;++i) {
			if ((' '+ELEs[i].className+' ').indexOf(cls)>=0) a.push(ELEs[i]);
		}
		return a;
	},
	prettify:function(len){//google-code-prettify with break-line support
		if (!len) len=80;
		var break_line=function(ele){
			var a=ele.innerHTML.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
				.replace(/\t/g,'  ').replace(/\r/g,'').split('\n'),
				b=[],r='';
			for (var i=0;i<a.length;++i) {
				var l=a[i];
				while (l.length>len) {
					b.push(l.substr(0,len));
					l=l.substr(len);
				}
				b.push(l);
			}
			for (var i=0;i<b.length;++i) {
				r+=b[i].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'<br/>';
			}
			ele.innerHTML=r;
		};
		var PREs=W.getTagClass('PRE','break-line'),CODEs=W.getTagClass('CODE','break-line');
		for (var i=0;i<PREs.length;++i) break_line(PREs[i]);
		for (var i=0;i<CODEs.length;++i) break_line(CODEs[i]);
		if (typeof window['prettyPrint']=='function') {
			prettyPrint();
		} else {
			W.loadjs('/lib/10/prettify.js',function(){prettyPrint();});
		}
	},
	disable_relatedlinks:false,
	disable_searchbox:false,
	disable_jiathis:false,
	trackout:function(u){
		if (!/^http/.test(u) || /(?:yoursunny\.com)|(?:\.sunny)/.test(u)) return;
		c('/out/'+u.replace(/https?\:\/\//,''));
	}
};
W.ready(function(){
	W.ready=function(cb){cb();};
	var BODY=document.getElementsByTagName('BODY')[0];
	if (/MSIE 6/.test(navigator.userAgent)) BODY.className+=' ie6';
	var is_mobile=/mobile/.test(BODY.className);
	var DIVsidebar=W.getTagClass('DIV','contents_sidebar');
	DIVsidebar=DIVsidebar.length>0?DIVsidebar[0]:null;
	//Google Related Links
	if (!is_mobile && !W.disable_relatedlinks && /(?:\/[^\/]+){2,}/.test(location.pathname) && DIVsidebar) {
		var DIV=document.createElement('div');
		DIV.id='relatedlinks_container_div';
		DIVsidebar.appendChild(DIV);
		W.loadjs('http://relatedlinks.googlelabs.com/client/client.js?url='+encodeURIComponent(document.URL)+'&referrer='+encodeURIComponent(document.referrer)+'&relatedlinks_id=10442_4216860685000087986&title='+encodeURIComponent(document.title));
	}
	//search box
	if (!is_mobile && !W.disable_searchbox) {
		var DIVheader=W.getTagClass('DIV','header');
		if (DIVheader.length>0) {
			var FORM=document.createElement('form');
			FORM.action='http://cn.bing.com/search';
			FORM.method='get';
			FORM.target='_blank';
			FORM.className='header-searchbox';
			FORM.innerHTML='<input type="text" name="q"><input type="hidden" name="q1" value="site:yoursunny.com"><input type="submit" value="阳光搜索">';
			W.bind(FORM,'submit',function(){
				c('/search?q='+encodeURIComponent(FORM.q.value));
			});
			DIVheader[0].appendChild(FORM);
		}
	}
	//jiathis
	W.disable_jiathis=true;
	if (!is_mobile && !W.disable_jiathis) {
		var H1=W.getTagClass('H1','tit');
		if (H1.length>0) {
			H1[0].innerHTML='<a href="http://www.jiathis.com/share/?uid=889771" class="jiathis" target="_blank"><img src="http://v2.jiathis.com/code/images/jiathis2.gif" border="0" id="jiathis_a" /></a>'+H1[0].innerHTML;
			W.loadjs('http://v2.jiathis.com/code/jia.js?uid=889771');
		}
	}
});

/* ---- page-specific script ---- */

/* work article page */
function work_download(f,t){
	if (!t) t=f;
	c(t);
	var m=location.pathname.match(/work\/([a-z0-9]+)/i);
	if (m) window.open('http://cid-1fa4aa816e7dc9f3.office.live.com/self.aspx/yoursunny-tech/work/'+m[1]+'%5E_'+f);
}

/* tech article page */
function tech_download(f,t){
	if (!t) t=f;
	c(t);
	window.open('http://cid-1fa4aa816e7dc9f3.office.live.com/self.aspx/yoursunny-tech/articles/'+f);
}

/* blogger page */
if (/blogspot/.test(location.host)) {
	W.ready(function(){
		var note=/sunnypower/.test(location.host)?' 作者：<a href="http://m.yoursunny.com">阳光男孩</a>':' 本文来源网络，著作权归原作者所有';
		var footers=W.getTagClass('p','BloggerPostFooter');
		for (var i=0;i<footers.length;++i) {
			var P=footers[i];
			var A=P.getElementsByTagName('a')[0];
			A.innerHTML=(function(s)
				{
					var dt=new Date(s);
					var d2=function(n){return (n>9?'':'0')+n;};
					return [dt.getFullYear(),'-',d2(dt.getMonth()+1),'-',d2(dt.getDate()),' ',d2(dt.getHours()),':',dt.getMinutes()].join('');
				})(A.innerHTML);
			P.innerHTML+=note;
		}
	});
}
