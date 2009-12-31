<?php
$server='202.120.2.2';
$user='kchen';
$pass='public';
$path='upload/';
$title='下一代网络与软交换';
$description='陈凯FTP上传目录';
$linkbase='ftp://kchen:public@202.120.2.2/upload/';

define('FTPFEED_VERSION','2008-06-12');

$conn=ftp_connect($server);
ftp_login($conn,$user,$pass);
ftp_pasv($conn,TRUE);
$list=ftp_nlist($conn,iconv('utf-8','gbk',$path));
ftp_close($conn);

header('Content-Type: application/xml');
$x=new XMLWriter;
$x->openURI('php://output');
$x->startDocument();
$x->startElement('rss');
$x->writeAttribute('version','2.0');
$x->startElement('channel');
$x->writeElement('title',$title);
$x->writeElement('link',$linkbase);
$x->writeElement('description',$description);
$x->writeElement('generator','yoursunny FtpFeed '.FTPFEED_VERSION);
foreach ($list as $file) {
	$f=basename($file);
	$x->startElement('item');
	$x->writeElement('title',iconv('gbk','utf-8',$f));
	$x->writeElement('link',$linkbase.urlencode($f));
	$x->endElement();
}
$x->endElement();
$x->endElement();
$x->endDocument();
$x->flush();
?>
