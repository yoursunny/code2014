<?php
header('Content-Type: text/javascript');

require 'IP_IS2005.php';

$ip=isset($_SERVER['HTTP_X_FORWARDED_FOR'])?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR'];

if (isset($IP_IS2005[$ip])) {
	$d=$IP_IS2005[$ip];
	echo 'var april_fool_msg="本站已经被'.$d[1].'攻破，拨打电话'.$d[0].'了解黑站方法！";'."\r\n";
} else {
	echo 'var april_fool_msg="Hacked by '.$ip.', 本站已经被黑！";'."\r\n";
}

?>
function april_fool() {
	if (Cookie.get('april_fool')=='done') return;
	var now=new Date();
	if (now.getMonth()+1!=4 || now.getDate()!=1) return;
	var d=document.viewport.getDimensions();
	var o=Builder.node('div',{id:'april_fool_o',style:'display:none;position:absolute;left:0;top:0;background:#000000;width:'+d.width+'px;height:'+(d.height*2)+'px;z-index:41;'});
	var t=Builder.node('h1',{id:'april_fool_t',style:'font-size:30pt;line-height:40pt;font-family:"楷体_GB2312";color:#FF0000;'},april_fool_msg);
	new Insertion.After('footer',o);
	Effect.Appear(o,{duration:3,afterFinish:function(){
		new Insertion.Top(o,t);
		setTimeout(april_fool_tip,5000);
	}});
}
function april_fool_tip() {
	var m=Builder.node('img',{id:'april_fool_m',style:'position:absolute;',src:'http://www.65536.cn/z/2008/april/apple.gif'});
	new Insertion.Top('april_fool_o',m);
	var d=document.viewport.getDimensions();
	new Effect.Move(m,{x:d.width*0.6,y:d.height*0.6,mode:'absolute'});
	$('april_fool_t').update('今天是愚人节，你上当了～<br/>这只是一个玩笑 || 当本站真的被黑时，记得拨打客服热线15900941215<br/>点击apple进入首页');
	Event.observe('april_fool_m','click',april_fool_restore);
}
function april_fool_restore() {
	Effect.BlindUp('april_fool_o',{duration:2});
	Cookie.set('april_fool','done');
}
//2008-04-01 愚人节玩笑
//显示黑底红字“本站已经被黑”界面
april_fool();
