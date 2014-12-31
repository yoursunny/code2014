(function(B){
var $=B.$;//jQuery
var user,user_m=location.href.match(/t.sdo.com\/home\/([0-9]+)/);
if (user_m) user=user_m[1];
if (!user) return B.fault('请从 http://t.sdo.com/home/<i>user_id</i> 页面进入');

B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'糖果',
		user:user,
		nickname:$('div.avatarInfo > h2 > strong').text()||'',
		t_tweet:'推他',
		getPageUrl:function(pn,previous) {
			var query='filter=tuita&flag=1&user_id='+user;
			if (previous) {
				if (previous.last_dt) {
					return 'timestamp='+(previous.last_dt-1)+'&'+query;
				} else {
					return null;
				}
			} else {
				return query;
			}
		},
		getPage:function(u,cb) {
			B.requestJSON('/feed/getfeed',cb,'GET',u);
		},
		getTweets:function(json) {
			var UL=$('<ul>').html(json['data']);
			var T=[];
			UL.find('>li').each(function(){
				var LI=$(this);
				var objid=LI.attr('objid');
				var dt=parseInt(LI.attr('time'));
				json.last_dt=dt;
				var t={
					id:'#t.sdo.com_'+objid,
					updated:new Date(dt)
				};
				switch (LI.attr('acttype')) {
					case '1002005'://原创
						t.title=LI.find('#twitter_content_'+objid).text();
						break;
					case '1002007'://转推
						t.title=LI.find('#detail_'+objid+' >.font14 >span').text();
						var ztBox=LI.find('#detail_'+objid+' >.ztBox >.subItems');
						t.content=ztBox.find('>p:first').html();
						var IMG=ztBox.find('>div.feedpic:first img.imgBorder');
						if (IMG.length>0) {
							t.content+=$('<img>').attr('src',IMG.attr('src')).html();
						}
						t['content:type']='html';
						break;
					default:
						return;
				}
				t.title=$.trim(t.title);
				T.push(t);
			});
			return T;
		}
	});
});
})(backuplet);