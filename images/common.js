function c(u)
{
	if (typeof(urchinTracker)=='function') urchinTracker(u);
}
var _uacct="UA-935676-1";
if (typeof(cc)=='undefined') { c(); }//先设置cc为需要统计的值或null可防止自动统计
else { if (cc!=null) c(cc); }
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
		if (DT[i].addArrow_done=='1') continue;
		DT[i].addArrow_done=='1';
		var h=DT[i].innerHTML;
		if (h!='&nbsp;' && h.length>1 && h.indexOf(arrow)<0)
			DT[i].innerHTML=arrow+h;
	}
}
addArrow();
