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
<style type="text/css">/*<![CDATA[*/
table { border-left:solid 1px #9cf; border-top:solid 1px #9cf; border-collapse:collapse; }
th,td { border-right:solid 1px #9cf; border-bottom:solid 1px #9cf; }
/*]]>*/</style>
</head><body>
<h1><?php echo $site; ?> / <?php echo $user; ?></h1>
<table>
<tr><th>时间</th><th>内容</th><th>设备</th></tr>
<?php
function microblog_tweet($o) {
	if (!isset($o['dt'])) return;
	echo '<tr>';
	echo '<td class="dt"><a href="'.htmlspecialchars($o['u']).'">'.date('Y-m-d H:i:s',intval($o['dt'])).'</a></td>';
	echo '<td class="t">'.htmlspecialchars($o['t']).'</td>';
	echo '<td class="via">'.htmlspecialchars($o['via']).'</td>';
	echo '</tr>'."\r\n";
}
backuplet_datalines('microblog_tweet');
?>
</table>
<p><a href="http://www.65536.cn/work/2009/backuplet/">backuplet</a>书签式网站导出/备份工具</p>
</body></html>