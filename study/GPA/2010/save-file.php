<?php
$eml=@$_POST['mode']=='email';
$format=$_POST['format'];

parse_str($_POST['data'],$data);
$courses=array();
foreach (explode('|',$data['courses']) as $l_course) {
	parse_str($l_course,$course);
	$courses[]=$course;
}

if ($eml) {
	ob_start();
} else {
	header('Content-Disposition: attachment; filename=GPA.'.$format);
	header('Content-Type: application/octet-stream');
}

switch ($format) {
	case 'htm':
		include 'save-html.php';
		break;
	case 'csv':
		include 'save-csv.php';
		break;
	//case 'xlsx':
	//	{
	//		$ch=curl_init('http://n.65536.cn/yoursunny/GPA_save-xlsx.ashx');
	//		curl_setopt($ch,CURLOPT_POST,1);
	//		curl_setopt($ch,CURLOPT_POSTFIELDS,array('data'=>$_POST['data']));
	//		curl_exec($ch);
	//		curl_close($ch);
	//	}
	//	break;
}

if ($eml) {
	$p_to=$_POST['email'];
	$p_subject='阳光GPA计算器 '.date('Y-m-d H:i:s');
	$p_body='感谢使用阳光GPA计算器 http://yoursunny.com/study/GPA/';
	$p_filename='GPA.'.$format;
	$p_filebody=base64_encode(ob_get_clean());
	$hash=sha1($p_to.$p_subject.$p_body.$p_filename.$p_filebody.'494a1f91-6c07-436d-92b6-25fdf90bca5a');
} else {
	exit;
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<HTML>
<HEAD>
<META HTTP-EQUIV="content-type" CONTENT="text/html;charset=utf-8">
<TITLE></TITLE>
<META NAME="robots" CONTENT="noindex,follow">
</HEAD>
<BODY>
<FORM ID="F" ACTION="http://yoursunny-app.appspot.com/study/GPA/save-email.cgi" METHOD="post">
<INPUT TYPE="hidden" NAME="to" VALUE="<?php echo htmlspecialchars($p_to); ?>">
<INPUT TYPE="hidden" NAME="subject" VALUE="<?php echo htmlspecialchars($p_subject); ?>">
<INPUT TYPE="hidden" NAME="body" VALUE="<?php echo htmlspecialchars($p_body); ?>">
<INPUT TYPE="hidden" NAME="filename" VALUE="<?php echo htmlspecialchars($p_filename); ?>">
<INPUT TYPE="hidden" NAME="filebody" VALUE="<?php echo htmlspecialchars($p_filebody); ?>">
<INPUT TYPE="hidden" NAME="hash" VALUE="<?php echo htmlspecialchars($hash); ?>">
</FORM>
<SCRIPT TYPE="text/javascript">//<![CDATA[
document.getElementById('F').submit();
//]]></SCRIPT>
</BODY>
</HTML>