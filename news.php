<?php
require_once 'common.php';
$db->query_sql('SELECT title,content FROM news WHERE id='.$_GET['n']);#vulnerable to SQL injection here
$row=$db->read();
if ($row==NULL) $row=array('title'=>'错误信息','content'=>'新闻不存在');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo htmlspecialchars($row['title']); ?> - simple_news</title>
<link rel="stylesheet" type="text/css" href="/style.css" />
</head><body>

<h1><?php echo htmlspecialchars($row['title']); ?></h1>
<div>
<?php echo nl2br(htmlspecialchars($row['content'])); ?>
</div>

</body></html>