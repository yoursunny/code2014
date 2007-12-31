function h(v)
{
	c('/h/'+v);
}
function toggle(show,hide)
{
	var d=hide.split('|');
	for (var i=0;i<d.length;++i)
		document.getElementById(d[i]).style.display='none';
	d=show.split('|');
	for (var i=0;i<d.length;++i)
		document.getElementById(d[i]).style.display='block';
	h('toggle-'+d[0]);
}
var songplaying=false;
var songtimer=null;
function songinit(step)
{
	var p=document.getElementById('songplayer');
	if (p==null) return;
	if (step==1)
	{
		var uri=document.getElementById('songuri').innerHTML;
		p.SetVariable('url',uri);
		p.SetVariable('cmd','load');
		setTimeout('songinit(2)',1000);
	}
	else
	{
		p.SetVariable('cmd','play');
		songplaying=true;
		songtimer=setInterval('songtime()',100);
	}
}
songinit(1);
function songcontrol()
{
	var t=document.getElementById('songtitle').innerHTML+' '+document.getElementById('songartist').innerHTML;
	var p=document.getElementById('songplayer');
	if (p==null) return;
	p.SetVariable('cmd','pause');
}
function songtime()
{
	var p=document.getElementById('songplayer');
	if (p==null) return;
	var t=p.GetVariable('t');
	if (typeof(t)=='undefined' || t==NaN || t<=0) return;
	var minute=Math.floor(t/60);
	var second=String(Math.floor(t%60));
	if (second.length<2) second='0'+second;
	document.getElementById('songtime').innerHTML=minute+':'+second;
}
function songvote(v)
{
	var t=document.getElementById('songtitle').innerHTML+' '+document.getElementById('songartist').innerHTML;
	h('song/'+t+'-v'+v);
	alert('谢谢反馈');
}
function songvotetip(m)
{
	if (m==null) m='&nbsp;';
	document.getElementById('songvotetip').innerHTML=m;
}
function songdown()
{
	var t=document.getElementById('songtitle').innerHTML+' '+document.getElementById('songartist').innerHTML;
	h('song/'+t+'-search');
	window.open('http://d.sogou.com/music.so?query='+escape(t));
}
function song_complete()
{
	var t=document.getElementById('songtitle').innerHTML+' '+document.getElementById('songartist').innerHTML;
	h('song/'+t+'-complete');
}
String.prototype.escapeHTML=function() { return this.replace('<','&lt;').replace('>','&gt;').replace('&','&amp;'); };
Number.prototype.toPaddedString=function(length) { var b=''+this; while (b.length<length) b='0'+b; return b; }
function feedsky_to_list(list_id,n)
{
	var list_dl=document.getElementById(list_id);
	if (!list_dl) return;
	if (!feed) return;
	var b='';
	for (var i=0;i<n;++i)
	{
		if (feed.items.length>i)
		{
			var it=feed.items[i];
			var date=new Date(it.pubDate);
			b+='<dt><a href="'+it.link+'">'+it.title.escapeHTML()+'</a></dt>\n';
			b+='<dd>'+date.getFullYear().toPaddedString(4)+'-'+(date.getMonth()+1).toPaddedString(2)+'-'+date.getDate().toPaddedString(2)+' '+date.getHours().toPaddedString(2)+':'+date.getMinutes().toPaddedString(2)+'</dd>\n';
		}
		else
		{
			b+='<dt>&nbsp;</dt>\n<dd>&nbsp;</dd>\n';
		}
	}
	list_dl.innerHTML=b;
	addArrow();
}