var yoursunny_url=location.href.toLowerCase();
function yoursunny_blogdate(s)
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
if (yoursunny_url.include('sunnypower')) {//阳光力量博客
	WebSite.caccount='UA-935676-6';
	Event.bindReady(function(){
		$$('.BloggerPostFooter a').each(function(ele){
			ele.innerHTML=yoursunny_blogdate(ele.innerHTML);
			new Insertion.After(ele,' 作者：<a href="http://m.yoursunny.com">阳光男孩</a>');
		});
		$$('.pside h2')[0].insert({after:'<p>中国国内用户，建议通过<a href="http://hi.baidu.com/yoursunny">百度</a>等国内发布点访问阳光力量博客</p>'});
	});
} else if (yoursunny_url.include('yoursunny.blogspot')) {//你的阳光好帖收藏
	WebSite.caccount='UA-935676-7';
	Event.bindReady(function(){
		$$('.BloggerPostFooter a').each(function(ele){
			ele.innerHTML=yoursunny_blogdate(ele.innerHTML);
			ele.insert({after:' 本文来源网络，著作权归原作者所有'});
		});
		$$('.pside')[0].insert({bottom:WebSite.getAd('160x600')});
	});
	if (typeof focusid != 'undefined') clearTimeout(focusid);
} else {
	WebSite.caccount='';
	WebSite.cauto=false;
}