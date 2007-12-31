<?php

if (strpos($_SERVER['HTTP_USER_AGENT'],'MSIE')!==FALSE) header('Location: http://feed.feedsky.com/yoursunny-listen');

$doc = new DOMDocument();
$xsl = new XSLTProcessor();
$doc->load('view.xsl');
$xsl->importStyleSheet($doc);
$doc->load('http://feed.feedsky.com/yoursunny-listen');
echo $xsl->transformToXML($doc);

?> 