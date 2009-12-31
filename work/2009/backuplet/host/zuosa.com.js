(function(B){
var $=B.$;//jQuery
var user_m=location.href.match(/^http:\/\/zuosa.com\/([^\/\?]+)/);
if (!user_m || $.inArray(user_m[1].toLowerCase(),['dmsg','regist','status','badge','settings','help'])>=0) return B.error('请从 http://zuosa.com/<i>用户名</i> 页面进入');
var user=user_m[1];
B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'做啥',
		user:user_m[1],
		t_tweet:'更新',
		getPageUrl:function(pn,previous) {
			if (previous) {
				var A=previous.find('a[id$=StatusListPanel_LinkNext]');
				if (A.length>0) return A.attr('href');
				else return null;
			} else {
				if (pn==1) return '/'+B.user;
				else return '/Status/UserHome.aspx?user='+encodeURIComponent(B.user)+'&tab=1&p='+(pn-1);
			}
		},
		getTweets:function(page) {
			var T=[];
			var now=new Date();
			page.find('#statusList li.unlight').each(function(){
				var LI=$(this);
				var u=LI.find('span.stamp a:first').attr('href');
				if (!u) return;
				var dt=(function(d){
					var m=d.match(/(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2})/);
					if (m) return new Date(parseInt(m[1],10),parseInt(m[2],10)-1,parseInt(m[3],10),parseInt(m[4],10),parseInt(m[5],10));
					m=d.match(/(\d+) 小时/);
					if (m) return new Date(now-3600000*m[1]);
					m=d.match(/(\d+) 分钟/);
					if (m) return new Date(now-60000*m[1]);
					m=d.match(/(\d+) 秒/);
					if (m) return new Date(now-1000*m[1]);
					if (d.match(/刚才/)) return now;
					return new Date(1970,0,1);//can't parse date
					})(LI.find('span.stamp a:first').text());
				var via=LI.find('span.method').text().match(/通过(\S+)/);
				T.push({
					u:u[0]=='/'?'http://zuosa.com'+u:u,
					dt:dt,
					t:LI.find('span.content').text(),
					via:$.trim(via[1])
				});
			});
			return T;
		}
	});
});
})(backuplet);