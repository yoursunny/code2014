(function(B){
var $=B.$;//jQuery
var user,user_m=location.href.match(/t.ifeng.com\/([^\/\?\.]+)/);
if (user_m) user=user_m[1];
if (!user) return B.fault('请从 http://t.ifeng.com/<i>screen_name</i> 页面进入');

B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'凤凰微博',
		user:user,
		nickname:$('div.myprofile >.right >h1 >a').text(),
		t_tweet:'微博',
		getPageUrl:function(pn,previous) {
			return 'http://t.ifeng.com/'+user+'?page='+pn;
		},
		getTweets:function(page) {
			var T=[];
			page.find('div.NewsList >div[id^=item_]').each(function(){
				var ITEM=$(this);
				var con=ITEM.find('p.con:first');
				con.find('a:first').remove();
				var title=$.trim(con.text()).replace(/^：/,'');
				var newsTime=$.trim(ITEM.find('div.newsTime >p:first').text()).split(' ');
				var dt=new Date();
				if (newsTime[0]!='今天') {
					var date_m=newsTime[0].match(/([0-9]{2})月([0-9]{2})日/);
					dt.setMonth(parseInt(date_m[1],10)-1,parseInt(date_m[2],10));
				}
				var time_m=newsTime[1].match(/([0-9]{2}):([0-9]{2})/);
				dt.setHours(parseInt(time_m[1],10),parseInt(time_m[2],10),0,0);
				T.push({
					id:ITEM.attr('id').replace('item_','#t.ifeng.com_'),
					updated:dt,
					title:title
				});
			});
			return T;
		}
	});
});
})(backuplet);