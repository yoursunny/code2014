(function(B){
var $=B.$;//jQuery
$(document).scrollTop($('body > div.wall_form').position().top);
B.load('?i=microblog',function(){
	$.extend(B,{
		t_site:'聚酷',
		user:''+SETTINGS.user_id,
		t_tweet:'消息',
		fetchNextPage:function(){
			var u=B.getPageUrl(++B.currentPage,B.thePage);
			if (u==null) return B.end_backup();
			B.status('正在下载第'+B.currentPage+'页');
			var data={'own_only':'2','user_id':B.user};
			if (B.mclub_offset) {
				var pad2=function(s){s=''+s;return(s.length==1)?'0'+s:s;};
				data['offset']='"'+B.mclub_offset.getFullYear()+'-'+pad2(B.mclub_offset.getMonth()+1)+'-'+pad2(B.mclub_offset.getDate())+'T'+pad2(B.mclub_offset.getHours())+':'+pad2(B.mclub_offset.getMinutes())+':'+pad2(B.mclub_offset.getSeconds())+'"';
			}
			$.ajax({
				cache:true,
				data:data,
				dataType:'text',
				error:function(){
					B.error('下载第'+B.currentPage+'页失败。');
				},
				success:function(data){
					B.thePage=eval(data);//actually, json data
					B.processPage();
				},
				type:'POST',
				url:'/Ajax/GetWalls.aspx?v='+Math.random()
			});
		},
		getPageUrl:function(pn,previous) {
			if (previous) {
				B.mclub_offset=previous[previous.length-1].posted;
				return 'next-page';
			} else {
				if (pn==1) {
					B.mclub_offset=false;
					return 'first-page';
				} else return null;
			}
		},
		getTweets:function(page) {
			return $.map(page,function(o){
				return {
					u:'#'+o.id,
					dt:o.posted,
					t:o.content_raw.replace(/\<[^>]*\>/g,''),
					via:''
				};
			});
		}
	});
});
})(backuplet);