//博客
(function(B){
var $=B.$;//jQuery
$.extend(B,{
	t_site:'博客',//网站名称
	user:'username',//用户名
	nickname:'nickname',//昵称
	t_entry:'日志',//对一篇日志的称谓
	supportsPagesRange:true,
	main:function(){
		B.status('选择备份范围');
		B.html('<p>备份'+B.encode(B.user)+'的'+B.t_entry+'：</p>'
			+'<form action="" onsubmit="backuplet.start();return false;"><div>'
			+(B.supportsPagesRange?'<p>页数范围： <label><input type="radio" name="pages" checked="checked" value="all"/>全部</label> <label><input type="radio" name="pages" value="ranged"/>范围</label><input type="text" name="page_from" value="1"/>~<input type="text" name="page_to" value="999"/></p>':'')
			+'<p>时间范围： <label><input type="radio" name="time" checked="checked" value="all"/>全部</label> <label><input type="radio" name="time" value="recent"/>最近</label><input type="text" name="recent" value="15"/>天<br/></p>'
			+'<p><label><input type="checkbox" name="skipReprint"/>忽略转载的'+B.t_entry+'</label> （标题包含下列词汇的视为转载：转|转载|转帖|转贴|zz|zt|rt）</p>'
			+'<p><input type="submit" value="开始备份"/></p>'
			+'</div></form>'
			);
	},
	start:function(){
		if (B.supportsPagesRange) {
			var pagesRange=B.container.find(':radio[name=pages]:checked').val();
			if (pagesRange=='ranged') {
				var page_from=parseInt(B.container.find(':text[name=page_from]').val(),10),
					page_to=parseInt(B.container.find(':text[name=page_to]').val(),10);
				if (isNaN(page_from) || isNaN(page_to) || page_from<=0 || page_to<page_from) return alert('页数范围数字格式不正确，或终止页小于起始页');
				B.pagesRange=[page_from,page_to];
			} else {
				B.pagesRange=[1,Number.MAX_VALUE];
			}
		} else {
			B.pagesRange=[1,Number.MAX_VALUE];
		}
		var timeRange=B.container.find(':radio[name=time]:checked').val();
		if (timeRange=='recent') {
			var recent=parseInt(B.container.find(':text[name=recent]').val(),10);
			if (isNaN(recent) || recent<=0) return alert('备份天数数字格式不正确');
			B.entriesAfter=new Date(new Date().getTime()-86400000*recent);
		} else {
			B.entriesAfter=new Date(1970,0,1);
		}
		B.skipReprint=B.container.find(':checkbox[name=skipReprint]').is(':checked');
		B.currentPage=B.pagesRange[0]-1;
		var feedData={
			'title':B.t_site+'/'+B.user+' '+B.nickname,
			'author/name':B.user,
			'blog:':1
		};
		B.s_start(feedData,B.fetchNextPage);
	},
	currentPage:0,
	thePage:null,
	fetchNextPage:function(){
		if (B.datePassed || B.currentPage>=B.pagesRange[1]) return B.finished();
		var u=B.getPageUrl(++B.currentPage,B.thePage);
		if (u==null) return B.finished();
		B.status('正在下载第'+B.currentPage+'页目录');
		B.getListPage(u,function(data){
			if (data===false) B.fault('下载第'+B.currentPage+'页目录失败。');
			else {
				B.thePage=data;
				B.processPage();
			}
		});
	},
	getListPage:B.requestDIV,
	fetchEntries:[],
	processPage:function(){
		B.status('正在分析第'+B.currentPage+'页目录');
		var T=B.getEntryList(B.thePage);
		var Tlen1=T.length;
		if (Tlen1==0) return B.finished();
		T=B.filterRecent(T);
		var Tlen2=T.length;
		if (Tlen1>Tlen2) B.datePassed=true;
		T=B.filterListContent(T);
		B.fetchEntries=T;
		B.fetchNextEntry();
	},
	filterRecent:function(T){
		var R=[];
		$.each(T,function(i,v){
			if (v.updated>=B.entriesAfter) R.push(v);
		});
		return R;
	},
	filterListContent:function(T){
		var R=[];
		$.each(T,function(i,v){
			if (B.skipReprint && /(?:转|转载|转帖|转贴|zz|zt|rt)/.test(v.title)) return;
			R.push(v);
		});
		return R;
	},
	fetchNextEntry:function(){
		if (B.fetchEntries.length==0) return B.fetchNextPage();
		var E=B.fetchEntries.shift();
		B.status('正在下载'+B.t_entry+'：'+E.title);
		B.getEntryContent(E,function(success){
			if (success) {
				B.s_put(E,B.fetchNextEntry);
			}
			else B.fault('下载'+B.t_entry+'失败：'+E.title);
		});
	}
});
})(backuplet);