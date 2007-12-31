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
function songwrite()
{
	var uri=document.getElementById('songuri').innerHTML;
	document.writeln('<div id="songplay">\n'+(navigator.userAgent.indexOf('MSIE')>=0?'<object id="songplayer" classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" width="0" height="0">\n<param name="url" value="'+uri+'" />':'<object id="songplayer" type="video/x-ms-wmv" data="images/song.mp3" width="0" height="0">\n<param name="src" value="'+uri+'" />')+'\n<param name="autostart" value="true" />\n<param name="controller" value="true" />\n</object></div>');
}
songwrite();
var songplaying=true;
function songcontrol()
{
	var t=document.getElementById('songtitle').innerHTML+' '+document.getElementById('songartist').innerHTML;
	var b=document.getElementById('songctrl');
	var o=document.getElementById('songplay');
	var p=document.getElementById('songplayer');
	if (songplaying)
	{
		songplaying=false;
		if (navigator.userAgent.indexOf('MSIE')>=0)
		{
			p.controls.pause();
		}
		else
		{
			o.h=o.innerHTML;
			o.innerHTML='';
		}
		h('song/'+t+'-stop');
	}
	else
	{
		songplaying=true;
		if (navigator.userAgent.indexOf('MSIE')>=0)
		{
			p.controls.play();
		}
		else
		{
			o.innerHTML=o.h;
			o.h=null;
		}
		h('song/'+t+'-play');
	}
	if (document.getElementById('songctrltip').innerHTML!='') songctrltip(true);
}
function songctrltip(In)
{
	var m=In?((navigator.userAgent.indexOf('MSIE')>=0)?(songplaying?'暂停':'继续'):(songplaying?'停止':'播放')):'';
	document.getElementById('songctrltip').innerHTML=m;
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
