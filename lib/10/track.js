//tracking code

(function(){
	if (!window._gaq) {
		window._gaq=[['_setAccount',''],['_addIgnoredRef','yoursunny.com'],['_addIgnoredRef','yoursunny.cn'],['_trackPageview']];
		window.c=function(k){//send specific url to Google Analytics
			_gaq.push(['_trackPageview',(k.charAt(0)=='/')?k:unescape(location.pathname.replace(/[^\/]*$/,''))+k]);
		};
	}
	var load_ga=function(account){
		if (window._gaq[0][0]=='_setAccount') window._gaq[0][1]=account;
		if (!window._gat) {
			var ga=document.createElement('script');
			ga.type='text/javascript';
			ga.async=true;
			ga.src='http://www.google-analytics.com/ga.js';
			(document.getElementsByTagName('head')[0]||document.body).appendChild(ga);
		}
	};
	
	switch (location.host){
		case 'yoursunny.com':
			load_ga('UA-935676-1');
			document.write('<script type="text/javascript" src="http://js.users.51.la/1697972.js"></script>');
			break;
		case 'sunnypower.blogspot.com':
			load_ga('UA-935676-6');
			break;
		case 'yoursunny.blogspot.com':
			load_ga('UA-935676-7');
			break;
	}
})();
