<?php
require_once 'common.func.php';

function Union_hours() {
	$body = cached_load('union','http://union.arizona.edu/infodesk/hours/index.php?cat=all');
	$body = str_replace(array('&','><</span>','>></span>','g:plusone'),array('&amp;','></span>','></span>','a'),$body);
	$dom = new DOMDocument; $dom->loadHTML($body);
	$xdoc = simplexml_import_dom($dom);
	$hours = array();
	$xtrs = $xdoc->xpath("//div[@id='center-col']/table/tbody/tr");
	foreach ($xtrs as $xtr) {
		$name = trim(strval($xtr->td[0]->a));
		$houra = array_map('trim',explode('-',strval($xtr->td[1])));
		if (count($houra)!=2) {
			if ($houra[0]=='closed') $hours[] = array($name,FALSE,FALSE);
			continue;
		}
		$opentime = strtotime(str_replace(array('a','p'),array('am','pm'),$houra[0]));
		$closetime = strtotime(str_replace(array('a','p'),array('am','pm'),$houra[1]));
		if ($closetime < $opentime) $closetime += 86400;
		$hours[] = array($name,$opentime,$closetime);
	}
	return $hours;
}

?>
