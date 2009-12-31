//微博客
(function(B){
var $=B.$;//jQuery
$.extend(B,{
	t_site:'微博客',//网站名称
	user:'username',//用户名
	t_tweet:'状态',//对一次状态更新的称谓
	start:function(){
		B.status('选择备份范围');
		B.ui('<p>备份'+B.html(B.user)+'的'+B.t_tweet+'：</p>'
			+'<p>备份全部'+B.t_tweet+' <input type="button" value="开始" onclick="backuplet.start_all()"></p>'
			+'<p>备份近<input type="text" id="545c89bb-93b3-4afa-accb-862bb2f97069" value="7"/>天的'+B.t_tweet+' <input type="button" value="开始" onclick="backuplet.start_recent()"></p>'
			);
	},
	start_all:function(){
		B.tweetsAfter=new Date(1970,0,1);
		B.start_backup();
	},
	start_recent:function(){
		var recent=parseInt($('#545c89bb-93b3-4afa-accb-862bb2f97069').val(),10);
		if (isNaN(recent) || recent<=0) return alert('备份天数数字格式不正确');
		B.tweetsAfter=new Date(new Date().getTime()-86400000*recent);
		B.start_backup();
	},
	start_backup:function(){
		B.status('正在创建会话');
		B.s_start(B.fetchNextPage);
	},
	currentPage:0,
	thePage:null,
	tweets:[],
	fetchNextPage:function(){
		var u=B.getPageUrl(++B.currentPage,B.thePage);
		if (u==null) return B.end_backup();
		B.status('正在下载第'+B.currentPage+'页');
		B.getDIV(u,function(div){
			if (div===false) B.error('下载第'+B.currentPage+'页失败。');
			else {
				B.thePage=div;
				B.processPage();
			}
		});
	},
	processPage:function(){
		B.status('正在分析第'+B.currentPage+'页');
		var T=B.filterRecent(B.getTweets(B.thePage));
		if (T.length==0) return B.end_backup();
		$.merge(B.tweets,T);
		B.submitTweets(false,B.fetchNextPage);
	},
	filterRecent:function(T){
		var R=[];
		$.each(T,function(i,v){
			if (v.dt>=B.tweetsAfter) R.push(v);
		});
		return R;
	},
	submitTweets:function(force,cb){
		if ((force && B.tweets.length>0) || B.tweets.length>50) {
			B.status('正在保存数据');
			var b='';
			$.each(B.tweets,function(i,v){
				v.dt=(v.dt.getTime())/1000;
				b+=$.param(v)+'\n';
			});
			B.s_put(b,cb);
			B.tweets=[];
		} else {
			if (cb) cb();
		}
	},
	end_backup:function(){
		B.submitTweets(true,function(){
			B.status('备份完成');
			var u=B.base+'f-microblog.php?'+$.param({
				site:B.t_site,
				user:B.user,
				sid:B.sid
			});
			B.ui('<p>备份'+B.html(B.user)+'的'+B.t_tweet+'：已经完成</p>'
				+'<p><a href="'+B.html(u)+'" target="_blank">导出数据</a></p>'
				);
		});
	}
});
})(backuplet);