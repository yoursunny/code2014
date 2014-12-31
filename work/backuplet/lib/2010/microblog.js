//微博客
(function(B){
var $=B.$;//jQuery
$.extend(B,{
	t_site:'微博客',//网站名称
	user:'username',//用户名
	nickname:'nickname',//昵称
	t_tweet:'状态',//对一次状态更新的称谓
	s_bufsize:80,
	main:function(){
		B.status('选择备份范围');
		B.html('<p>备份'+B.encode(B.user)+'的'+B.t_tweet+'：</p>'
			+'<form action="" onsubmit="backuplet.start();return false;"><div>'
			+'<p>时间范围： <label><input type="radio" name="time" checked="checked" value="all"/>全部</label> <label><input type="radio" name="time" value="recent"/>最近</label><input type="text" name="recent" value="15"/>天</p>'
			+'<p><label><input type="checkbox" name="skipAtReplies"/>忽略@开头的'+B.t_tweet+'</label></p>'
			+'<p><input type="submit" value="开始备份"/></p>'
			+'</div></form>'
			);
	},
	start:function(){
		var timeRange=B.container.find(':radio[name=time]:checked').val();
		if (timeRange=='recent') {
			var recent=parseInt(B.container.find(':text[name=recent]').val(),10);
			if (isNaN(recent) || recent<=0) return alert('备份天数数字格式不正确');
			B.tweetsAfter=new Date(new Date().getTime()-86400000*recent);
		} else {
			B.tweetsAfter=new Date(1970,0,1);
		}
		B.skipAtReplies=B.container.find(':checkbox[name=skipAtReplies]').is(':checked');
		var feedData={
			'title':B.t_site+'/'+B.user+' '+B.nickname,
			'author/name':B.user,
			'microblog:':1
		};
		B.s_start(feedData,B.fetchNextPage);
	},
	currentPage:0,
	thePage:null,
	fetchNextPage:function(){
		var u=B.getPageUrl(++B.currentPage,B.thePage);
		if (u==null) return B.finished();
		B.status('正在下载第'+B.currentPage+'页');
		B.getNextPage(u);
	},
	getNextPage:function(u){
		B.getPage(u,function(data){
			if (data===false) B.fault('下载第'+B.currentPage+'页失败。');
			else {
				B.thePage=data;
				B.processPage();
			}
		});
	},
	getPage:B.requestDIV,
	processPage:function(){
		B.status('正在处理第'+B.currentPage+'页');
		var T=B.getTweets(B.thePage);
		var Tlen1=T.length;
		if (Tlen1==0) return B.finished();
		T=B.filterRecent(T);
		var Tlen2=T.length;
		T=B.filterContent(T);
		B.s_puts(T,(Tlen1>Tlen2)?B.finished:B.fetchNextPage);
	},
	filterRecent:function(T){
		var R=[];
		$.each(T,function(i,v){
			if (v.updated>=B.tweetsAfter) R.push(v);
		});
		return R;
	},
	filterContent:function(T){
		var R=[];
		$.each(T,function(i,v){
			if (B.skipAtReplies && v.title.charAt(0)=='@') return;
			R.push(v);
		});
		return R;
	}
});
})(backuplet);