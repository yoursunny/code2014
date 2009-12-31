<?php
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
load_nusoap();
$server=new soap_server;
$server->configureWSDL('kcdm', 'http://yoursunny.com/study/GPA/kcdm.wsdl');
$server->register('lookup',array('name'=>'xsd:string'),array('return'=>'xsd:string'),'http://yoursunny.com/study/GPA/kcdm','http://yoursunny.com/study/GPA/kcdm.lookup','rpc','encoded');
function lookup($name) {
	$f=fopen('kcdm.txt','r');
	fgets($f);
	while (FALSE!==($l=fgets($f))) {
		$r=explode(',',$l);
		if (count($r)==2 && $r[0]==$name) {
			fclose($f);
			return trim($r[1]);
		}
	}
	fclose($f);
	return '';
}
$HTTP_RAW_POST_DATA=isset($HTTP_RAW_POST_DATA)?$HTTP_RAW_POST_DATA:'';
$server->service($HTTP_RAW_POST_DATA);
?>