(function(B){
var $=B.$;//jQuery
$('#__toolbar_').hide();
var user_m=location.href.match(/^http:\/\/digu.com\/([^\/]+)/);
if (!user_m || $.inArray(user_m[1],['index','public','people','account','invite','app','logout','follow','home','c','followers','replies','message','favorites','my','search','about','about_en','help','privacy','feedback'])>=0) return B.fault('请从 http://digu.com/<i>用户名</i> 页面进入');
B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'嘀咕',
		user:user_m[1],
		nickname:$.trim($('h2.screen-name').text()),
		t_tweet:'嘀咕',
		getPageUrl:function(pn,previous) {
			if (previous) {
				var u='/ajaxData/getUserData.jsp?_='+(new Date().getTime());
				if (previous.lists) {
					return u+'&minId='+previous.lists[0][3]
					+'&minTime='+previous.lists[0][4]
					+'&sortId=2&showFollowBtn=false&type=1&mid='+B.user;
				}
				if (previous.from=='{current-page}') {
					var T=previous.T;
					return u+'&minId='+T[T.length-1].id.replace('http://digu.com/detail/','')
					+'&minTime='+previous.lastTime.getTime()
					+'&sortId=2&showFollowBtn=false&type=1&mid='+B.user;
				}
				return null;
			} else {
				if (pn==1) return '{current-page}';
				else return null;
			}
		},
		getPage:function(u,cb) {
			if (u=='{current-page}') cb(B.fromCurrentPage());
			else B.requestJSON(u,cb,'GET');
		},
		fromCurrentPage:function() {
			var T=[],lastTime=null;
			$('#timeline li').each(function(){
				var LI=$(this);
				var u=LI.find('a.time-stamp').attr('href');
				var dt=LI.find('a.time-stamp').attr('title').match(/(\d{2}):(\d{2}),(\d{4})-(\d{2})-(\d{2})/);
				var time=lastTime=new Date(parseInt(dt[3],10),parseInt(dt[4],10)-1,parseInt(dt[5],10),parseInt(dt[1],10),parseInt(dt[2],10));
				var via=LI.find('span.meta').text().match(/通过([\S]+)/);
				T.push({
					id:u[0]=='/'?'http://digu.com'+u:u,
					title:LI.find('div.content').text(),
					updated:time,
					'microblog:via':via[1]
				});
				
			});
			return {
				from:'{current-page}',
				lastTime:lastTime,
				T:T
			};
		},
		getTweets:function(json) {
			if (json.from=='{current-page}') return json.T;
			var T=[];
			$.each(json.lists,function(i,t){
				T.unshift({
					id:'http://digu.com/detail/'+t[3],
					title:$('<p>').html(t[5]).text(),
					updated:new Date(t[4]),
					'microblog:via':$('<p>').html(t[7]).text().replace('通过','')
				});
			});
			return T;
		}
	});
});
})(backuplet);