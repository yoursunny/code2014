(function(B){
var $=B.$;//jQuery
var user_m=location.href.match(/^http:\/\/digu.com\/([^\/]+)/);
if (!user_m || $.inArray(user_m[1],['index','public','people','account','invite','app','logout','follow'])>=0) return B.error('请从 http://digu.com/<i>用户名</i> 页面进入');
B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'嘀咕',
		user:user_m[1],
		t_tweet:'嘀咕',
		getPageUrl:function(pn,previous) {
			var u='/'+B.user;
			if (previous) {
				var A=previous.find('a[title="下一页"]');
				if (A.length>0) return A.attr('href');
				else return null;
			} else {
				if (pn==1) return u;
				else return u+'/'+pn;
			}
		},
		getTweets:function(page) {
			var T=[];
			page.find('#digulist li').each(function(){
				var LI=$(this);
				var u=LI.find('span.meta a[title]').attr('href');
				var dt=LI.find('span.meta a[title]').attr('title').match(/(\d{2}):(\d{2}),(\d{4})-(\d{2})-(\d{2})/);
				var via=LI.find('span.meta').text().match(/通过([\S]+)/);
				T.push({
					u:u[0]=='/'?'http://digu.com'+u:u,
					dt:new Date(parseInt(dt[3],10),parseInt(dt[4],10)-1,parseInt(dt[5],10),parseInt(dt[1],10),parseInt(dt[2],10)),
					t:LI.find('p').eq(1).text(),
					via:via[1]
				});
			});
			return T;
		}
	});
});
})(backuplet);