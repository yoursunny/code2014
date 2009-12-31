<?php
$reCAPTCHA_public_key='6Lf2QAMAAAAAAI0FHV-Cb5t08QaXP_BxPZse6vrC';
if (@$_GET['reCAPTCHA'] == 'challenge') {
	$state_js=@file_get_contents('http://api.recaptcha.net/challenge?k='.$reCAPTCHA_public_key.'&ajax=1&cachestop=0');
	$matches=array();
	preg_match("/challenge\s*:\s*'([\w\-]+)'/",$state_js,$matches);
	$c=$matches[1];
	//preg_match("/server\s*:\s*'([\w\.\:\/]+)'/",$state_js,$matches);
	//$server=$matches[1];
	//setcookie('reCAPTCHA-challenge',$c);
	header('Content-Type: text/plain');
	echo $c;
} elseif (@$_GET['reCAPTCHA'] == 'image') {
	$server='http://api.recaptcha.net/';
	$u=$server.'image?c='.$_GET['c'];
	header('Content-Type: image/jpeg');
	/*
	$ch=curl_init($u);
	curl_setopt($ch,CURLOPT_REFERER,'http://yoursunny.com/lib/reCAPTCHA.php');
	curl_exec($ch);
	*/
	$context=array(
		'http'=>array(
			'method'=>'GET',
			'header'=>'Referer: http://yoursunny.com/lib/reCAPTCHA.php'
		)
	);
	$sock=fopen($u,'r',false,stream_context_create($context));
	$result='';
	while (!feof($sock)) $result.=fgets($sock, 4096);
	fclose($sock);
	echo $result;
} elseif (@$_GET['reCAPTCHA'] == 'verify') {
	echo reCAPTCHA_verify($_GET['c'],$_GET['a']);
}

function reCAPTCHA_verify($challenge,$answer) {
	//global $reCAPTCHA_private_key;
	$reCAPTCHA_private_key='6Lf2QAMAAAAAAOG-5QgeBgfKyx2fnHL5UCRdp6b-';
	$u='http://api-verify.recaptcha.net/verify';
	$p=array(
		'privatekey='.$reCAPTCHA_private_key,
		'remoteip='.$_SERVER['REMOTE_ADDR'],
		'challenge='.$challenge,
		'response='.$answer
	);
	/*
	$ch=curl_init($u);
	curl_setopt($ch,CURLOPT_POST,TRUE);
	curl_setopt($ch,CURLOPT_POSTFIELDS,implode('&',$p));
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,TRUE);
	$resp=curl_exec($ch);
	*/
	$context=array(
		'http'=>array(
			'method'=>'POST',
			'header'=>'Content-Type: application/x-www-form-urlencoded',
			'content'=>implode('&',$p)
		)
	);
	$sock=fopen($u,'r',false,stream_context_create($context));
	$resp='';
	while (!feof($sock)) $resp.=fgets($sock, 4096);
	fclose($sock);
	$ar=explode("\n",$resp);
	return $ar[1];
}

?>
