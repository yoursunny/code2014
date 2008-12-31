<?php
header('Content-Type: text/javascript');
//header('Expires:'.date('r',time()+7200));
header('Cache-Control: max-age=7200');

//if (strstr($_SERVER['HTTP_ACCEPT_ENCODING'],'gzip')!==FALSE)
/*{
	if (!file_exists('lib.js.gz')) {
		$f=gzopen('lib.js.gz','wb9');
		gzwrite($f,file_get_contents('lib.js'));
		gzwrite($f,file_get_contents('lib-common.js'));
		gzclose($f);
	}
	header('Content-Encoding: gzip');
	readfile('lib.js.gz');
}*/
//else {
	//readfile('lib.js');
	//readfile('lib-common.js');
	readfile('lib.min.js');
//}
?>