<?php
//mobile IP query
//yoursunny.com 2011-04-05
$q=@$_GET['q'];
header('Content-Type: application/json');

function request($ch) {//execute HTTP request with curl, and returns result
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	//curl_setopt($ch,CURLOPT_PROXY,'127.0.0.1:8888');
	$resp=curl_exec($ch);
	curl_close($ch);
	return explode("\n",str_replace("\r",'',$resp));
}

function WaitForLine(&$a,$keyword) {//find the first line with text
	while (count($a)>0) {
		$l=array_shift($a);
		if (strstr($l,$keyword)!==FALSE) return $l;
	}
	return NULL;
}

if (preg_match('/^134[0-8]\d{7}|(13[5-9]|15[01789]|188)\d{8}$/',$q)) {//CMCC phone
	$ch=curl_init('http://www.hn.10086.cn/service/online/ascription.do?queryno='.$q);
	curl_setopt($ch,CURLOPT_POSTFIELDS,'');
	$a=request($ch);
	$la=explode('&',iconv('gbk','utf-8',$a[0]));
	$province=$la[1];
	$city=$la[2];
	echo json_encode(array('type'=>'mobile','company'=>'cmcc','province'=>$province,'city'=>$city,'result'=>($province==$city)?$city:$province.' '.$city));
}
elseif (preg_match('/^1(3[012]|86)\d{8}$/',$q)) {//CU-GSM phone
	$ch=curl_init('http://info.10010.com/database/place/findAffPlace.do?mNumber='.$q);
	$a=request($ch);
	WaitForLine($a,iconv('utf-8','gbk','号码归属地：'));
	$l=$a[1];
	$result=iconv('gbk','utf-8',strip_tags(trim($l)));
	echo json_encode(array('type'=>'mobile','company'=>'unicom','result'=>$result));
}
elseif (preg_match('/^(1[35]3|189)\d{8}$/',$q)) {//CDMA phone
	$ch=curl_init('http://www2.ct10000.com/cdma/index.jsp');
	curl_setopt($ch,CURLOPT_POSTFIELDS,'webcode='.$q);
	$a=request($ch);
	$l=WaitForLine($a,iconv('utf-8','gbk','您号码的归属地为'));
	$matches=array();
	preg_match('/target="_blank">(.+)<\/a>/',iconv('gbk','utf-8',$l),$matches);
	$result=$matches[1];
	echo json_encode(array('type'=>'mobile','company'=>'telecom','result'=>$result));
}
elseif (preg_match('/^.+\..+$/',$q)) {//domain or IP
	if (preg_match('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/',$q)) $ip=$q;
	else $ip=gethostbyname($q);
	$result='';
	if ($ip==$q || preg_match('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/',$ip)) {
		$ch=curl_init('http://www.ip.cn/getip.php?action=queryip&ip_url='.$ip);
		$a=request($ch);
		$l=$a[0];
		$matches=array();
		preg_match('/来自：(.*)$/',iconv('gbk','utf-8',$l),$matches);
		$result=trim($matches[1]);
	}
	echo json_encode(array('type'=>'ip','ip'=>$ip,'result'=>$result));
}
else {
	echo json_encode(array('type'=>'unknown'));
}
?>