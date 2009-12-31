<?php
$site=@$_POST['site'];
$u=@$_POST['u'];
$p=@$_POST['p'];
$msg=@$_POST['msg'].'  TweetIP http://tinyurl.com/krgu8l';
$update_api=NULL;
$update_param='status=';

if ($u=='' || $u=='username' || $p=='' || $p=='password') die('请填写用户名、密码');

switch ($site) {
	case 'twitter':
		$update_api='http://twitter.com/statuses/update.xml';
		break;
	case 'fanfou':
		$update_api='http://api.fanfou.com/statuses/update.xml';
		break;
	case 'jiwai':
		$update_api='http://api.jiwai.de/statuses/update.xml';
		break;
	case 'digu':
		$update_api='http://api.digu.com/statuses/update.xml';
		$update_param='content=';
		break;
}
if ($update_api==NULL) die('site参数无效');

$post=$update_param.urlencode($msg);
$context=array(
	'http'=>array(
		'method'=>'POST',
		'header'=>implode("\r\n",array('Content-type: application/x-www-form-urlencoded',
			'User-Agent: yoursunny.TweetIP/20090623',
			'Content-length: '.strlen($post),
			'Authorization: Basic '.base64_encode($u.':'.$p)
		)),
		'content'=>$post
	)
);
$sock=@fopen($update_api,'r',false,stream_context_create($context));
if (!$sock) die('更新失败，请检查用户名、密码是否正确');
fclose($sock);

echo '更新成功';
?>