(function(B){
var $=B.$;//jQuery
var user,user_m=location.href.match(/fanfou.com\/([^\/\?\.]+)/);
if (user_m) user=user_m[1];
if (!user || $.inArray(user,['home','login','privatemsg','finder','browse','search','settings','logout','badge'])>=0) return B.fault('请从 http://fanfou.com/<i>screen_name</i> 页面进入');

B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'饭否',
		user:user,
		nickname:$('#panel h1').text(),
		t_tweet:'消息',
		getPageUrl:function(pn,previous) {
			return 'http://fanfou.com/'+user+'/p.'+pn;
		},
		getTweets:function(page) {
			var T=[];
			page.find('#stream li').each(function(){
				var LI=$(this);
				var stampA=LI.find('.stamp a');
				var id=stampA.attr('href');
				T.push({
					id:id.charAt(0)=='/'?'http://fanfou.com'+id:id,
					updated:new Date(stampA.attr('stime')),
					title:$.trim(LI.find('.content').text()),
					'microblog:via':LI.find('.method').text()
				});
			});
			return T;
		}
	});
});
})(backuplet);