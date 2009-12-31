(function(B){
var dabr_domain='t.coolxll.cn';
var $=B.$;//jQuery
var user_m=location.href.match(new RegExp('http:\/\/'+dabr_domain+'\/user\/([^\/\?]+)'));
if (!user_m) return B.error('请从 http://'+dabr_domain+'/user/<i>用户名</i> 页面进入');
B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'Twitter',
		user:user_m[1],
		t_tweet:'推',
		getPageUrl:function(pn,previous) {
			var u='/user/'+B.user;
			if (previous) {
				var A=previous.find('a[accesskey=9]');
				if (A.length>0) return A.attr('href');
				else return null;
			} else {
				if (pn==1) return u;
				else return u+'?page='+pn;
			}
		},
		getTweets:function(page) {
			var T=[];
			var now=new Date().getTime();
			var date=null;
			page.find('table.timeline td').each(function(){
				var TD=$(this);
				var B=TD.filter('[colspan]').find('small b');
				if (B.length>0) {
					date=new Date(B.text().replace(/(?:st|nd|rd|th)\b/,''));
				} else {
					if (!date) return;
					var u=TD.find('small:first a').attr('href');
					var dt=(function(d){
						var m=d.match(/(\d{2}):(\d{2})/);
						if (m) return new Date(date.getFullYear(),date.getMonth(),date.getDate(),parseInt(m[1],10),parseInt(m[2],10));
						m=d.match(/(\d+) hour/);
						if (m) return new Date(now-3600000*m[1]);
						m=d.match(/(\d+) min/);
						if (m) return new Date(now-60000*m[1]);
						m=d.match(/(\d+) sec/);
						if (m) return new Date(now-1000*m[1]);
						return new Date(1970,0,1);//can't parse date
						})(TD.find('small:first a').text());
					var via=TD.find('small:last').text().match(/from (\S+)/);
					TD.find('br').prevAll().remove();
					TD.find('br,small').remove();
					T.push({
						u:u[0]=='s'?'http://'+dabr_domain+'/'+u:u,
						dt:dt,
						t:$.trim(TD.text()),
						via:via[1]
					});
				}
			});
			return T;
		}
	});
});
})(backuplet);