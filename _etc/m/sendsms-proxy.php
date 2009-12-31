<?php
$o=json_decode(file_get_contents('php://input'),TRUE);
$url=$o['url'];
if (substr($url,0,6)=='https:') $url='http:'.substr($url,6);
$post=$o['body'];
$exheaders=$o['headers'];
$headers=array();
foreach ($exheaders as $exheaders_k=>$exheaders_v) $headers[]=$exheaders_k.': '.$exheaders_v;
$method='GET';
if ($post!='') {
	$headers[]='Content-Length: '.strlen($post);
	$method='POST';
}
$context=array(
	'http'=>array(
		'method'=>$method,
		'header'=>implode("\r\n",$headers),
		'content'=>$post
	)
);
$sock=@fopen($url,'r',false,stream_context_create($context));
if (!$sock) die();
$response_header=array();
foreach ($http_response_header as $response_header_line) {
	$response_header_a=explode(':',$response_header_line);
	if (count($response_header_a)==2) {
		$response_header[$response_header_a[0]]=trim($response_header_a[1]);
	}
}
$result='';
while (!feof($sock)) $result.=fgets($sock, 4096);
fclose($sock);
$o=array('headers'=>$response_header,'body'=>$result);
echo json_encode($o);
?>