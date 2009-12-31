<?php
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename=fanfou.htm');
$uid=htmlspecialchars($_POST['u']);
$a=json_decode($_POST['j']);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $uid; ?> - 饭否备份工具</title>
<style type="text/css">/*<![CDATA[*/
table { border-left:solid 1px #9cf; border-top:solid 1px #9cf; border-collapse:collapse; }
th,td { border-right:solid 1px #9cf; border-bottom:solid 1px #9cf; }
/*]]>*/</style>
</head><body>
<h1>饭否 - <?php echo $uid; ?></h1>
<table>
<tr><th>时间</th><th>编号</th><th>内容</th><th>设备</th></tr>
<?php
for ($i=0,$len=count($a);$i<$len;++$i) {
	$o=$a[$i];
	echo '<tr>';
	echo '<td class="created_at">'.htmlspecialchars($o->created_at).'</span>';
	echo '<td class="id">'.htmlspecialchars($o->id).'</span>';
	echo '<td class="text">'.htmlspecialchars($o->text).'</span>';
	echo '<td class="source">'.htmlspecialchars($o->source).'</span>';
	echo '</tr>'."\r\n";
}
?>
</table>
<p><a href="http://www.65536.cn/work/2009/fanfou/">饭否备份工具</a></p>
</body></html>