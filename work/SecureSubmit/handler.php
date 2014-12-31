<?php
//sample handler in PHP5
//requires bcmath, mcrypt
session_start();
bcscale(0);

function hex2dec($hex) {
	$y='0';
	$len=strlen($hex);
	for ($i=0;$i<$len;++$i) {
		$y=bcmul($y,'16');
		$y=bcadd($y,hexdec($hex{$i}));
	}
	return $y;
}
function dec2hex($dec) {
	$x=$dec;
	$y='';
	while (bccomp($x,'0')!=0) {
		$n=bcdiv($x,'16');
		$d=bcmod($x,'16');
		$x=$n;
		$y.=dechex($d);
	}
	return strrev($y);
}
function hex2str($hex) {
	$x=$hex;
	$b='';
	$len=strlen($hex);
	if ($len%2==1) { $x='0'.$x; ++$len; }
	for ($i=0;$i<$len;$i+=2) {
		$b.=chr(hexdec(substr($x,$i,2)));
	}
	return $b;
}

function genkey()
{
	$g=hex2dec($_POST['g']);
	$n=hex2dec($_POST['n']);
	$X=hex2dec($_POST['X']);	
	$y=rand64bit();
	$Y=bcpowmod($g,$y,$n);
	$K=bcpowmod($X,$y,$n);
	$key=dec2hex($K);
	$_SESSION['key']=hex2str($key);
	header('Content-Type: application/json');
	echo '{Y:\''.dec2hex($Y).'\'}';
}
function rand64bit()
{
	$n='0';
	for ($i=0;$i<4;++$i) $n=bcadd(bcmul($n,'65536'),mt_rand(0,65535));
	return $n;
}

function save()
{
	$key=$_SESSION['key'];
	$v=base64_decode($_POST['v']);
	$m=mcrypt_decrypt(MCRYPT_DES,$key,$v,MCRYPT_MODE_ECB);
	$_SESSION['password']=trim($m,"\0");
}

switch ($_REQUEST['a']) {
	case 'genkey': genkey(); break;
	case 'save': save(); break;
	case 'show':
		echo $_SESSION['password'];
		break;
}

?>