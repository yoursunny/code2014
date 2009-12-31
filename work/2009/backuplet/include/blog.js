//博客
(function(B){
var $=B.$;//jQuery
$.extend(B,{
	t_site:'博客',//网站名称
	user:'username',//用户名
	t_entry:'日志',//对一篇日志的称谓
	start:function(){
		B.status('选择备份范围');
		B.ui('<p>备份'+B.html(B.user)+'的'+B.t_entry+'：</p>'
			+'<p>备份全部'+B.t_entry+' <input type="button" value="开始" onclick="backuplet.start_all()"></p>'
			+'<p>备份近<input type="text" id="c159af18-e205-4e45-a4f3-813503d3a495" value="30"/>天的'+B.t_entry+' <input type="button" value="开始" onclick="backuplet.start_recent()"></p>'
			);
	},
	start_all:function(){
		B.entriesAfter=new Date(1970,0,1);
		B.start_backup();
	},
	start_recent:function(){
		var recent=parseInt($('#c159af18-e205-4e45-a4f3-813503d3a495').val(),10);
		if (isNaN(recent) || recent<=0) return alert('备份天数数字格式不正确');
		B.entriesAfter=new Date(new Date().getTime()-86400000*recent);
		B.start_backup();
	},
	start_backup:function(){
		B.status('正在创建会话');
		B.s_start(B.fetchNextPage);
	},
	currentPage:0,
	thePage:null,
	fetchNextPage:function(){
		var u=B.getPageUrl(++B.currentPage,B.thePage);
		if (u==null) return B.end_backup();
		B.status('正在下载第'+B.currentPage+'页目录');
		B.getDIV(u,function(div){
			if (div===false) B.error('下载第'+B.currentPage+'页目录失败。');
			else {
				B.thePage=div;
				B.processPage();
			}
		});
	},
	fetchEntries:[],
	entries:[],
	processPage:function(){
		B.status('正在分析第'+B.currentPage+'页目录');
		var T=B.filterRecent(B.getEntryList(B.thePage));
		if (T.length==0) return B.end_backup();
		B.fetchEntries=T;
		B.entries=[];
		B.fetchNextEntry();
	},
	filterRecent:function(T){
		var R=[];
		$.each(T,function(i,v){
			if (v.dt>=B.entriesAfter) R.push(v);
		});
		return R;
	},
	fetchNextEntry:function(){
		if (B.fetchEntries.length==0) {
			B.submitEntries(B.fetchNextPage);
			return;
		}
		var E=B.fetchEntries.shift();
		B.status('正在下载'+B.t_entry+'：'+E.t);
		B.getEntryContent(E,B.thePage,function(success){
			if (success) {
				B.entries.push(E);
				B.fetchNextEntry();
			}
			else B.error('下载'+B.t_entry+'失败：'+E.t);
		});
	},
	submitEntries:function(cb){
		B.status('正在保存数据');
		var b='';
		$.each(B.entries,function(i,v){
			v.dt=(v.dt.getTime())/1000;
			v.cate=v.cate.join('|');
			v.isHTML=v.isHTML?1:0;
			b+=$.param(v)+'\n';
		});
		B.s_put(b,cb);
	},
	end_backup:function(){
		B.status('备份完成');
		var u=B.base+'f-blog.php?'+$.param({
			site:B.t_site,
			user:B.user,
			sid:B.sid
		});
		B.ui('<p>备份'+B.html(B.user)+'的'+B.t_entry+'：已经完成</p>'
			+'<p><a href="'+B.html(u)+'" target="_blank">导出数据</a></p>'
			);
	}
});
})(backuplet);