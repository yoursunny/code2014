<?php
$result_action=1;//1=report_failure,2=continue,3=process_csv
$result_data=NULL;$result_msg='';
$fileext=strtoupper(preg_replace('/^(?:[^\.]*\.)*/','',$_FILES['u']['name']));
$filename=$_FILES['u']['tmp_name'];
$f=file_get_contents($filename);

//guess encoding and convert to utf-8
define('GUESS_ENCODING_GUID','5b2c0374-0cca-481b-8eee-089f172d19f6');
$f_iconv=@iconv('gbk','utf-8',$f.GUESS_ENCODING_GUID);
if ($f_iconv!==FALSE && strpos($f_iconv,GUESS_ENCODING_GUID)!==FALSE) {//file was GBK because transform succeeded and nothing truncated
	$f=substr($f_iconv,0,strlen($f_iconv)-strlen(GUESS_ENCODING_GUID));
}

//file type handlers
function import_html2010($v=0) {//import v2010 html report
	//$v: 0=original, 1=with groups
	global $f,$result_action,$result_data,$result_msg;
	$state=2;//2=before_course, 3=in_course, 4=after_course
	$courses=array();
	foreach (explode("\r\n",$f) as $l) {
		switch ($state) {
			case 2:
				if ($l=='<tbody>') {
					$state=3;
				}
				break;
			case 3:
				if ($l=='</tbody>') {
					$state=4;
				} else {
					$la=explode('</td><td>',str_replace(array('<tr><td>','</td></tr>'),'',$l));
					$C=array(
						'selected'=>strpos($la[0],'√')!==FALSE,
						'name'=>htmlspecialchars_decode($la[1]),
						'credit'=>floatval($la[2]),
						'grade'=>$la[3],
						'groups'=>''
					);
					if ($v>=1 && $la[6]!='&nbsp;') {
						$C['groups']=htmlspecialchars_decode($la[6]);
					}
					$courses[]=$C;
				}
				break;
		}
		if ($state==4) break;
	}
	$result_action=2;
	$result_data=array(
		'courses'=>$courses
	);
}
function import_xhtml2009() {//import v2009 xhtml report
	global $f,$result_action,$result_data,$result_msg;
	$state=1;//1=before_alg, 2=before_course, 3=in_course, 4=after_course
	//$alg_js='';
	$courses=array();
	foreach (explode("\r\n",$f) as $l) {
		switch ($state) {
			case 1:
				if (strpos($l,'<div id="algorithm"')!==FALSE) {
					//$alg_js=str_replace('&apos;','"',strip_tags($l));
					$state=2;
				}
				break;
			case 2:
				if (strpos($l,'<tr><th>选中</th><th>')!==FALSE) {
					$state=3;
				}
				break;
			case 3:
				if (strpos($l,'</table>')!==FALSE) {
					$state=4;
				} else {
					$la=explode('</td><td>',$l);
					$courses[]=array(
						'selected'=>substr($la[0],strlen($la[0])-1)=='1',
						'name'=>$la[1],
						'credit'=>floatval($la[4]),
						'grade'=>floatval($la[3])
					);
				}
				break;
		}
		if ($state==4) break;
	}
	$result_action=2;
	$result_data=array(
		//'alg'=>$alg_js,
		'courses'=>$courses
	);
}
function import_csvtxt() {//import csv or txt file
	global $f,$result_action,$result_data,$result_msg;
	$a=explode("\n",str_replace("\r",'',$f));
	$a=array_filter($a);
	$result_action=3;
	$result_data=$a;
}

//guess file type and call handler
if (strpos($f,'617319db-7ba0-4aa3-8bb2-f2dc0cecfd4d')!==FALSE) {
	import_html2010();
} elseif (strpos($f,'8b75b07b-e9f8-44b2-93b3-75add8c1726d')!==FALSE) {
	import_html2010(1);
} elseif (strpos($f,'阳光GPA计算器 - XHTML报表')!==FALSE) {
	import_xhtml2009();
} elseif ($fileext=='CSV' || $fileext=='TXT') {
	import_csvtxt();
} else {
	$result_msg='不能识别上传的文件格式';
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
<SCRIPT TYPE="text/javascript">//<![CDATA[
var GPA=parent.GPA;
if (!GPA) location.replace('./');
GPA.imp.file.handleResult(<?php echo $result_action.',('.json_encode($result_data).'),"'.$result_msg.'"'; ?>);
//]]></SCRIPT>
</BODY>
</HTML>