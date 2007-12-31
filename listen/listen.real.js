var dirbase_file='http://sunny/site/yoursunny_apache/listen/';
var dirbase_music='http://sunny/site/yoursunny_apache/listen/music/';
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
function determinePlayer()
{
	var wmp=document.getElementById('wmp1');
	if (typeof(wmp.uiMode)!='undefined') return 'wmp';
	var real=document.getElementById('real1');
	try { real.DoPlayPause(); return 'real'; } catch(ex) { }
	return null;
}
var usePlayer=determinePlayer();
function play(id)
{
	var P=findProgram(id);
	if (P==null) return;
	ctrl(1,'load',P.file);
	ctrl(1,'play');
}
function showState()
{
	document.getElementById('p').innerHTML=ctrl(1,'position');
}
setInterval('showState()',100);
//load,file
//play
//pause
//stop
//volume,null(get) volume,value(set)
//position,null(get) position,value(set) unit:second
//state(get) 0=loading 1=playing 2=paused 3=stopped -1=unknown
function ctrl(id,cmd,param)
{
	switch (usePlayer)
	{
		case 'real':
			var p=document.getElementById('real'+id);
			if (p==null) return;
			switch (cmd)
			{
				case 'load':
					p.SetSource(param);
					break;
				case 'play':
					p.DoPlay();
					break;
				case 'pause':
					p.DoPause();
					break;
				case 'stop':
					p.DoStop();
					break;
				case 'volume':
					if (param==null) return p.GetVolume();
					else p.SetVolume(param);
					break;
				case 'position':
					if (param==null) return p.GetPosition()/1000;
					else p.SetPosition(param*1000);
					break;
				case 'state':
					var s=p.GetPlayState();
					switch (s)
					{
						case 1: case 2: return 0;
						case 3: return 1;
						case 4: return 2;
						case 0: return 3;
					}
					return -1;
			}
			break;
		case 'wmp':
			var p=document.getElementById('wmp'+id);
			if (p==null) return;
			switch (cmd)
			{
				case 'load':
					p.URL=param;
					break;
				case 'play':
					p.controls.play();
					break;
				case 'pause':
					p.controls.pause();
					break;
				case 'stop':
					p.controls.stop();
					break;
				case 'volume':
					if (param==null) return p.settings.volume;
					else p.settings.volume=param;
					break;
				case 'position':
					if (param==null) return p.controls.currentPosition;
					else p.controls.currentPosition=param;
					break;
				case 'state':
					switch (p.playState)
					{
						case 6: case 11: case 9: case 7: return 0;
						case 3: return 1;
						case 2: return 2;
						case 8: case 10: case 1: return 3;
					}
					return -1;
			}
			break;
		default:
			alert('找不到当前系统支持的播放器，请尝试更换浏览器或安装新的播放软件');
			return;
	}
}
