<?php
header('HTTP/1.1 404 Not Found');
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>您访问的页面地址不正确，文件找不到</title>
</head>
<body>
<p>【你的阳光】网站提醒您：<br />
您访问的页面地址不正确，文件找不到。也许是你正在寻找的资料、功能已经关闭了。</p>
<?php
$my_sites=array('yoursunny','sunnypower','65536','openxml');
$search_engines=array('google','baidu','yahoo','msn','live');
$r=''.@$_SERVER['HTTP_REFERER'];
if ($r=='') {
?>
<p>你似乎是从收藏夹或直接键入地址来到本页的。请注意本站的文件名是区分大小写的。</p>
<?php
} else {
	$r_url=parse_url($r);
	$r_host=$r_url['host'];
	$is_my_site=FALSE;
	foreach ($my_sites as $k) {
		if (stripos($r_host,$k)) $is_my_site=TRUE;
	}
	if ($is_my_site) {
?>
<p>你似乎是从我的网站或博客点击来到本页的。你的来源地址已被记录，我会去修正链接。</p>
<?php
	}
	$is_search_engine=FALSE;
	foreach ($search_engines as $k) {
		if (stripos($r_host,$k)) $is_search_engine=TRUE;
	}
	//非搜索入站的，记录来源地址
	if (!$is_search_engine && strpos(file_get_contents($_SERVER['DOCUMENT_ROOT'].'/404.txt'),' '.$_SERVER['REQUEST_URI'].' ')===FALSE)
		file_put_contents($_SERVER['DOCUMENT_ROOT'].'/404.txt',date('Y-m-d H:i:s ').$_SERVER['REMOTE_ADDR'].' '.$_SERVER['REQUEST_URI'].' '.$r."\r\n",FILE_APPEND);
}
?>
<form action="http://www.google.com/cse" id="cse-search-box">
请告诉我，你想找什么资料？
<input type="hidden" name="cx" value="016439686750744889237:i6z5lva1ths" />
<input type="hidden" name="ie" value="UTF-8" />
<input type="text" name="q" size="31" />
<input type="submit" name="sa" value="马上为你奉上" />
</form>
<p align="right">阳光男孩</p>
<script type="text/javascript" src="http://www.google.com/coop/cse/brand?form=cse-search-box&lang=en"></script>
</body>
</html>
