<?php
$OOO0O0O00=__FILE__;

//$OOO000000=urldecode('%74%68%36%73%62%65%68%71%6c%61%34%63%6f%5f%73%61%64%66%70%6e%72');
$OOO000000='th6sbehqla4co_sadfpnr';

$OO00O0000=26408;

//$OOO0000O0=$OOO000000{4}.$OOO000000{9}.$OOO000000{3}.$OOO000000{5};
//$OOO0000O0.=$OOO000000{2}.$OOO000000{10}.$OOO000000{13}.$OOO000000{16};
//$OOO0000O0.=$OOO0000O0{3}.$OOO000000{11}.$OOO000000{12}.$OOO0000O0{7}.$OOO000000{5};
$OOO0000O0='base64_decode';

$O0O0000O0='OOO0000O0';

//$OO0OO0000=$OOO000000{17}.$OOO000000{12}.$OOO000000{18}.$OOO000000{5}.$OOO000000{19};
$OO0OO0000='fopen';

//if(!0)$O000O0O00=$OO0OO0000($OOO0O0O00,'rb');
$O000O0O00=fopen($OOO0O0O00,'rb');

//$OO0OO000O=$OOO000000{17}.$OOO000000{20}.$OOO000000{5}.$OOO000000{9}.$OOO000000{16};
$OO0OO000O='fread';

$OO0OO00O0=$OOO000000{14}.$OOO000000{0}.$OOO000000{20}.$OOO000000{0}.$OOO000000{20};
$OO0OO00O0='strtr';

//$OO0OO000O($O000O0O00,1182);
fread($O000O0O00,1182);

/*$OO00O00O0=($OOO0000O0(
	$OO0OO00O0(
		$OO0OO000O($O000O0O00,908),
		'I/MNKACdVRGQyDWUgq68wpkazLO5ltnmTB+0bv9uHrxF7XSY1E3fZhijc4e2oJsP=',
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
		)
	)
);*/
$OO00O00O0=(base64_decode(
	strtr(
		fread($O000O0O00,908),
		'I/MNKACdVRGQyDWUgq68wpkazLO5ltnmTB+0bv9uHrxF7XSY1E3fZhijc4e2oJsP=',
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
		)
	)
);




/*
while (
	(
		(isset($HTTP_SERVER_VARS['SERVER_NAME']))
		&&
		(!eregi('((.*\.)?dhainan\.com)|((\.*\\.)?hk2shou\.com)|((\.*\\.)?localhost)',$HTTP_SERVER_VARS['SERVER_NAME']))
	)
	||
	(
		(isset($_SERVER['HTTP_HOST']))
		&&
		(!eregi('((.*\.)?dhainan\.com)|((\.*\\.)?hk2shou\.com)|((\.*\\.)?localhost)',$_SERVER['HTTP_HOST']))
	)
) die('请使用域名 dhainan.com hk2shou.com访问，本地请使用：localhost。程序购买请联系QQ：415204');
*/


/*
$OO00O00O0=str_replace(
	'__FILE__',
	"'".$OOO0O0O00."'",
	($OOO0000O0(
		$OO0OO00O0(
			$OO0OO000O($O000O0O00,$OO00O0000),
			'I/MNKACdVRGQyDWUgq68wpkazLO5ltnmTB+0bv9uHrxF7XSY1E3fZhijc4e2oJsP=',
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
			)
		)
	)
);*/
$OO00O00O0=str_replace(
	'__FILE__',
	"'".$OOO0O0O00."'",
	(base64_decode(
		strtr(
			fread($O000O0O00,26408),
			'I/MNKACdVRGQyDWUgq68wpkazLO5ltnmTB+0bv9uHrxF7XSY1E3fZhijc4e2oJsP=',
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
			)
		)
	)
);
fclose($O000O0O00);
eval($OO00O00O0);
?>