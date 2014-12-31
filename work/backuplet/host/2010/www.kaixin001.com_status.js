(function(B){
var $=B.$;//jQuery
var user,nickname,user_m=location.href.match(/home\/status\.php\?uid=(\d+)/);
if (user_m) {
	user=user_m[1];
	nickname=(''+$('#r2_2 div.xcj41 b').text()).replace('的状态更新','');
	startLoad();
} else {
	if (location.href.match(/home\/status\.php$/)) {
		user_m=$('a:contains(我的首页)').attr('href').match(/uid=(\d+)/);
		user=user_m[1];
	} else {
		return B.fault('请从 http://www.kaixin001.com/home/status.php?uid=<i>用户ID</i> 页面进入');
	}
	B.getMyName(function(name){
		nickname=name;
		startLoad();
	});
}

function startLoad(){
B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'开心网',
		user:user,
		nickname:nickname,
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
			var nowt=new Date(),now=nowt.getTime();
			page.find('div.state_list:has(div.st_txt)').each(function(){
				var DIV=$(this);
				var u=DIV.prev('a[id]').attr('id').match(/view_(\d+)/);
				var dt=(function(d){
					var m=d.match(/(\d{4})年(\d{2})月(\d{2})日 (\d{2}):(\d{2})/);
					if (m) return new Date(parseInt(m[1],10),parseInt(m[2],10)-1,parseInt(m[3],10),parseInt(m[4],10),parseInt(m[5],10));
					m=d.match(/(\d+)天/);
					if (m) return new Date(now-86400000*m[1]);
					m=d.match(/(\d+)小时/);
					if (m) return new Date(now-3600000*m[1]);
					m=d.match(/(\d+)分钟/);
					if (m) return new Date(now-60000*m[1]);
					m=d.match(/(\d+)秒/);
					if (m) return new Date(now-1000*m[1]);
					m=d.match(/(\d+)月(\d+)日/);
					if (m) return new Date(nowt.getFullYear(),parseInt(m[1],10)-1,parseInt(m[2],10));
					return new Date(1970,0,1);//can't parse date
					})(DIV.find('div.st_txt div div:first').text());
				var P=DIV.find('div.st_txt p');
				P.find('img').each(function(){
					var IMG=$(this);
					if (IMG.attr('title')) IMG.replaceWith('['+IMG.attr('title')+']');
				});
				T.push({
					id:'http://www.kaixin001.com/home/status.php?uid='+B.user+'&stateid='+u[1],
					updated:dt,
					title:P.text()
				});
			});
			return T;
		}
	});
});
}//end of startLoad

})(backuplet);