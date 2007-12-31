var dirbase_file='http://yoursunny.com:81/listen/';
var dirbase_music='http://yoursunny.com:81/listen/music/';
var data_feed_http=null;
var data_feed=null;
var data_feed_callback=null;
function getXMLHTTP()//获取XMLHTTP对象
{
	var r=null;
	try { r=new ActiveXObject("Msxml2.XMLHTTP"); } catch(e)
	{ try { r=new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) { } }
	if (r==null) r=new XMLHttpRequest();
	if (r==null) alert('你的浏览器不支持XMLHTTP，请升级');
	return r;
}
function downloadFeed()//下载节目列表
{
	data_feed_http=getXMLHTTP();
	data_feed_http.onreadystatechange=downloadFeed1;
	data_feed_http.open('GET','feed.php?a=all',true);
	data_feed_http.send(null);
}
function downloadFeed1()//下载节目列表
{
	if (data_feed_http!=null && (data_feed_http.readyState==4 || data_feed_http.readyState=="complete"))
	{
		if (data_feed_http.status!=200) return;
		var x=data_feed_http.responseXML;
		if (x==null) return;
		data_feed=new Array();
		var E=x.getElementsByTagName('entry');
		for (var i=0;i<E.length;++i)
		{
			var e=E[i];
			var o=new Object();
			o.id=Number(e.getElementsByTagName('id')[0].firstChild.nodeValue.replace('http://listen.yoursunny.com/program/',''));
			o.title=e.getElementsByTagName('title')[0].firstChild.nodeValue;
			o.summary=e.getElementsByTagName('summary')[0].firstChild.nodeValue;
			var t=e.getElementsByTagName('updated')[0].firstChild.nodeValue;
			o.t=new Date(t.substr(0,4),Number(t.substr(5,2))-1,t.substr(8,2),t.substr(11,2),t.substr(14,2),t.substr(17,2),0);
			var L=e.getElementsByTagName('link');
			o.file=null;
			for (var j=0;j<L.length;++j)
			{
				var l=L[j];
				if (l.getAttribute('rel')=='enclosure')
				{
					o.file=l.getAttribute('href').replace('http://listen.yoursunny.com/file/',dirbase_file);
				}
			}
			var C=e.getElementsByTagName('category');
			o.category=new Array();
			for (var j=0;j<C.length;++j)
			{
				o.category.push(C[j].getAttribute('term'));
			}
			data_feed.push(o);
		}
		if (data_feed_callback!=null) eval(data_feed_callback);
	}
}
var data_music_http=null;
var data_music=null;
var data_music_callback=null;
function downloadMusic()//下载音乐列表
{
	data_music_http=getXMLHTTP();
	data_music_http.onreadystatechange=downloadMusic1;
	data_music_http.open('GET',dirbase_music+'list.txt',true);
	data_music_http.send(null);
}
function downloadMusic1()//下载音乐列表
{
	if (data_music_http!=null && (data_music_http.readyState==4 || data_music_http.readyState=="complete"))
	{
		if (data_music_http.status!=200) return;
		var x=data_music_http.responseText;
		if (x==null) return;
		data_music=x.split('\r\n');
		if (data_music_callback!=null) eval(data_music_callback);
	}
}
function showList(category)
{
	var b='<dl>\r\n';
	for (var i=0;i<data_feed.length;++i)
	{
		var P=data_feed[i];
		var show=category==null;
		var bb='<dt><b onclick="play('+P.id+')">'+P.title+'</b> &nbsp; <i>'+P.t.getFullYear()+'年'+(P.t.getMonth()+1)+'月</i> &nbsp; 类别：';
		for (var j=0;j<P.category.length;++j)
		{
			var C=P.category[j];
			show=show||(C==category);
			bb+='<u onclick="showList(\''+C+'\')">'+C+'</u> ';
		}
		bb+='</dt>\r\n<dd>'+P.summary+'</dd>\r\n';
		if (show) b+=bb;
	}
	b+='</dl>\r\n';
	document.getElementById('l').innerHTML=b;
	addArrow();
}
function findProgram(id)
{
	for (var i=0;i<data_feed.length;++i)
	{
		if (data_feed[i].id==id) return data_feed[i];
	}
	return null;
}
function play(id)
{
	var P=findProgram(id);
	if (P==null) return;
	playinit(1,P.file);
	document.getElementById('t').innerHTML='正在播放：<b>'+P.title+'</b> <u onclick="playpause()">暂停</u> <span id="playtime"></span>';
	c('/listen/'+P.title);
}
var playtimer=null;
function playinit(step,uri)
{
	var p=document.getElementById('player');
	if (p==null) return;
	if (step==1)
	{
		p.SetVariable('url',uri);
		p.SetVariable('cmd','load');
		setTimeout('playinit(2)',1000);
	}
	else
	{
		p.SetVariable('cmd','play');
		if (playtimer==null) playtimer=setInterval('playtime()',100);
	}
}
function playpause()
{
	var p=document.getElementById('player');
	if (p==null) return;
	p.SetVariable('cmd','pause');
}
function playtime()
{
	var p=document.getElementById('player');
	if (p==null) return;
	var t=p.GetVariable('t');
	if (typeof(t)=='undefined' || t==NaN || t<=0) return;
	var minute=Math.floor(t/60);
	var second=String(Math.floor(t%60));
	if (second.length<2) second='0'+second;
	document.getElementById('playtime').innerHTML=minute+':'+second;
}
function song_complete()
{
}
