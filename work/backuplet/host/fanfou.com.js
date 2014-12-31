/*#include microblog*/

var user,user_m=location.href.match(/fanfou.com\/([^#\/\?\.]+)/);
if (user_m) user=user_m[1];
if (!user || $.inArray(user,['home','login','privatemsg','finder','browse','search','settings','logout','badge'])>=0) return B.fault('请从 http://fanfou.com/<i>screen_name</i> 页面进入');

B.microblog_site={
	t_site:'饭否',
	t_item:'消息',
	user:user,
	nickname:$('#panel h1').text(),
	fetchBio:function(){
		var vcard=$('#user_infos ul.vcard');
		B.feedData['microblog:bio']=$('#bio span').text();
		B.feedData['microblog:web']=vcard.find('a.url').attr('href');
		B.feedData['microblog:location']=vcard.find('li.adr .region').text();
		B.proceed();
	},
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
				id:id,
				updated:new Date(stampA.attr('stime')),
				title:$.trim(LI.find('.content').text()),
				'microblog:via':LI.find('.method').text()
			});
		});
		return T;
	}
};
