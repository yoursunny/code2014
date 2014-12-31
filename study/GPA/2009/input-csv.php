<?php
$f=fopen($_FILES['u']['tmp_name'],'r');
$regex='/(?:(.+)[,\s]+)?(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)/';
$a=array();
while (FALSE!==($l=fgets($f))) {
	$m=array();
	$l=iconv('gbk','utf-8',$l);
	if (preg_match($regex,$l,$m)) {
		array_push($a,array('name'=>$m[1],'credit'=>floatval($m[3]),'grade'=>floatval($m[2])));
	}
}
fclose($f);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>GPA计算器 CSV/TXT上传 输入</title>
<meta name="robots" content="noindex"/>
<script type="text/javascript">//<![CDATA[
var GPA=parent.GPA;
if (!GPA) location.replace('./');
//]]></script>
</head><body>
<script type="text/javascript">//<![CDATA[
GPA.Input.current.getJSON=function() { return '<?php echo json_encode($a); ?>'; };
GPA.Input.done.defer();
//]]></script>
</body></html>