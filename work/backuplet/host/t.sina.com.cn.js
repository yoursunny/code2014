/*#include microblog*/

var $=B.$;//jQuery
$('div.MIB_trayMain,div.header,div.tsina_gnbarea').css('z-index',50);
$('div.PopLayer').hide();
var user,user_m=location.href.match(/t.sina.com.cn\/([^#\/\?\.]+)/);
if (user_m) user=user_m[1];
if (!user || $.inArray(user,['n'])>=0) return B.fault('请从 http://t.sina.com.cn/<i>screen_name</i> 页面进入');

var parseDate=function(s){
	var now=new Date();
	var m=s.match(/([0-9]{1,2})月([0-9]{1,2})日 ([0-9]{2}):([0-9]{2})/);
	if (m) return new Date(now.getFullYear(),m[1]-1,m[2],m[3],m[4]);
	m=s.match(/今天 ([0-9]{2}):([0-9]{2})/);
	if (m) return new Date(now.getFullYear(),now.getMonth(),now.getDate(),m[1],m[2]);
	return new Date(0);
};

B.microblog_site={
	t_site:'新浪微博',
	t_item:'新鲜事',
	user:user,
	nickname:$('div.MIB_mbloghead div.name span.lf').text()||'',
	fetchBio:function(){
		var otherInfo=$('#profileHeadBg div.other_info');
		B.feedData['microblog:bio']=otherInfo.find('p.MIB_txtbl:not(.blog)').text();
		B.feedData['microblog:web']=otherInfo.find('p.blog a').attr('href');
		B.feedData['microblog:location']=$.trim(otherInfo.find('div.ad').text());
		B.proceed();
	},
	getPageUrl:function(pn,previous) {
		if (previous) {
			var nextLink=previous.find('div.MIB_bobar a.btn_num em:contains(下一页)');
			if (nextLink.length<1) return null;
			return nextLink.first().parent().attr('href');
		} else {
			if (pn==1) {
				if ($CONFIG.$domain=='t.sina.com.cn/'+user) return 'http://t.sina.com.cn/'+user+'/profile';
				return 'http://t.sina.com.cn/'+user;
			}
			else return null;
		}
	},
	getTweets:function(page) {
		var T=[];
		page.find('ul.MIB_feed li').each(function(){
			var LI=$(this);
			var CITE=LI.find('div.MIB_linkbl div.lf cite');
			var dt=parseDate(CITE.first().find('a strong').text());
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
};
