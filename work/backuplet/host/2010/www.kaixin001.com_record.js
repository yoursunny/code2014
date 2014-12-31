(function(B){
var $=B.$;//jQuery
var user,nickname,user_m=location.href.match(/[~!]record\/record\.php\?uid=(\d+)/);
if (user_m) {
	user=user_m[1];
	nickname=(''+$('#r2_2 div.xcj41 b').text()).replace('的记录','');
	startLoad();
} else {
	if (location.href.match(/[~!]record\/record\.php$/)) {
		user_m=$('a:contains(我的首页)').attr('href').match(/uid=(\d+)/);
		user=user_m[1];
	} else {
		return B.fault('请从 http://www.kaixin001.com/~record/record.php?uid=<i>用户ID</i> 页面进入');
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
		t_tweet:'记录',
		getPageUrl:function(pn,previous) {
			if (previous) {
				var A=previous.find('div.fy_p a:contains(下一页)');
				if (A.length>0) {
					var u=A.attr('href');
					return u[0]=='?'?'/~record/record.php'+u:u;
				} else return null;
			} else {
				if (pn==1) return '/~record/record.php?uid='+B.user;
				else return '/~record/record.php?uid='+B.user+'&start='+((pn-1)*20);
			}
		},
		getTweets:function(page) {
			var T=[];
			var thisYear=new Date().getFullYear();
			page.find('#noempty div.rcd_box3').each(function(){
				var DIV=$(this);
				var dt_m=DIV.find('div.rcd_bgt3 div.l').text().match(/(?:(\d{4})年)?(\d{2})月(\d{2})日 (\d{2}):(\d{2})/);
				var dt=new Date(!!dt_m[1]?dt_m[1]:thisYear,-1+parseInt(dt_m[2],10),dt_m[3],dt_m[4],dt_m[5]);
				var word=DIV.find('div[id^=word_]');
				var tweet={
					id:'http://www.kaixin001.com/~record/record.php?uid='+B.user+'&rid='+word.attr('id').substr(5),
					updated:dt,
					title:$.trim(word.find('p').text())
				};
				if (word.find('a[href$=wap.php]').length>0) tweet['microblog:via']='手机WAP';
				T.push(tweet);
			});
			return T;
		}
	});
});
}//end of startLoad

})(backuplet);