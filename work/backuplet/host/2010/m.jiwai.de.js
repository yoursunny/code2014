(function(B){
var $=B.$;//jQuery
var user_m=location.href.match(/^http:\/\/m.jiwai.de\/([^\/\?]+)/);
if (!user_m || user_m[1]=='public_timeline' || user_m[1]=='help') return B.error('请从 http://m.jiwai.de/<i>用户名</i>/ 页面进入');
var user=decodeURIComponent(user_m[1]);
if (user=='wo') {
	var user_m=$('a[accesskey=1]').attr('href').match(/\/([^\/]+)\/$/);
	user=user_m[1];
}
B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'叽歪',
		user:user,
		nickname:$.trim(''+$('body>h2+p:contains(姓名：)').text()).replace('姓名：',''),
		t_tweet:'发言',
		getPageUrl:function(pn,previous) {
			var u='/'+B.user+'/';
			if (pn==1) return u;
			else return u+'?page='+pn;
		},
		getTweets:function(page) {
			var T=[];
			var now=new Date();
			page.find('h2+ul li').each(function(){
				var LI=$(this);
				var stamp=LI.find('span.stamp');
				var u=LI.find('a:contains(收藏)').attr('href').match(/favourite\/(\d+)/);
				var dt=(function(d){
					var m=d.match(/(\d{4})\-(\d{2})\-(\d{2}) .* (\d{2}):(\d{2}):(\d{2})/);
					if (m) return new Date(parseInt(m[1],10),parseInt(m[2],10)-1,parseInt(m[3],10),parseInt(m[4],10),parseInt(m[5],10),parseInt(m[6],10));
					m=d.match(/(\d{4})\-(\d{2})\-(\d{2}) .* (\d{2}):(\d{2})/);
					if (m) return new Date(parseInt(m[1],10),parseInt(m[2],10)-1,parseInt(m[3],10),parseInt(m[4],10),parseInt(m[5],10));
					m=d.match(/(\d+) 小时/);
					if (m) return new Date(now-3600000*m[1]);
					m=d.match(/(\d+) 分钟/);
					if (m) return new Date(now-60000*m[1]);
					m=d.match(/(\d+) 秒/);
					if (m) return new Date(now-1000*m[1]);
					return new Date(1970,0,1);//can't parse date
					})(stamp.text());
				var via=stamp.text().match(/通过\s*(\S+)/);
				stamp.prevAll('a').each(function(){
					var A=$(this);
					var href=A.attr('href');
					if (href.match(/\/t\/[^\/]+\/$/)) return;
					var m=href.match(/\/gwt\/n\?.*u=([^&=]+)/);
					if (m) href=decodeURIComponent(m[1]);
					A.text(href);
				});
				stamp.nextAll().remove();
				stamp.remove();
				T.push({
					id:'http://api.jiwai.de/statuses/show/'+u[1]+'.xml',
					title:$.trim(LI.text()),
					updated:dt,
					'microblog:via':$.trim(via[1])
				});
			});
			return T;
		}
	});
});
})(backuplet);