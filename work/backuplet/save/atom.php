<?php
require_once 'config.php';
$sid=$_GET['sid'];
if (!is_sid($sid)) die('invalid sid');
$txtfile=getfilename($sid);$xmlfile=getfilename($sid,'.xml');
if (!file_exists($txtfile)) die('unknown sid');

header('Content-Type: text/xml');
//header('Content-Type: application/octet-stream');
//header('Content-Disposition: attachment; filename='.$sid.'.xml');

if (file_exists($xmlfile) && filemtime($xmlfile)>filemtime($txtfile)) {
	readfile($xmlfile);
	exit;
}

$a=file($txtfile);
if (count($a)<1) exit;
parse_str(trim(array_shift($a)),$feed);

$x=new XMLWriter;
$x->openMemory();
$x->startDocument();
$x->startElement('feed');
$x->writeAttribute('xmlns','http://www.w3.org/2005/Atom');

if (isset($feed['microblog:'])) $x->writeAttribute('xmlns:microblog','http://yoursunny.com/work/backuplet/?schema=microblog');
if (isset($feed['blog:'])) $x->writeAttribute('xmlns:blog','http://yoursunny.com/work/backuplet/?schema=blog');

$x->writeElement('id','http://yoursunny.com/work/backuplet/?sid='.$sid);
$x->writeElement('title',$feed['title']);
$x->startElement('author');
$x->writeElement('name',$feed['author/name']);
$x->endElement();//author
$x->startElement('generator');
$x->writeAttribute('uri','http://yoursunny.com/work/backuplet/');
$x->text('backuplet');
$x->endElement();//generator

$feed_attrs=array('microblog:bio','microblog:location','microblog:web');
foreach ($feed_attrs as $feed_attr) {
	if (isset($feed[$feed_attr]))
		$x->writeElement($feed_attr,$feed[$feed_attr]);
}

foreach ($a as $entry_l) {
	$x->startElement('entry');
	parse_str(trim($entry_l),$entry);
	$x->writeElement('id',$entry['id']);
	$x->writeElement('title',$entry['title']);
	$x->writeElement('updated',$entry['updated']);

	if (isset($entry['link/href'])) {
		$x->startElement('link');
		$x->writeAttribute('rel','alternate');
		$x->writeAttribute('href',$entry['link/href']);
		$x->endElement();//link
	}

	if (isset($entry['microblog:via'])) $x->writeElement('microblog:via',$entry['microblog:via']);

	if (isset($entry['content'])) {
		$x->startElement('content');
		if (isset($entry['content:type'])) $x->writeAttribute('type',$entry['content:type']);
		$x->writeCData($entry['content']);
		$x->endElement();//content
	}
	
	$x->endElement();//entry
}

$x->endElement();//feed
$x->endDocument();
$xml=$x->outputMemory();

file_put_contents($xmlfile,$xml);
echo $xml;

?>