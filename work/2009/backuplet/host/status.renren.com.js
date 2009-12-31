(function(B){
var $=B.$;//jQuery
var user_m=location.href.match(/id=(\d+)/);
if (!user_m) return B.error('请从 http://status.renren.com/getdoing.do?id=<i>用户ID</i> 页面进入');
B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'人人网',
		user:user_m[1],
		t_tweet:'状态',
		getPageUrl:function(pn,previous) {
			if (previous) {
				var A=previous.find('div.pager-bottom a[title="下一页"]');
				if (A.length>0) {
					var u=A.attr('href');
					return u[0]=='?'?'/getdoing.do'+u:u;
				} else return null;
			} else {
				if (pn==1) return '/getdoing.do?id='+B.user;
				else return '/getdoing.do?curpage='+(pn-1)+'&id='+B.user;
			}
		},
		getTweets:function(page) {
			var T=[];
			var now=new Date();
			page.find('#status-list div.status-content').each(function(){
				var DIV=$(this);
				var u=DIV.find('div[id^=replyfordoing]').attr('id').match(/replyfordoing(\d+)/);
				var dt=DIV.find('span.time');
				if (dt.length>0) {
					dt=dt.text().match(/(\d{2})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
					dt=new Date(2000+parseInt(dt[1],10),parseInt(dt[2],10)-1,parseInt(dt[3],10),parseInt(dt[4],10),parseInt(dt[5],10))
				} else {
					dt=now;//好友的最新状态，页面上没有时间
				}
				DIV.find('p.body span').remove();
				T.push({
					u:'#'+u[1],
					dt:dt,
					t:DIV.find('p.body').text(),
					via:''
				});
			});
			return T;
		}
	});
});
})(backuplet);