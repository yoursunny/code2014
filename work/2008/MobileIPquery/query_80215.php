<?php
//手机号码IP地址归属地查询
//yoursunny.com 2008-02-15
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

if (preg_match('/^1(?:34[0-8]|3[5-9]\d|5[0789]\d)\d{7}$/',$q)) {//移动手机号码
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
else if (preg_match('/^1(?:3[0123]|5[13])\d{8}$/',$q)) {//联通手机号码
	$f=fsockopen('www.sh.chinaunicom.com',80,$errno,$errstr,5);
	stream_set_timeout($f,3);
	fwrite($f,
		"POST /ehall/area/queryAreaByPhone.do HTTP/1.1\r\n".
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
else if (preg_match('/^.+\..+$/',$q)) {//域名或IP地址
	if (preg_match('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/',$q)) $ip=$q;
	else $ip=gethostbyname($q);
	$f=fsockopen('www.cz88.net',80,$errno,$errstr,3);
	stream_set_timeout($f,5);
	fwrite($f,
		"GET /ip/ipcheck.aspx?ip=".$ip." HTTP/1.1\r\n".
		"Host: www.cz88.net\r\n".
		"\r\n"
	);
	$l=WaitForLine($f,'document.write');
	$result=iconv('gbk','utf-8',str_replace(array('document.write("','");'),'',trim($l)));
	fclose($f);
	echo json_encode(array('type'=>'ip','ip'=>$ip,'result'=>$result));
}
?>