(function(B){
var $=B.$;//jQuery
var user_m=location.href.match(/^http:\/\/zuosa.com\/([^\/\?]+)/);
if (!user_m || $.inArray(user_m[1].toLowerCase(),['dmsg','regist','status','badge','settings','help'])>=0) return B.error('请从 http://zuosa.com/<i>用户名</i> 页面进入');
$('#divSettingMsg').hide();
var user=decodeURIComponent(user_m[1]);
var nickname=$('#ctl00_ContentPlaceHolder1_UserProfile_liUserName .fn').text();
if (nickname) nickname=$.trim(nickname);
else nickname=user;
B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'做啥',
		user:user,
		nickname:nickname,
		t_tweet:'更新',
		getPageUrl:function(pn,previous) {
			var query='';
			if (previous) {
				var lid=previous.find('li.unlight:last').attr('id').substr(1);
				query='user='+user+'&tab=1&r=20&lid='+lid;
			} else {
				query='user='+user+'&tab=1&r=20'
			}
			query+='&_uptime='+(new Date().getTime());
			return '/ajax/EventLogList.aspx?'+query;
		},
		getTweets:function(page) {
			var T=[];
			var now=new Date();
			page.find('li.unlight').each(function(){
				var LI=$(this);
				var Atime=LI.find('a[time]');
				var u=Atime.attr('href');
				if (!u) return;
				var dt=(function(d){
					var m=d.match(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
					if (m) return new Date(parseInt(m[1],10),parseInt(m[2],10)-1,parseInt(m[3],10),parseInt(m[4],10),parseInt(m[5],10),parseInt(m[6],10));
					return new Date(1970,0,1);//can't parse date
					})(Atime.attr('time'));
				var via=LI.find('span.method').text().match(/通过(\S+)/);
				T.push({
					id:u[0]=='/'?'http://zuosa.com'+u:u,
					updated:dt,
					title:LI.find('span.content').text(),
					'microblog:via':$.trim(via[1])
				});
			});
			return T;
		}
	});
});
})(backuplet);