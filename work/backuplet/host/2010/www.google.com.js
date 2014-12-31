(function(B){
var $=B.$;//jQuery
if (location.protocol=='https:') return B.fault('请从 http://www.google.com/profiles/<i>userId</i> 页面进入，不要使用https');
var user,user_m=location.href.match(/www.google.com\/profiles\/([^\/\?#]+)/);
if (user_m) user=user_m[1];
if (!user) return B.fault('请从 http://www.google.com/profiles/<i>userId</i> 页面进入');

B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'Buzz',
		user:user,
		nickname:$('#id .fn').text()||'',
		t_tweet:'activity',
		getPageUrl:function(pn,previous) {
			if (previous) {
				var next=previous.links.next;
				if ($.isArray(next)) {
					return next[0].href;
				} else if ($.isPlainObject(next)) {
					return next.href;
				} else {
					return null;
				}
			} else {
				return 'https://www.googleapis.com/buzz/v1/activities/'+user+'/@public?alt=json';
			}
		},
		getPage:function(u,cb) {
			$.ajax({
				dataType:'jsonp',
				scriptCharset:'utf-8',
				success:function(json){
					if (json.data) cb(json.data);
					else cb(false);
				},
				url:u
			});
		},
		getTweets:function(json) {
			return $.map(json.items,function(item){
				return {
					id:item.id,
					updated:new Date(item.updated),
					title:item.title,
					'microblog:via':item.source.title
				};
			});
		}
	});
});
})(backuplet);