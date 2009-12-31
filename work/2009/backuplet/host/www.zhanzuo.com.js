(function(B){
var $=B.$;//jQuery
var user_m=location.href.match(/status_me.php\?.*user_id=(\d+)/);
if (!user_m) return B.error('请从 http://www.zhanzuo.com/drift/status_me.php?user_id=<i>用户ID</i> 页面进入');
B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'占座',
		user:user_m[1],
		t_tweet:'状态',
		getPageUrl:function(pn,previous) {
			if (previous) {
				var A=previous.find('a[accesskey=n]');
				if (A.length>0) return A.attr('href');
				else return null;
			} else {
				if (pn==1) return '/drift/status_me.php?user_id='+B.user;
				else return '/drift/status_me.php?p='+pn+'&user_id='+B.user;
			}
		},
		getTweets:function(page) {
			var T=[];
			page.find('#fettle_list > li').each(function(){
				var LI=$(this);
				var u='#'+LI.find('input[id^=mood_id_]').val();
				var dt=LI.find('div span').remove().text().match(/(\d{2})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
				T.push({
					u:u,
					dt:new Date(2000+parseInt(dt[1],10),parseInt(dt[2],10)-1,parseInt(dt[3],10),parseInt(dt[4],10),parseInt(dt[5],10),parseInt(dt[6],10)),
					t:LI.find('div').text(),
					via:''
				});
			});
			return T;
		}
	});
});
})(backuplet);