window._gaq=[['_setAccount','UA-935676-1'],['_addIgnoredRef','yoursunny.com'],['_addIgnoredRef','yoursunny.cn'],['_setSiteSpeedSampleRate',20]];
if (/yoursunny\.cn/.test(location.host)) _gaq.push(['_trackPageview','/cn'+unescape(location.pathname)]);
else _gaq.push(['_trackPageview']);

var W = {
	track:function(k) {
		var u = (k.charAt(0)=='/') ? k : unescape(location.pathname.replace(/[^\/]*$/,'')) + k;
		if (/yoursunny\.cn/.test(location.host) && !/^\/out/.test(k)) u = '/cn'+u;
		_gaq.push(['_trackPageview',u]);
	},
	trackout:function(u) {
		if (!/^http/.test(u) || /(?:yoursunny\.)|(?:\.sunny)/.test(u)) return;
		W.track('/out/'+u.replace(/https?\:\/\//,''));
	}
};

$(function(){
	$('body').delegate('a','click',function(){
		var $a = $(this), u = $a.attr('href');
		if (/^\#/.test(u) && $a.parents('.hash-scroll').length>0) {
			var $target = $(u);
			if ($target.length > 0) {
				window.scroll(0, $target.offset().top);
				return false;
			}
		} else if (/^(?:http[s]?\:)?\/\//.test(u) && ! /^http\:\/\/(?:local\.)?yoursunny\.(?:com|cn)(?:$|\/)/.test(u)) {
			W.trackout(u);
			window.open(u);
			return false;
		}
	});
});


