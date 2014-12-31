(function(B){
var $=B.$;//jQuery
var user,nickname,user_m=location.href.match(/diary\/\?uid=(\d+)/);
if (user_m) {
	user=user_m[1];
	nickname=(''+$('#r2_2 div.xcj41 b').text()).replace('的日记','');
	startLoad();
} else {
	if (location.href.match(/home\/status\.php$/)) {
		user_m=$('a:contains(我的首页)').attr('href').match(/uid=(\d+)/);
		user=user_m[1];
	} else {
		return B.fault('请从 http://www.kaixin001.com/diary/?uid=<i>用户ID</i> 页面进入');
	}
	B.getMyName(function(name){
		nickname=name;
		startLoad();
	});
}

function startLoad(){
B.load('?i=blog',function(){
	$.extend(B,{
		t_site:'开心网',
		user:user,
		nickname:nickname,
		t_entry:'日记',
		getPageUrl:function(pn,previous) {
			if (previous) {
				var A=previous.find('div.fy_p a:contains(下一页)');
				if (A.length>0) {
					return A.attr('href');
				} else return null;
			} else {
				if (pn==1) return '/diary/?uid='+B.user;
				else return '/diary/index.php?uid='+B.user+'&classid=0&start='+((pn-1)*10);
			}
		},
		getEntryList:function(page) {
			var T=[];
			page.find('#content div.rj_l_t').each(function(){
				var DIVl=$('div.l.c6',this),DIVm=$(this).next('div.rj_l_m');
				var A=DIVl.find('b a'),
					u=A.attr('href');
				u=u.charAt(0)=='/'?'http://www.kaixin001.com'+u:u;
				DIVl.find('b').remove();
				var dt=new Date(DIVl.text().replace('发表','').replace(/\-/g,'/'));
				T.push({
					id:u,
					'link/href':u,
					updated:dt,
					title:A.text(),
					'kaixin001:DIVm':DIVm
				});
			});
			return T;
		},
		getEntryContent:function(E,cb) {
			var DIV=E['kaixin001:DIVm'].find('> div:first');
			delete E['kaixin001:DIVm'];
			if (DIV.find('> a:contains(阅读全文...)').length==0) {
				E.content=DIV.html();
				E['content:type']='html';
				cb(true);
			} else {
				B.requestDIV(E.id,function(div){
					if (div===false) cb(false);
					E.content=div.find('div.rj_l_m > div:first').html();
					E['content:type']='html';
					cb(true);
				});
			}
		}
	});
});
}//end of startLoad

})(backuplet);