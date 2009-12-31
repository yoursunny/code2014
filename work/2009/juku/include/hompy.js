//用户主页
(function(J){
var $=window.jQuery;

//在当前窗口打开其他用户主页
J.hompy_page_user=GLOBAL.page_user;
J.hompy_friend_box=$('div.friend_box').html();
J.hompy=function(uid,tab){
	setTimeout(function(){
		var filter=$('#filter_tab');
		var filter_tab_index=0;
		var createTab=function(key,text,hasCount,to_me) {
			var q=$('<li><a href="javascript:;"/></li>').attr('id','tab'+(++filter_tab_index)).addClass('tab'+filter_tab_index).addClass(key==tab?'on_tab':'off_tab').find('a').text(text).append(hasCount?'<span id="count_'+key+'_wall"/>':'').click(function(){
				if (to_me) J.hompy(null,to_me);
				else DisplayOptions.filterTimeline(key,this);
			}).end().appendTo(filter);
			if (tab==key) {
				DisplayOptions.filterTimeline(key,q.get(0));
			}
		};
		Walls.removeCurrentOpen();
		if (uid==null || uid==GLOBAL.session_user) {
			if (!tab) tab='all';
			$('div.friend_box').html(J.hompy_friend_box);
			GLOBAL.page_user=$.extend({},GLOBAL.session_user);
			TimeLine.reset();
			TimeLineCache.cache={};
			TimeLine.showLoading();
			filter.empty();
			createTab('all','所有消息',true);
			createTab('own','我的消息',true);
			createTab('private','私密消息',true);
			createTab('responded','我的回复',true);
		} else {
			if (!tab) tab='own';
			$('div.friend_box').load('/Hompy/Hompy.aspx?uid='+uid+' div.friend_box',function(){
				$('#divVisit').load('/Ajax/GetFriendAndVisit.aspx?active=visit2&uid='+uid+'&v='+Math.random());
				$('#divFriend').load('/Ajax/GetFriendAndVisit.aspx?active=friend2&uid='+uid+'&v='+Math.random());
				var name=$('#lblName2').text();
				GLOBAL.page_user={
					page_title:'',
					uid:uid,
					full_name:name,
					id:uid,
					display_name:name,
					location:$('#lblCity').text(),
					creature:1,
					last_wall:null,
					nick_name:name,
					gender:($('#lblSex').text()=='男')?1:0,
					icon:$('#photo_icon').attr('src'),
					level:parseInt($('#lblLevel').text())
				};
				TimeLine.reset();
				TimeLineCache.cache={};
				TimeLine.showLoading();
				filter.empty();
				createTab('my_all','我和好友',false,'all');
				createTab('my_own','我的消息',false,'own');
				createTab('own',name,true);
			});
		}
	},300);
};
$('a').live('click',function(){
	var a=$(this);
	var u=a.attr('href');
	if (!u) return;
	var m=u.match(/hompy.aspx\?uid=([0-9]+)$/i);
	var rewrite=function(url) { a.attr('href',url).removeAttr('target'); };
	if (m) return rewrite('javascript:yoursunnyJukuHelper.hompy('+m[1]+');');
	m=u.match(/hompy\/(?:default.aspx)?$/i);
	if (m) return rewrite('javascript:yoursunnyJukuHelper.hompy(null);');
});

})(yoursunnyJukuHelper);