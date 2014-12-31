<?php
header('Content-Type: text/html; charset=utf-8');

$h=file_get_contents($topic_file);

$h=preg_replace('/\<title\>[^<]*\<\/title\>/i','',$h,1);

$h=str_ireplace(
	array('</head>','</body>'),
	array(
		'<title>'.htmlspecialchars($topic_title).' - '.$course_title.' - 你的阳光 yoursunny.com</title><link rel="canonical" href="'.$canonical_url.'"></head>',
		'<p>返回<a href="./">'.$course_title.'</a>课程主页</p><script type="text/javascript" src="/lib/10/track.js"></script></body>'
	),
	$h
);


echo $h;
?>
