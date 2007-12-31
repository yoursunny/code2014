function copyright()
{
	var d=document.getElementById('copyright');
	if (!d) return;
	d.innerHTML='&copy;2006-'+new Date().getFullYear()+', yoursunny.com &nbsp; 版权协议:<a href="http://creativecommons.org/licenses/by-nc/3.0/deed.zh" onclick="c(\'/h/copyright-deed\')">CreativeCommons BY-NC 3.0</a>'+d.innerHTML+'<br/>&nbsp;';
}
copyright();
function addArrow()
{
	var arrow='<span class="arrow">&gt;</span>';
	var DT=document.getElementsByTagName('dt');
	for (var i=0;i<DT.length;++i)
	{
		DT[i].innerHTML=arrow+DT[i].innerHTML;
	}
}
addArrow();

//隐藏Blogger NavBar
{
	var F=document.getElementsByTagName('iframe');
	if (F.length>0) F[0].style.display='none';
}

//统计
{
	document.write('<script src="http://www.google-analytics.com/urchin.js" type="text/javascript"></script>');
	window.onload=function() {
		var l=location.href.toLowerCase();
		_uacct=l.indexOf('sunnypower.blogspot.com')>=0?'UA-935676-6':(l.indexOf('your.xinwen520.com')>=0?'UA-935676-7':'');
		urchinTracker();
	};
}