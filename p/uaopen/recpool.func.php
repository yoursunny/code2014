<?php
require_once 'common.func.php';

function RecPool_status() {
	$body = cached_load('recpool','http://campusrec.arizona.edu/program_areas/aquatics/programs.php',300);
	$body = str_replace(array('&'),array('&amp;'),$body);
	$dom = new DOMDocument; $dom->loadHTML($body);
	$xdoc = simplexml_import_dom($dom);
	list($xrightcol) = $xdoc->xpath("//div[@id='right-column']");
	$xstatus = $xrightcol->div[1];
	$r = array();
	$text = strval($xstatus->h1);
	$r['open'] = $open = strpos(strtoupper($xstatus->h1),'OPEN')!==FALSE;
	if ($open) {
		$text .= ', '.$xstatus->h2;
		$r['volume'] = str_replace('VOLUME IS ','',strtoupper($xstatus->h2));
	} else {
		if (count($xstatus->p)>0) {
			$text .= ' due to '.$xstatus->p;
			$r['reason'] = strtoupper($xstatus->p);
		} else {
			$r['reason'] = '';
		}
	}
	$r['text'] = strtoupper($text);
	return $r;
}

?>
