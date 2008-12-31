<?php
# google_docs.php/<docid>.js?<callback>
header('Content-Type: text/javascript');
echo "//Google Docs -> JavaScript 转换脚本\n// 你的阳光 http://yoursunny.com\n";
$url_search=array();
if (preg_match('/google_docs.php\/(.*)\.js\?(.+)$/',$_SERVER["REQUEST_URI"],$url_search)!=1) die;
$docid=$url_search[1];
$callback=$url_search[2];
$cache_file='google_docs.cache/'.$docid.'.json';
if (file_exists($cache_file)&&(time()-filemtime($cache_file)<600)) {
	echo $callback.'('.file_get_contents($cache_file).')';
	exit;
}
$p=file_get_contents('http://docs.google.com/View?id='.$docid);
$html=str_replace("\n",'',$p);
$title='';
$title_search=array();
if (preg_match('/<title>(.*)<\/title>/',$html,$title_search)==1) $title=$title_search[1];
$body='';
$body_search=array();
if (preg_match('/id="doc-contents">(.*)<\/div>\\s*<div id="google-view-footer">/',$html,$body_search)==1) {
	$body=$body_search[1];
	$body=preg_replace('/<(.+?)="(Doc|View|File)\?(id|docid)=([a-z0-9A-Z_]+)"(.*?)>/','<\\1="http://docs.google.com/\\2?\\3=\\4"\\5>',$body);
}
$json=json_encode(array('id'=>$docid,'title'=>$title,'body'=>$body));
echo $callback.'('.$json.')';
file_put_contents($cache_file,$json);
?>