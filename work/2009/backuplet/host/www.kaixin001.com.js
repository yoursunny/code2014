(function(B){
var $=B.$;//jQuery
var user,user_m=location.href.match(/home\/status\.php\?uid=(\d+)/);
if (user_m) {
	user=user_m[1];
} else {
	if (location.href.match(/home\/status\.php$/)) {
		user_m=$('a:contains(我的首页)').attr('href').match(/uid=(\d+)/);
		user=user_m[1];
	} else {
		return B.error('请从 http://www.kaixin001.com/home/status.php?uid=<i>用户ID</i> 页面进入');
	}
}
B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'开心网',
		user:user,
		t_tweet:'状态更新',
		getPageUrl:function(pn,previous) {
			if (previous) {
				var A=previous.find('div.fy_p a:contains(下一页)');
				if (A.length>0) {
					var u=A.attr('href');
					return u[0]=='?'?'/home/status.php'+u:u;
				} else return null;
			} else {
				if (pn==1) return '/home/status.php?uid='+B.user;
				else return '/home/status.php?uid='+B.user+'&start='+((pn-1)*20);
			}
		},
		getTweets:function(page) {
			var T=[];
			var now=new Date().getTime();
			page.find('div.state_list').each(function(){
				var DIV=$(this);
				if (DIV.find('div.st_txt').length==0) return;
				var u=DIV.prev('a[name]').attr('name').match(/view_(\d+)/);
				var dt=(function(d){
					var m=d.match(/(\d{4})年(\d{2})月(\d{2})日 (\d{2}):(\d{2})/);
					if (m) return new Date(parseInt(m[1],10),parseInt(m[2],10)-1,parseInt(m[3],10),parseInt(m[4],10),parseInt(m[5],10));
					m=d.match(/(\d+)小时/);
					if (m) return new Date(now-3600000*m[1]);
					m=d.match(/(\d+)分钟/);
					if (m) return new Date(now-60000*m[1]);
					m=d.match(/(\d+)秒/);
					if (m) return new Date(now-1000*m[1]);
					m=d.match(/(\d+)月(\d+)日/);
					if (m) return new Date(now.getFullYear(),parseInt(m[1],10)-1,parseInt(m[2],10));
					return new Date(1970,0,1);//can't parse date
					})(DIV.find('div.st_txt div div:first').text());
				T.push({
					u:'#'+u[1],
					dt:dt,
					t:DIV.find('div.st_txt p').text(),
					via:''
				});
			});
			return T;
		}
	});
});
})(backuplet);