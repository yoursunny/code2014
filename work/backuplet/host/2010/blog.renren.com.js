(function(B){
var $=B.$;//jQuery
var user_m=location.href.match(/blog\/(\d+)\/friends/i),user,isMe=false;
if (user_m) {
	user=user_m[1];
} else {
	user_m=location.href.match(/blog\/0/i);
	if (user_m) {
		user=String(wpiMenuInfo.user.id);
		isMe=true;
	} else {
		return B.fault('请从 http://blog.renren.com/blog/<i>用户ID</i>/friends 或 http://blog.renren.com/blog/0 页面进入');
	}
}
$('div[id^=ad]').hide();
B.load('?i=blog',function(){
	$.extend(B,{
		t_site:'人人网',
		user:user,
		nickname:$('#my_panel li:first h3 a').text(),
		userIsMe:isMe,
		t_entry:'日志',
		getPageUrl:function(pn,previous) {
			if (previous) {
				var A=previous.find('div.pager-top a[title="下一页"]');
				if (A.length>0) {
					return A.attr('href');
				} else return null;
			} else {
				if (pn==1) return B.userIsMe?'/blog/0':'/blog/'+B.user+'/friends';
				else return B.userIsMe?'/blog/0?curpage='+(pn-1)+'&year=0&month=0&selitem=':'/blog/'+B.user+'/friends?curpage='+(pn-1)+'&year=0&month=0&selitem=';
			}
		},
		getEntryList:function(page) {
			var T=[];
			page.find('div.list-blog h3.title-article').each(function(){
				var H3=$(this);
				var A_title=H3.find('strong a:first');
				var u=A_title.attr('href');
				var title=A_title.text();
				var dt=H3.find('span.timestamp').text().match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
				dt=new Date(parseInt(dt[1],10),parseInt(dt[2],10)-1,parseInt(dt[3],10),parseInt(dt[4],10),parseInt(dt[5],10));
				var cate=[];
				H3.find('span.group a').each(function(){
					cate.push($(this).text());
				});
				T.push({
					id:u,
					'link/href':u,
					updated:dt,
					title:title,
					cate:cate
				});
			});
			return T;
		},
		getEntryContent:function(E,cb) {
			B.requestDIV(E.id,function(div){
				if (div===false) cb(false);
				E.content=div.find('#blogContent').html();
				E['content:type']='html';
				cb(true);
			});
		}
	});
});
})(backuplet);