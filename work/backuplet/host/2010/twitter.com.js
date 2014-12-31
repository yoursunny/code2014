(function(B){
var $=B.$;//jQuery
var user,user_m=location.href.match(/twitter.com\/([^\/\?]+)/);
if (user_m) user=user_m[1];
if (!user || $.inArray(user,['home','invitations','settings','help','logout','following','followers','replies','inbox','favorites','retweets_by_others','search','statuses','about','goodies','jobs','tos','privacy'])>=0) return B.fault('请从 http://twitter.com/<i>screen_name</i> 页面进入');

B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'Twitter',
		user:user,
		nickname:$('ul.about.vcard .fn').text()||'',
		t_tweet:'推',
		getPageUrl:function(pn,previous) {
			if (previous) {
				if (previous['#pagination']) {
					var pagination_m=previous['#pagination'].match(/max\_id=(\d+)/);
					return 'max_id='+pagination_m[1]+'&page='+pn+'&twttr=true';
				} else {
					return null;
				}
			} else {
				return '';
			}
		},
		getPage:function(u,cb) {
			u+='&authenticity_token='+twttr.form_authenticity_token;
			var beforeSend=function(xhr){
				xhr.setRequestHeader('Accept','application/json');
			};
			B.requestJSON('/'+user,cb,'GET',u,beforeSend);
		},
		getTweets:function(json) {
			var timeline=$('<div>').html(json['#timeline']);
			var T=[];
			timeline.find('li.status').each(function(){
				var LI=$(this);
				var u=LI.find('a.entry-date').attr('href');
				var dt=new Date(eval('('+LI.find('span.published.timestamp').attr('data')+')')['time']);
				var via=LI.find('span.entry-meta span').text().match(/via (\S+)/);
				T.push({
					id:u,
					updated:dt,
					title:$.trim(LI.find('span.entry-content').text()),
					'microblog:via':via?via[1]:''
				});
			});
			return T;
		}
	});
});
})(backuplet);