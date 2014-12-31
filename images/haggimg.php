<?php
define('HASHKEY','Dp3y.ALteDFJrDB2');
//error_reporting(E_ALL);ini_set('display_errors',1);
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013.php';

function base64url_decode($data) { 
	return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT)); 
}

function parsereq(&$hash) {
	if (!preg_match('/([0-9a-zA-Z\-\_]+)\/([0-9a-f]{32})\.jpg/',$_SERVER['PATH_INFO'],$m)) return FALSE;
	$reqjson = $m[1];
	$hash = $m[2];
	if (md5(HASHKEY.$reqjson)!=$hash) return FALSE;
	$req = json_decode(base64url_decode($reqjson),TRUE);
	return $req;
}

function getorig($url) {
	$origblob = @file_get_contents($url);
	if (!$origblob) return FALSE;
	return @imagecreatefromstring($origblob);
}

function resize($origim,$req) {
	$w = imagesx($origim); $h = imagesy($origim);
	if (isset($req['w'])) {
		$width = $req['w'];
		if (isset($req['h'])) {
			$height = $req['h'];
			if (@$req['crop']) {
				$ratio = max($width/$w, $height/$h);
				$h = $height / $ratio;
				$x = ($w - $width / $ratio) / 2;
				$w = $width / $ratio;
			} else {
				$ratio = min($width/$w, $height/$h);
				$width = $w * $ratio;
				$height = $h * $ratio;
				$x = 0;
			}
		}
	}
	$im = imagecreatetruecolor($width, $height);
	imagecopyresampled($im,$origim,0,0,$x,0,$width,$height,$w,$h);
	return $im;
}

function improve($blob) {
	$ch = curl_init('http://pubapi.appspot.com/photoimprove');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, 'image='.urlencode(base64_encode($blob)));
	$resp = curl_exec($ch);
	curl_close($ch);
	return ($resp !== FALSE) ? $resp : $blob;
}

function blankimg() {
	return base64_decode('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==');
}

function prepare($req) {
	$origim = getorig($req['url']);
	if ($origim===FALSE) return FALSE;
	$im = resize($origim,$req);
	ob_start();
	imagejpeg($im,NULL,100);
	$improved = improve(ob_get_clean());
	$imimp = imagecreatefromstring($improved);
	ob_start();
	imagejpeg($imimp,NULL,50);
	$blob = ob_get_clean();
	imagedestroy($origim); imagedestroy($im); imagedestroy($imimp);
	return $blob;
}

header('Content-Type: image/jpeg');
if (FALSE===($req=parsereq($hash))) { echo blankimg(); die; }

list($time,$etag,$blob) = gcached('haggimg_'.$hash,function()use($req){
	$blob = prepare($req);
	return array(time(),md5($blob),$blob);
},86400);

if ($blob==FALSE) {
	$blob = blankimg();
	$etag = 'blank';
}
header('Last-Modified: '.date('r',$time));
header('ETag: '.$etag);
header('Content-Length: '.strlen($blob));
echo $blob;

?>
