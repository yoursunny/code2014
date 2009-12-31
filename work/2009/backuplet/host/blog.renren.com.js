(function(B){
var $=B.$;//jQuery
var user_m=location.href.match(/GetBlog.*id=(\d+)/i),user,isMe=false;
if (user_m) {
	user=user_m[1];
} else {
	user_m=location.href.match(/MyBlog/i);
	if (user_m) {
		user=String(wpiMenuInfo.user.id);
		isMe=true;
	} else {
		return B.error('请从 http://blog.renren.com/GetBlog.do?id=<i>用户ID</i> 页面进入');
	}
}
$('#wpiroot').css('z-index',50);
$('div[id^=ad]').hide();
B.load('?i=blog',function(){
	$.extend(B,{
		t_site:'人人网',
		user:user,
		userIsMe:isMe,
		t_entry:'日志',
		getPageUrl:function(pn,previous) {
			if (previous) {
				var A=previous.find('div.pager-top a[title="下一页"]');
				if (A.length>0) {
					return A.attr('href');
				} else return null;
			} else {
				if (pn==1) return B.userIsMe?'/MyBlog.do':'/GetBlog.do?id='+B.user;
				else return B.userIsMe?'/MyBlog.do?curpage='+(pn-1)+'&year=0&month=0&selitem=':'/GetBlog.do?curpage='+(pn-1)+'&id='+B.user+'&year=0&month=0&selitem=';
			}
		},
		getEntryList:function(page) {
			var T=[];
			page.find('div.list-blog h3.title-article').each(function(){
				var H3=$(this);
				var A_title=H3.find('strong a');
				var u=A_title.attr('href');
				var title=A_title.text();
				var dt=H3.find('span.timestamp').text().match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
				dt=new Date(parseInt(dt[1],10),parseInt(dt[2],10)-1,parseInt(dt[3],10),parseInt(dt[4],10),parseInt(dt[5],10));
				var cate=[];
				H3.find('span.group a').each(function(){
					cate.push($(this).text());
				});
				T.push({
					u:u,
					dt:dt,
					t:title,
					cate:cate
				});
			});
			return T;
		},
		getEntryContent:function(entry,page,cb) {
			B.getDIV(entry.u,function(div){
				if (div===false) cb(false);
				entry.content=div.find('#blogContent').html();
				entry.isHTML=true;
				cb(true);
			});
		}
	});
});
})(backuplet);