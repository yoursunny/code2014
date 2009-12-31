<?php
$start=intval(@$_GET['start']);
$length=intval(@$_GET['length']);
if ($start==0 && $length==0) {
	readfile('home.htm');
	exit;
}
$building=@$_GET['building'];
$equipac=(@$_GET['ac'])?1:0;
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
$now=timea();
$date=date('Y-m-d',$now);
$time1=date('H:i:s',$now+$start);
$time2=date('H:i:s',$now+$start+$length);
$blds=array(1=>'上院','中院','下院','东上院','东中院','东下院');
$bld='';
$params=array(
	'buildingcount'=>3,
	'date'=>$date,
	'startat'=>$time1,
	'endat'=>$time2,
	'equivac'=>$equipac
);
switch ($building) {
	case 'W':
		$params['building1']=1;
		$params['building2']=2;
		$params['building3']=3;
		$bld='西区';
		break;
	case 'E':
		$params['building1']=4;
		$params['building2']=5;
		$params['building3']=6;
		$bld='东区';
		break;
	default:
		$params['building1']=$building=intval($building);
		$bld=$blds[$building];
		break;
}
$post=array();
foreach ($params as $key=>$value) $post[]=$key.'='.urlencode($value);
$post=implode('&',$post);
$context=array(
	'http'=>array(
		'method'=>'POST',
		'header'=>implode("\r\n",array('Content-type: application/x-www-form-urlencoded',
			'User-Agent: yoursunny.sjtu-classroom/20090414',
			'X-Requested-With: XMLHttpRequest',
			'Content-length: '.strlen($post)
		)),
		'content'=>$post
	)
);
$sock=fopen('http://202.120.33.70:8080/user_ajax/query','r',false,stream_context_create($context));
$result='';
while (!feof($sock)) $result.=fgets($sock, 4096);
fclose($sock);
$dom=DOMDocument::loadHTML('<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>'.$result);
$x=simplexml_import_dom($dom);
$a=array();
foreach ($x->body->table->tr as $TR) {
	$TDs=$TR->td;
	if (count($TDs)==5) {
		$bfu=explode('/',$TDs[0]->a['href']);
		$a[]=array(
			'bldid'=>intval($bfu[4]),
			'bld'=>$blds[$bfu[4]],
			'floor'=>intval($bfu[6]),
			'roomid'=>str_replace(array('javascript:showclassroom(',')'),'',$TDs[1]->a['onclick']),
			'room'=>trim($TDs[1]->a),
			'seat'=>intval($TDs[2]),
			'roomtype'=>trim($TDs[3]),
			'status'=>trim($TDs[4]->div->div)
		);
	}
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>上海交通大学教室查询系统</title>
</head><body>
<h1>上海交通大学教室查询系统</h1>
<table>
<caption><?php echo $bld.$date.' '.$time1.'~'.$time2; ?>空闲<?php if ($equipac) echo '空调'; ?>教室</caption>
<tr><th>大楼</th><th>房间</th><th>座位数</th></tr>
<?php
foreach ($a as $r) {
	echo '<tr><td>'.$r['bld'].'</td><td>'.$r['room'].'</td><td>'.$r['seat'].'</td></tr>'."\r\n";
}
?>
</table>
<p><a href="./">修改查询条件</a></p>
<p>数据来源：上海交通大学教务处<br/>
手机版制作：<a href="/">阳光男孩</a></p>
<p><img src="http://img.users.51.la/1697972.asp" alt=""/></p>
</body></html>