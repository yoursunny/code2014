<?php
header('Content-Type: text/javascript');
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
page_cache(7200);
page_gzip();

$want=explode(',',@$_SERVER['QUERY_STRING']);
foreach ($want as $s) {
	switch ($s) {
		case 'core':
			readfile('core.js');
			break;
		case 'input':
			readfile('input.js');
			break;
		case 'algorithm':
			readfile('algorithm.js');
			break;
		case 'calc':
			readfile('calc.js');
			break;
		case 'export':
			readfile('export.js');
			break;
		case 'translator':
			readfile('translator.js');
			break;
	}
	echo "GPA.LoadComponent.a.push('".$s."');\r\n";
	flush();
}
?>