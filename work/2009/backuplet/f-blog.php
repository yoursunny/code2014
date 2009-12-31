<?php
require_once 'f-common.php';
backuplet_init();
$site=htmlspecialchars($_GET['site']);
$user=htmlspecialchars($_GET['user']);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $site; ?> / <?php echo $user; ?></title>
</head><body>
<h1><?php echo $site; ?> / <?php echo $user; ?></h1>
<ul>
<?php
function blog_title($o) {
	if (!isset($o['dt'])) return;
	echo '<li><a href="#'.sha1($o['u']).'">'.htmlspecialchars($o['t']).'</a></li>'."\r\n";
}
backuplet_datalines('blog_title');
?>
</ul>
<hr/>
<?php
function blog_entry($o) {
	if (!isset($o['dt'])) return;
	echo '<h2><a name="'.sha1($o['u']).'" href="'.htmlspecialchars($o['u']).'">'.htmlspecialchars($o['t']).'</a></h2>'."\r\n";
	echo '<div class="byline"><span class="dt">'.date('Y-m-d H:i:s',intval($o['dt'])).'</span> <span class="cate">'.htmlspecialchars(implode(' ',explode('|',$o['cate']))).'</span></div>'."\r\n";
	echo '<div class="content">'.($o['isHTML']==1?$o['content']:htmlspecialchars($o['content'])).'</div>';
	echo '<hr/>'."\r\n\r\n";
}
backuplet_datalines('blog_entry');
?>
<p><a href="http://www.65536.cn/work/2009/backuplet/">backuplet</a>书签式网站导出/备份工具</p>
</body></html>