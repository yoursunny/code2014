
B.microblog_init=function(){
	$.extend(B,B.microblog_site);
	B.proceed();
};

B.microblog_main=function(){
	B.ui_show();
	B.ui_status('选择备份范围');
	B.container.html('<p>备份'+B.encode(B.user)+'的'+B.t_item+'：</p>'
		+'<form action=""><div>'
		+'<p>时间范围： <label><input type="radio" name="time" checked="checked" value="all"/>全部</label> <label><input type="radio" name="time" value="recent"/>最近</label><input type="text" name="recent" value="15"/>天</p>'
		+B.filterConfigs
		+'<p><input type="submit" value="开始备份"/></p>'
		+'</div></form>'
		);
	B.container.find(':text[name=recent]').click(function(){
		B.container.find(':radio[name=time]').val(['recent']);
	});
	B.container.find('form').submit(function(){
		B.start();
		return false;
	});
};
B.main=B.microblog_main;
B.filterConfigs='';

B.start=function(){
	var timeRange=B.container.find(':radio[name=time]:checked').val();
	if (timeRange=='recent') {
		var recent=parseInt(B.container.find(':text[name=recent]').val(),10);
		if (isNaN(recent) || recent<=0) return alert('备份天数数字格式不正确');
		B.tweetsAfter=new Date(new Date().getTime()-86400000*recent);
	} else {
		B.tweetsAfter=new Date(1970,0,1);
	}
	B.collectFilter();
	B.feedData={
		'title':B.t_site+'/'+B.user+' '+B.nickname,
		'author/name':B.user,
		'microblog:':1
	};
	B.Q.push(['fetchBio'],['startSession'],['firstPage'],['s_send'],['ui_finished']);
	B.proceed();
};
B.collectFilter=function(){};

B.fetchBio=B.proceed;

B.startSession=function(){
	B.s_start(B.feedData);
};

B.s_bufsize=80;
B.currentPage=0;//current page number, 1-based
B.thePage=null;//current page JSON or DIV

B.nextPage=function(){
	var u=B.getPageUrl(++B.currentPage,B.thePage);
	B.log({nextPage:u});
	if (u==null) return B.proceed();
	B.ui_status('正在下载第'+B.currentPage+'页');
	B.getPage(u);
};
B.firstPage=B.nextPage;
B.requestPage=B.requestDIV;
B.getPage=function(u){
	B.requestPage(u,function(data){
		if (data===false) B.fault('下载第'+B.currentPage+'页失败。');
		else {
			B.thePage=data;
			B.processPage();
		}
	});
};
B.processPage=function(){
	B.ui_status('正在处理第'+B.currentPage+'页');
	var T=B.getTweets(B.thePage);
	B.processTweets(T);
};
B.processTweets=function(T){
	var Tlen1=T.length;
	if (Tlen1==0) return B.proceed();
	T=$.grep(T,B.filterRecent);
	var Tlen2=T.length;
	T=$.grep(T,B.filterContent);
	if (Tlen2==Tlen1) B.Q.unshift(['nextPage']);
	$.each(T,function(i,entry){
		entry.id=B.transformId(entry.id);
	});
	B.s_puts(T);
};

B.filterRecent=function(item){
	return item.updated>=B.tweetsAfter;
};
B.filterContent=B.filterContent||function(T){return true;};
B.transformId=function(id){
	if (id.charAt(0)=='/') return location.protocol+'//'+location.host+id;
	return id;
};


B.Q.push(['microblog_init'],['main']);
