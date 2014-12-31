(function(B){
var $=B.$;//jQuery
var user_m=location.href.match(/^http:\/\/t.baidu.com\/([0-9]+)/);
if (!user_m) return B.fault('请从 http://t.baidu.com/<i>说吧号码</i> 页面进入');
var user=user_m[1];
var nameP=$('p.user-name');
nameP.find('a.tosay').remove();
var name=$.trim(nameP.text()).replace(/\([0-9]+\)$/,'');
var uid=0;
$.get('/'+user,function(h){
	var m=h.match(/baiduTalk\.phoneDialog\(this,([0-9]+)\)/);
	if (m) uid=m[1];
},'text');

B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'百度说吧',
		user:user,
		nickname:name,
		t_tweet:'消息',
		getPageUrl:function(pn,previous) {
			if (pn==1) return '{current-page}';
			else {
				if (uid==0) return null;
				if (pn==2 && $('#showbutton p.more').length==0) return null;
				if (pn>2 && previous.m_count<50) return null;
				return '&maxid='+((pn-1)*50)+'&uid='+uid+'&';
			}
		},
		getPage:function(u,cb) {
			if (u=='{current-page}') cb(B.fromCurrentPage());
			else B.requestJSON('/user/listmore?'+Math.random()+u,cb,'GET');
		},
		parseDate:function(s){
			var now=new Date();
			var m=s.match(/([0-9]+)秒前/);
			if (m) return new Date(now.getTime()-1000*m[1]);
			m=s.match(/([0-9]+)分钟前/);
			if (m) return new Date(now.getTime()-60000*m[1]);
			m=s.match(/今天[\s]*([0-9]{2}):([0-9]{2})/);
			if (m) return new Date(now.getFullYear(),now.getMonth(),now.getDate(),parseInt(m[1],10),parseInt(m[2],10));
			m=s.match(/昨天[\s]*([0-9]{2}):([0-9]{2})/);
			if (m) return new Date(new Date(now.getFullYear(),now.getMonth(),now.getDate(),parseInt(m[1],10),parseInt(m[2],10)).getTime()-86400000);
			m=s.match(/([0-9]{2})月([0-9]{2})日[\s]*([0-9]{2}):([0-9]{2})/);
			if (m) return new Date(now.getFullYear(),parseInt(m[1],10)-1,parseInt(m[2],10),parseInt(m[3],10),parseInt(m[4],10));
			return new Date(1970,0,1);
		},
		fromCurrentPage:function() {
			var T=[];
			$('#message_list td').each(function(){
				var TD=$(this);
				var u=TD.find('span.source a').attr('href');
				if (!u) return;
				var dt=B.parseDate(TD.find('span.source a').text());
				var via=TD.find('span.source').text().match(/来自([\S]+)/);
				T.push({
					id:u.indexOf('t.baidu')>=0?u:'http://t.baidu.com/'+u,
					title:TD.find('p.talk-words').text(),
					updated:dt,
					'microblog:via':via[1]
				});
				
			});
			return {
				from:'{current-page}',
				T:T
			};
		},
		getTweets:function(json) {
			if (json.from=='{current-page}') {
				return json.T;
			}
			if (json.m_list) {
				var T=[];
				$.each(json.m_list,function(key,t){
					T.push({
						id:'http://t.baidu.com/'+t.baidu_id+'/'+t.id,
						title:t.content,
						updated:B.parseDate(t.created_time),
						'microblog:via':t.source
					});
				});
				return T;
			}
			return [];
		}
	});
});
})(backuplet);