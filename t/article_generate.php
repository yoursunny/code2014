<?php
/*  xxx.article.htm generates xxx.htm
article_title
keywords
byline
dtd settings
 */
if ($_SERVER['REMOTE_ADDR']!=$_SERVER['SERVER_ADDR']) die();
require_once 'article_template.php';

function generate($path,$n) {
	$dtd='strict';
	$has_sidebar=TRUE;
	$prettify=FALSE;
	$f=fopen($path.'/'.$n.'.article.htm','r');
	$title=trim(fgets($f));
	$keywords=trim(fgets($f));
	$options=trim(fgets($f));
	$byline=trim(fgets($f));
	$has_style=0;//0=before,1=inside,2=after
	$style='';
	$body='';
	$sidebar='';
	while (FALSE!==($l=fgets($f))) {
		if ($has_style==2) {
			$body.=$l;
		} else if ($has_style==0){
			if (FALSE===stripos($l,'<style')) $body.=$l;
			else $has_style=1;
		} else if ($has_style==1) {
			if (FALSE===stripos($l,'</style')) $style.=$l;
			else $has_style=2;
		}
	}
	fclose($f);
	if (strpos($options,'transitional')!==FALSE) $dtd='transitional';
	if (strpos($options,'no-sidebar')!==FALSE) $has_sidebar=FALSE;
	if (strpos($options,'prettify')!==FALSE) $prettify=TRUE;//google-code-prettify
	$sidebar_pos=strpos($body,'<!-- sidebar -->');
	if ($sidebar_pos!==FALSE) {
		$sidebar=substr($body,$sidebar_pos+17);
		$body=substr($body,0,$sidebar_pos);
	}
	ob_start();
	article($title,$keywords,$byline,$dtd,$has_sidebar,$prettify,$style,$body,$sidebar);
	file_put_contents($path.'/'.$n.'.htm',ob_get_clean());
}
function gdir($path) {
	$a=scandir($path);
	foreach ($a as $f) {
		$m=array();
		if (preg_match('/^(.*).article.htm$/',$f,$m)) {
			$n=$m[1];
			if (!file_exists(($path.'/'.$n.'.htm'))||filemtime($path.'/'.$n.'.article.htm')>=filemtime($path.'/'.$n.'.htm')) {
				echo $path.' '.$n.'<br/>';
				generate($path,$n);
			}
		}
	}
}

$a=scandir('.');
foreach ($a as $d) {
	if (is_dir($d)) gdir($d);
}
?>