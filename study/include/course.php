<?php
require_once $_SERVER["DOCUMENT_ROOT"].'/include/10.php';

if (!isset($course_key)) {
	if (!preg_match('/study\/([A-Z0-9]+)/',$_SERVER['REQUEST_URI'],$m)) {
		if (preg_match('/study\/([A-Z0-9]+)/i',$_SERVER['REQUEST_URI'],$m2)) {
			header('Location: /study/'.strtoupper($m2[1]));
			header('HTTP/1.1 301');
		} else {
			header('HTTP/1.1 404 Course Not Found');
		}
		exit;
	}
	$course_key=$m[1];
}
$cx=simplexml_load_file('../'.$course_key.'/course.xml');

$course_title=htmlspecialchars($cx->title);
$course_teachers=array();
foreach ($cx->teacher as $x_teacher) $course_teachers[]=strval($x_teacher);
$course_teachers=implode(' ',$course_teachers);
$course_code=array();
foreach ($cx->code as $x_code) $course_code[]=strval($x_code);
$course_code=count($course_code)==0?$course_key:implode(' ',$course_code);

$topic_a=array();

foreach ($cx->topic as $x_topic) {
	switch ($x_topic['t']) {
		case 'a9single':
			$topic_q=strval($x_topic['q']);
			$topic_v=strval($x_topic['v']);
			$topic_a[]=array('?'.$topic_q.'='.$topic_v,$x_topic);
			if (@$_GET[$topic_q]==$topic_v) {
				$topic_file='../'.$course_key.'/'.$topic_v.'.article.htm';
				$topic_basestyle='';
				$topic_byline='';
				$canonical_url='http://yoursunny.com/study/'.$course_code.'/?'.$topic_q.'='.$topic_v;
				$topic_a9='single';
				include 'a9.php';
				exit;
			}
			break;
		case 'a9multi':
			$topic_q=strval($x_topic['q']);
			$topic_v=strval($x_topic['v']);//query value for index page
			$topic_a[]=array('?'.$topic_q.'='.$topic_v,$x_topic);
			if (isset($_GET[$topic_q])) {
				$topic_file='../'.$course_key.'/'.strval($x_topic['f']);
				$topic_key=$_GET[$topic_q];
				$topic_basestyle=@strval($x_topic->basestyle);
				$topic_byline=str_replace(']] >',']]>',@strval($x_topic->byline));
				$canonical_url='http://yoursunny.com/study/'.$course_code.'/?'.$topic_q.'='.$topic_key;
				$topic_a9='multi';
				include 'a9.php';
				exit;
			}
			break;
		case 'gdoc10'://Google Docs saved file
			$topic_q=strval($x_topic['q']);
			$topic_v=strval($x_topic['v']);
			$topic_a[]=array('?'.$topic_q.'='.$topic_v,$x_topic);
			if (@$_GET[$topic_q]==$topic_v) {
				$topic_file='../'.$course_key.'/'.$topic_v.'.gdoc.htm';
				$topic_title=strval($x_topic->title);
				$canonical_url='http://yoursunny.com/study/'.$course_code.'/?'.$topic_q.'='.$topic_v;
				include 'gdoc10.php';
				exit;
			}
			break;
		case 'redirect':
			$topic_url=strval($x_topic['url']);
			$topic_a[]=array($topic_url,$x_topic);
			break;
	}
}
if ($_SERVER['QUERY_STRING']!='') {
	header('Location: /study/'.$course_key.'/');
	exit;
}

$download_list=nl2br(trim(htmlspecialchars($cx->download)));
$recommend=trim(preg_replace('/<\/?recommend[^>]*>/','',$cx->recommend->asXML(),2));
$topic_list='';
foreach ($topic_a as $topic_en) {
	$x_homelink=$topic_en[1]->homelink;
	if (count($x_homelink)<1) continue;
	$x_homelink_a=$x_homelink->a;
	$topic_url=$topic_en[0][0]=='?'?'./'.$topic_en[0]:$topic_en[0];
	if (count($x_homelink_a)>0) {
		$x_homelink_a['href']=$topic_url;
		$topic_list.='<li>'.trim(preg_replace('/<\/?homelink[^>]*>/','',$x_homelink->asXML(),2)).'</li>';
	} else {
		$topic_list.='<li><a href="'.$topic_url.'">'.trim(preg_replace('/<\/?homelink[^>]*>/','',$x_homelink->asXML(),2)).'</a></li>';
	}
}
if ($topic_list!='') {
	$topic_list='<ul id="topic_list">'.$topic_list.'</ul>';
}

include 'index_html5.htm';

?>