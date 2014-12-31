(function(B){
var $=B.$;//jQuery
var user_m=location.href.match(/status\?id=(\d+)/);
if (!user_m) return B.fault('请从 http://status.renren.com/status?id=<i>用户ID</i> 页面进入');
$('#bottombar').css('z-index',50);
$('div[id^=ad]').hide();
B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'人人网',
		user:user_m[1],
		nickname:$('#my_panel li:first h3 a').text(),
		t_tweet:'状态',
		getPageUrl:function(pn,previous) {
			return 'curpage='+(pn-1)+'&userId='+B.user;
		},
		getPage:function(u,cb) {
			B.requestJSON('/GetSomeomeDoingList.do',cb,'POST',u);
		},
		getTweets:function(json) {
			return $.map(json.doingArray,function(doing){
				return {
					id:'http://status.renren.com/status/'+B.user+'/'+doing.id,
					updated:new Date(doing.dtime.replace(/\-/g,'/')),
					title:$('<div/>').html(doing.content).text()
				};
			});
		}
	});
});
})(backuplet);