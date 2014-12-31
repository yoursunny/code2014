(function(B){
var $=B.$;//jQuery
var user,user_m=location.href.match(/t.qq.com\/([^\/\?]+)/);
if (user_m) user=user_m[1];
if (!user || $.inArray(user,['p','people','settting','invite'])>=0 || user.indexOf('.php')>=0) return B.fault('请从 http://t.qq.com/<i>screen_name</i> 页面进入');

B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'腾讯微博',
		user:user,
		nickname:$('#LUI li.detail span.userName').text()||'',
		t_tweet:'广播',
		getPageUrl:function(pn,previous) {
			var now=new Date();
			if (previous) {
				if (previous.info.hasNext==1) {
					var talk=previous.info.talk;
					if (talk.length==0) return null;
					var talk_last=talk[talk.length-1]
					return 'r='+now.getTime()
						+'&time='+talk_last.timestamp
						+'&id='+talk_last.id
						+'&u='+user;
				} else {
					return null;
				}
			} else {
				return 'r='+now.getTime()
					+'&time='+Math.floor(now.getTime()/1000)
					+'&u='+user;
			}
		},
		getPage:function(u,cb) {
			B.requestJSON('/asyn/index.php',cb,'GET',u);
		},
		getTweets:function(json) {
			if (json.result!==0) return [];//失败
			return $.map(json.info.talk,function(talk){
				var T={
					id:'#t.qq.com_'+talk.id,
					updated:new Date(talk.timestamp*1000),
					title:$('<div>').html(talk.content).text(),
					'microblog:via':talk.from,
					content:'',
					'tqq:type':talk.type//1=广播,2=转播,4=对…说
				};
				if (talk.type==4 && talk.source) {
					T.title='对'+talk.source.name+'说  '+T.title;
				}
				if (talk.type==2 && talk.source) {
					$.extend(T,{
						'retweet/id':'#t.qq.com_'+talk.id+'_source',//腾讯微博不返回原始广播的id
						'retweet/updated':new Date(talk.source.timestamp*1000),
						'retweet/title':$('<div>').html(talk.source.content).text(),
						'retweet/author/name':talk.source.name
					});
					T.content+='转播 <a href="http://t.qq.com/"'+talk.source.name+'">'+B.encode(talk.source.nick)+'</a><br/>'+B.encode(T['retweet/title'])+'<br/>';
				}
				if (T.title=='') T.title='(无内容)';
				if (talk.image.length>0) {
					$.each(talk.image,function(){
						T.content+='<img src="'+String(this)+'" alt="广播图片"/><br/>'
					});
				}
				if (T.content=='') delete T['content'];
				else T['content:type']='html';
				return T;
			});
		},
		filterContent:function(T){
			var R=[];
			$.each(T,function(i,v){
				if (B.skipAtReplies && v['tqq:type']==4) return;
				R.push(v);
			});
			return R;
		}
	});
});
})(backuplet);