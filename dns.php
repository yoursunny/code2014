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
}
header("Location: http://$u");exit;

function yoursunny($k) {
	global $u;
switch ($k) {
	//case 'aspx': return 'yoursunny.com/aspx/';	
	case 'm': return 'www.65536.cn/m/';
	case 'nhce': return 'yoursunny.com/nhce/';
	case 'blog': return 'sunnypower.blogspot.com/';
	case 't': return 'yoursunny.com/transfer/';
	case 'www': return 'yoursunny.com/';
	case 'lied': return 'sunnypower.blogspot.com/2006/06/blog-post';
	case 'e': return 'www.blog.edu.cn/user3/yoursunny/archives/2006/1390893.shtml';
	case 'bbs': return 'groups.google.com/group/yoursunny';
	case 'threads': return 'yoursunny.BlogSpot.com/';
	case 'tgw': return 'ourhome.sjtu.edu.cn/bbs/?index=tgw/';
	case 'pm': return 'docs.google.com/View?docid=dgstq2hq_80dwp7hm';
	case 'live': return 'yoursunny.spaces.live.com/';
	case 'photo': return 'pp.sohu.com/member/yoursunny';
	default: return 'yoursunny.com/';
}
}

function iloveu4ever($k)
{
	return 'yoursunny.com/';
}
?>