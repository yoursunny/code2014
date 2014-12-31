/*#include microblog*/

var user,user_m=location.href.match(/twitter.com\/([^#\/\?\.]+)/);
if (user_m) user=user_m[1];
if (!user || $.inArray(user,['search','suggestions','search','searches','session','replies','favorites','inbox','sent'])>=0) return B.fault('请从 http://mobile.twitter.com/<i>screen_name</i> 页面进入');

var parseDate=function(s){
	var now=new Date().getTime();
	s=$.trim(s);
	if (/less than a minute/.test(s)) return new Date(now);
	var m=s.match(/([0-9]{1,2}) minute[s]? ago/);
	if (m) return new Date(now-60000*parseInt(m[1]));
	m=s.match(/([0-9]{1,2}) hour[s]? ago/);
	if (m) return new Date(now-3600000*parseInt(m[1]));
	m=s.match(/([0-9]{1,2}) day[s]? ago/);
	if (m) return new Date(now-86400000*parseInt(m[1]));
	m=s.match(/([0-9]{1,2}) month[s]? ago/);
	if (m) return new Date(now-2629800000*parseInt(m[1]));
	m=s.match(/([0-9]{1,2}) year[s]? ago/);
	if (m) return new Date(now-31557600000*parseInt(m[1]));
	return new Date(0);
};

B.microblog_site={
	t_site:'Twitter',
	t_item:'推',
	user:user,
	nickname:$('div.user-screen-name').clone()
		.find('strong').remove().end()
		.text().replace(/(?:^\s*\()|(?:\)\s*$)/g,''),
	fetchBio:function(){
		B.requestDIV('/'+user+'/about',function(ABOUT){
			var listTweet=ABOUT.find('div.list-tweet');
			var findBio=function(label) {
				var B=listTweet.find('b:contains('+label+')');
				if (B.length<1) return '';
				var P=B.parent().clone();
				P.find('b').remove();
				return $.trim(P.text());
			};
			B.feedData['microblog:bio']=findBio('Bio:');
			B.feedData['microblog:web']=findBio('Web:');
			B.feedData['microblog:location']=findBio('Location:');
			B.proceed();
		});
	},
	getPageUrl:function(pn,previous) {
		if (previous) {
			var moreLink=previous.find('#more_link');
			if (moreLink.length<1) return null;
			return moreLink.attr('href');
		} else {
			if (pn==1) {
				return 'http://mobile.twitter.com/'+user;
			}
			else return null;
		}
	},
	getTweets:function(page) {
		var T=[];
		page.find('#tweets-list .list-tweet').each(function(){
			var Tweet=$(this);
			T.push({
				id:Tweet.attr('id').replace('tweet_','http://twitter.com/#!/'+user+'/status/'),
				updated:parseDate(Tweet.find('.status_link').text()),
				title:$.trim(Tweet.find('.status').text()),
				'microblog:via':''
			});
		});
		return T;
	}
};
