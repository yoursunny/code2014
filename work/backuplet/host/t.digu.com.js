/*#include microblog*/

$('#__toolbar_').hide();
var user_m=location.href.match(/^http:\/\/t.digu.com\/([^#\/]+)/);
if (!user_m || $.inArray(user_m[1],['index','public','people','account','invite','app','logout','follow','home','c','followers','replies','message','favorites','my','search','about','about_en','help','privacy','feedback'])>=0) return B.fault('请从 http://t.digu.com/<i>用户名</i> 页面进入');

B.microblog_site={
	t_site:'嘀咕',
	t_item:'嘀咕',
	user:user_m[1],
	nickname:$.trim($('h2.screen-name').text()),
	fetchBio:function(){
		var aboutme=$('#side ul.aboutme');
		var findBio=function(label) {
			var STRONG=aboutme.find('li strong:contains('+label+')');
			if (STRONG.length<1) return '';
			var LI=STRONG.parent().clone();
			LI.find('strong').remove();
			return $.trim(LI.text());
		};
		B.feedData['microblog:bio']=findBio('个人简介');
		B.feedData['microblog:web']=findBio('网站');
		B.feedData['microblog:location']=findBio('所在地');
		B.proceed();
	},
	firstPage:function(){
		++B.currentPage;
		var T=[];
		$('#timeline li').each(function(){
			var LI=$(this);
			var u=LI.find('a.time-stamp').attr('href');
			var dt=LI.find('a.time-stamp').attr('title').match(/(\d{2}):(\d{2}),(\d{4})-(\d{2})-(\d{2})/);
			var time=new Date(parseInt(dt[3],10),parseInt(dt[4],10)-1,parseInt(dt[5],10),parseInt(dt[1],10),parseInt(dt[2],10));
			var via=LI.find('span.meta').text().match(/通过([\S]+)/);
			T.push({
				id:u,
				title:LI.find('div.content').text(),
				updated:time,
				'microblog:via':via[1]
			});
		});
		var last=T[T.length-1];
		B.thePage={
			from:'{current-page}',
			minId:last.id.replace(/^.*\//,''),
			minTime:last.updated.getTime()
		};
		B.processTweets(T);
	},
	getPageUrl:function(pn,previous) {
		var u='/ajaxData/getUserData.jsp?_='+(new Date().getTime());
		if (previous.lists) {
			return u+'&minId='+previous.lists[0][3]
			+'&minTime='+previous.lists[0][4]
			+'&sortId=2&showFollowBtn=false&type=1&mid='+B.user;
		}
		if (previous.from=='{current-page}') {
			return u+'&minId='+previous.minId
				+'&minTime='+previous.minTime
				+'&sortId=2&showFollowBtn=false&type=1&mid='+B.user;
		}
		return null;
	},
	requestPage:B.requestJSON,
	getTweets:function(json) {
		if (json.from=='{current-page}') return json.T;
		var T=[];
		$.each(json.lists,function(i,t){
			T.unshift({
				id:'http://t.digu.com/detail/'+t[3],
				title:$('<p>').html(t[5]).text(),
				updated:new Date(t[4]),
				'microblog:via':$('<p>').html(t[7]).text().replace('通过','')
			});
		});
		return T;
	}
};

