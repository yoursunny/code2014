<?php
/*  xxx.article.htm generates xxx.htm
course_name
article_title
keywords
dtd,ad settings
 */
if ($_SERVER['REMOTE_ADDR']!=$_SERVER['SERVER_ADDR']) die();
require_once 'topic.php';
$course_name='';

function generate($path,$n) {
	global $course_name;
	$dtd='strict';
	$sidebar_ad=TRUE;
	$f=fopen($path.'/'.$n.'.article.htm','r');
	$course_name=trim(fgets($f));
	$title=trim(fgets($f));
	$keywords=trim(fgets($f));
	$options=trim(fgets($f));
	if (strpos($options,'transitional')!==FALSE) $dtd='transitional';
	if (strpos($options,'no-ad')!==FALSE) $sidebar_ad=FALSE;
	$o=fopen('article_generate.tmp','w');
	fwrite($o,"<!--#PAGE t-->\r\n".$title."\r\n".$keywords."\r\n");
	while (!feof($f)) fwrite($o,fread($f,1024));
	fclose($f); fclose($o);
	ob_start();
	topic('article_generate.tmp','t','','',$dtd,$sidebar_ad);
	unlink('article_generate.tmp');
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