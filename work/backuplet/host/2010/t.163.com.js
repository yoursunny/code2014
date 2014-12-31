(function(B){
var $=B.$;//jQuery
var user,user_m=location.href.match(/t.163.com\/([a-z0-9\_]+)/i);
if (!user_m) return B.fault('请从 http://t.163.com/<i>screen_name</i> 页面进入');
user=user_m[1];

B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'网易微博',
		user:user,
		nickname:$('div.userInfo >.bd >.cell >.u-name').text(),
		t_tweet:'微博',
		getPageUrl:function(pn,previous) {
			if (previous) {
				if ($.isArray(previous) && previous.length>0) {
					var last=previous[previous.length-1];
					return 'since_id='+last.timeline.id+'&timeSince='+last.timeline.time;
				} else {
					return null;
				}
			} else {
				return 'since_id=&timeSince=';
			}
		},
		getPage:function(u,cb) {
			u+='&rnd='+(new Date().getTime());
			B.requestJSON('/statuses/user_timeline/'+user+'.json',cb,'GET',u);
		},
		getTweets:function(json) {
			return $.map(json,function(tweet){
				return {
					id:'http://t.163.com/'+B.user+'/status/'+tweet.id,
					updated:new Date(tweet.created_at),
					title:tweet.text,
					'microblog:via':tweet.source
				};
			});
		}
	});
});
})(backuplet);