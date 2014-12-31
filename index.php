<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013.php';
//define('HAGG_URL','http://pvtapi1.yoursunny.com/web/hagg13.php');

function head_common() { ?>
<meta name="format-detection" content="telephone=no">
<style>
#hagg li { padding-bottom:2ex; padding-left:18px; text-indent:-18px; }
#hagg ul li { padding-bottom:0; padding-left:0; text-indent:0; }
#hagg .p { display:table-cell; max-width:300px; }
#hagg .t { display:table-cell; vertical-align:top; width:auto; }
#hagg .dt { color:#390; font-size:80%; white-space:nowrap; }
#hagg .evt { color:#f00; }
</style>
<?php }

/*function hagg() {
return gcached('hagg',function(){
	$ch = curl_init(HAGG_URL);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	$h = curl_exec($ch);
	curl_close($ch);
	return $h;
});}*/
function hagg() {
	return file_get_contents('../socialsync/data/hagg_firstpage.html');
}

$PR->cache_control = 'public, max-age=1800, s-maxage=600';
$PR->altlang();
switch ($_SERVER['HTTP_HOST']) {
	case 'yoursunny.com':
	case 'local.yoursunny.com':
		if (@$_GET['a']=='feed') {
			header('HTTP/1.1 404');
			die;
		} elseif (@$_GET['a']=='xrds') {
			header('Content-Type: application/xrds+xml');
			readfile('xrds.xml');
		} else {
			header('X-XRDS-Location: http://yoursunny.com/?a=xrds');
			include 'index-en.php';
		}
		break;
	case 'yoursunny.cn':
	case 'local.yoursunny.cn':
		include 'index-zh.php';
		break;
	case 'static1.tk':
	    header('Location: http://yoursunny.com/');
	    break;
	default:
		header('HTTP/1.1 404');
		break;
}
?>
