<?php
//手机号码IP地址归属地查询
//yoursunny.com 2008-12-12
if (!isset($_GET['q'])) die('search.php?q=keyword');
$q=$_GET['q'];
header('Content-Type: application/json');

function WaitForLine($f,$keyword) {//等待出现含有关键字的行，返回该行
	while (!feof($f)) {
		$l=fgets($f);
		if (strstr($l,$keyword)!==FALSE) return $l;
	}
	return NULL;
}

if (preg_match('/^134[0-8]\d{7}|(13[5-9]|15[01789]|188)\d{8}$/',$q)) {//移动手机号码
	$f=fsockopen('www.chinamobile.com',80,$errno,$errstr,5);
	stream_set_timeout($f,3);
	fwrite($f,
		"POST /service/online/location.do HTTP/1.1\r\n".
		"Host: www.chinamobile.com\r\n".
		"Referer: http://www.chinamobile.com/service/online/location.do\r\n".
		"Content-Type: application/x-www-form-urlencoded\r\n".
		"Content-Length: 32\r\n".
		"\r\n".
		"sectionNum=".$q."&urlType=1\r\n"
	);
	WaitForLine($f,iconv('utf-8','gbk','所属省份：'));
	$l=fgets($f);
	$province=iconv('gbk','utf-8',str_replace(array('<TD >','</TD>'),'',trim($l)));
	WaitForLine($f,iconv('utf-8','gbk','所属城市：'));
	$l=fgets($f);
	$city=iconv('gbk','utf-8',str_replace(array('<TD >','</TD>'),'',trim($l)));
	fclose($f);
	echo json_encode(array('type'=>'mobile','company'=>'cmcc','province'=>$province,'city'=>$city,'result'=>($province==$city)?$city:$province.' '.$city));
}
else if (preg_match('/^13[012]\d{8}$/',$q)) {//联通手机号码
	$f=fsockopen('www.sh.chinaunicom.com',80,$errno,$errstr,5);
	stream_set_timeout($f,3);
	fwrite($f,
		"POST /ehall/area/queryAreaByPhone.do HTTP/1.0\r\n".
		"Host: www.sh.chinaunicom.com\r\n".
		"Content-Type: application/x-www-form-urlencoded\r\n".
		"Content-Length: 37\r\n".
		"\r\n".
		"phone=".$q."&submit=%CC%E1%BD%BB\r\n"
	);
	WaitForLine($f,iconv('utf-8','gbk','您输入的手机号码归属于：'));
	fgets($f);//跳过空行
	$l=fgets($f);
	$result=iconv('gbk','utf-8',str_replace(array('<td width="40%"align="left" class="font_black">','</td>'),'',trim($l)));
	fclose($f);
	echo json_encode(array('type'=>'mobile','company'=>'unicom','result'=>$result));
}
else if (preg_match('/^(1[35]3|189)\d{8}$/',$q)) {//电信手机号码
	$f=fsockopen('www2.ct10000.com',80,$errno,$errstr,5);
	stream_set_timeout($f,3);
	fwrite($f,
		"POST /cdma/index.jsp HTTP/1.1\r\n".
		"Host: www2.ct10000.com\r\n".
		"Content-Type: application/x-www-form-urlencoded\r\n".
		"Content-Length: 19\r\n".
		"\r\n".
		"webcode=".$q."\r\n"
	);
	$l=WaitForLine($f,iconv('utf-8','gbk','您号码的归属地为'));
	$matches=array();
	preg_match('/target="_blank">(.+)<\/a>/',iconv('gbk','utf-8',$l),$matches);
	$result=$matches[1];
	fclose($f);
	echo json_encode(array('type'=>'mobile','company'=>'telecom','result'=>$result));
}
else if (preg_match('/^.+\..+$/',$q)) {//域名或IP地址
	if (preg_match('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/',$q)) $ip=$q;
	else $ip=gethostbyname($q);
	$result='';
	if (preg_match('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/',$ip)) {
		$f=fsockopen('www.ip.cn',80,$errno,$errstr,3);
		stream_set_timeout($f,3);
		fwrite($f,
			"GET /getip.php?action=queryip&ip_url=".$ip." HTTP/1.1\r\n".
			"Host: www.ip.cn\r\n".
			"\r\n"
		);
		$l=WaitForLine($f,'</span>');
		$matches=array();
		preg_match('/来自：(.*)$/',iconv('gbk','utf-8',$l),$matches);
		$result=trim($matches[1]);
		fclose($f);
	}
	echo json_encode(array('type'=>'ip','ip'=>$ip,'result'=>$result));
}
?>