(function(){

window.talk={
	component_base:'http://www.65536.cn/work/2009/talk/component.php?f=',
	loadJS:function(src) {
		var s=document.createElement('script');
		s.type='text/javascript';
		s.src=src.indexOf(':')?src:talk.component_base+src;
		s.charset='utf-8';
		document.body.appendChild(s);
	},
	writeJS:function(src) {
		document.write('<script type="text/javascript" src="'+(src.indexOf(':')>=0?src:talk.component_base+src)+'" charset="utf-8"></'+'script>');
	},
	loadStyle:function(href) {
		var l=document.createElement('link');
		l.rel='stylesheet';
		l.type='text/css';
		l.href=href;
		var h=document.getElementsByTagName('head')[0];
		if (h) h.appendChild(l);
	},
	onWindowLoad:function(f) {
		if (window.addEventListener) { window.addEventListener('load',f,false); }
		else if (window.attachEvent) { window.attachEvent('onload',f); }
		else window.onload=f;
	},
	extend:function(o) {
		for (var p in o) {
			talk[p]=o[p];
		}
	}
};
var jQuery_url='http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js';
var msgrlib_url='http://www.wlmessenger.net/api/2.5/messenger.js';
switch (location.search) {
	case '?main':
		talk.writeJS(jQuery_url);
		talk.writeJS('main.js');
		break;
	case '?signin':
		talk.writeJS(msgrlib_url);
		talk.writeJS('signin.js');
		break;
	default:
		var m=location.search.match(/\?conversation-(\d+)/);
		if (m) {
			talk.writeJS(jQuery_url);
			talk_config.conversation_id=parseInt(m[1],10);
			talk.writeJS('conversation.js');
		}
		break;
}

})();