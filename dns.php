<?php
$h=$_REQUEST['s'];
$s=explode('.',$h,2);
$u='yoursunny.com';
switch ($s[1])
{
	case 'yoursunny.com':
		$u=yoursunny($s[0]);break;
	case 'iloveu4ever.cn':
		$u=iloveu4ever($s[0]);break;
	case '65536.cn':
		$u=cn65536($s[0]);break;
	case 'yoursunny.cn':
		$u=yoursunny_cn($s[0]);break;
}
header("Location: http://$u");exit;

function yoursunny($k) {
	global $u;
switch ($k) {
	case 'www': return 'yoursunny.com/';
	case 'm': return 'yoursunny.com/m/';
	case 'blog': return 'yoursunny.com/m/blog.htm';
	case 'threads': return 'threads.blogs.io/';
	case 'study': return 'yoursunny.com/study/';
//	case 'ent': return 'yoursunny.com/ent/';
	case 'listen': return 'feed.feedsky.com/yoursunny-listen';
	case 'nhce': return 'yoursunny.com/study/EN001/';
	case 'lied': return 'yoursunny.com/study/MU019/';
	case 'e': return 'www.blog.edu.cn/user3/yoursunny/archives/2006/1390893.shtml';
	case 'live': return 'yoursunny.spaces.live.com/';
	case 'photo': return 'pp.sohu.com/member/yoursunny';
	case '5star': return 'yoursunny.com/storage/5star2007.htm';
	case '13651996435': return 'yoursunny.com/m/mobile.htm';
	default: return 'yoursunny.com/';
}
}

function iloveu4ever($k)
{
	return 'yoursunny.com/';
}

function cn65536($k)
{
	return 'yoursunny.com/';
}

function yoursunny_cn($k)
{
	return 'yoursunny.com/';
}
?>