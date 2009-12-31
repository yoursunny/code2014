<?php
//xiaonei API
//$session_key=$_REQUEST['xn_sig_session_key'];
//define('xiaonei_APPID','');
//define('xiaonei_SECRET','');


function xiaonei_api($method,$params=array()) {
	global $session_key;
	$params=array_merge($params,array(
		'api_key'=>xiaonei_APPID,
		'method'=>$method,
		'session_key'=>$session_key,
		'call_id'=>microtime(true),
		'v'=>'1.0'
	));
	$post=array();
	foreach ($params as $key=>$value) $post[]=$key.'='.urlencode($value);
	ksort($post);
	$sig=md5(implode('',$post).xiaonei_SECRET);
	$post[]='sig='.$sig;
	$post=implode('&',$post);
	$context=array(
		'http'=>array(
			'method'=>'POST',
			'header'=>implode("\r\n",array('Content-type: application/x-www-form-urlencoded',
				'User-Agent: yoursunny.xiaoneiAPI/20090201',
				'Content-length: '.strlen($post)
			)),
			'content'=>$post
		)
	);
	$sock=fopen('http://api.xiaonei.com/restserver.do','r',false,stream_context_create($context));
	$result='';
	while (!feof($sock)) $result.=fgets($sock, 4096);
	fclose($sock);
	return simplexml_load_string($result);
}


?>