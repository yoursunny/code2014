(function(){

var url=location.href.toLowerCase();
function blogdate(s)
{
	//s的格式 2/14/2008 05:10:00 PM
	var a=s.strip().split(' ');
	if (a.length<3) return s;
	var b=a[0].split('/');
	if (b.length!=3) return s;
	var c=a[1].split(':');
	if (c.length!=3) return s;
	var d=a[2].strip().toLowerCase().charAt(0);
	if (d!='a'&&d!='p') return s;
	return parseInt(b[2],10).toPaddedString(4,10)+'-'+parseInt(b[0],10).toPaddedString(2,10)
		+'-'+parseInt(b[1],10).toPaddedString(2,10)+' '+(parseInt(c[0],10)+(d=='a'?0:12)).toPaddedString(2,10)
		+':'+parseInt(c[1],10).toPaddedString(2,10);
}
WebSite.bannerAd=false;
WebSite.caccount='';
WebSite.cauto=false;
if (url.include('sunnypower')) {//阳光力量博客
	WebSite.caccount='UA-935676-6';
	Event.bindReady(function(){
		$$('.BloggerPostFooter a').each(function(ele){
			ele.update(blogdate(ele.innerHTML))
				.insert({after:' 作者：<a href="http://m.yoursunny.com">阳光男孩</a>'});
		});
		c();
	});
} else if (url.include('threads')) {//你的阳光好帖收藏
	WebSite.caccount='UA-935676-7';
	Event.bindReady(function(){
		$$('.BloggerPostFooter a').each(function(ele){
			ele.update(blogdate(ele.innerHTML))
				.insert({after:' 本文来源网络，著作权归原作者所有'});
		});
		c();
	});
}

})();