(function(B){
var $=B.$;//jQuery
$('div.MIB_trayMain').css('z-index',50);
var user,user_m=location.href.match(/t.sina.com.cn\/([^\/\?\.]+)/);
if (user_m) user=user_m[1];
if (!user) return B.fault('请从 http://t.sina.com.cn/<i>screen_name</i> 页面进入');

B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'新浪微博',
		user:user,
		nickname:$('div.MIB_mbloghead div.name span.lf').text()||'',
		t_tweet:'新鲜事',
		getPageUrl:function(pn,previous) {
			if (previous) {
				var nextLink=previous.find('div.MIB_bobar a.btn_num em:contains(下一页)');
				if (nextLink.length<1) return null;
				return nextLink.first().parent().attr('href');
			} else {
				if (pn==1) return 'http://t.sina.com.cn/'+user;
				else return null;
			}
		},
		getTweets:function(page) {
			var T=[];
			page.find('ul.MIB_feed li').each(function(){
				var LI=$(this);
				var CITE=LI.find('div.MIB_linkbl div.lf cite');
				var dt=(function(d){
					var m=d.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
					if (m) return new Date(parseInt(m[1],10),parseInt(m[2],10)-1,parseInt(m[3],10),parseInt(m[4],10),parseInt(m[5],10));
					return new Date(1970,0,1);//can't parse date
					})(CITE.first().find('a strong').attr('date'));
				var P=LI.find('p.sms');
				var via='';
				if (CITE.length>1) via=CITE.last().text();
				T.push({
					id:CITE.find('a').attr('href'),
					updated:dt,
					title:P.text(),
					'microblog:via':via
				});
			});
			return T;
		}
	});
});
})(backuplet)