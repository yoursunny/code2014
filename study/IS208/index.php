<?php
if (isset($_GET['w'])) {
	$w=$_GET['w'];
	if ($w[0]=='r') {
		$w=intval(substr($w,1));
		if (in_array($w,array(4,6,7,8))) {
			$w='r'.$w;
			$h=file_get_contents($w.'.htm');
			$h=str_ireplace(
				array('</head>','</body>','w.css'),
				array(
					'<link rel="canonical" href="http://yoursunny.com/study/IS208/?w='.$w.'"/></head>',
					'<p>返回<a href="http://yoursunny.com/study/IS208/" target="_blank">数字系统设计</a>课程主页</p><script type="text/javascript" src="/lib/10/track.js"></script></body>',
					'r.css'
				),
				$h
			);
			echo $h;
			exit;
		}
	}
	$w=intval($w);
	if ($w>=1&&$w<=18) {
		$w=sprintf('%02d',$w);
		$h=file_get_contents($w.'.htm');
		$h=str_ireplace(
			array('</head>','</body>'),
			array(
				'<link rel="canonical" href="http://yoursunny.com/study/IS208/?w='.$w.'"/></head>',
				'<p>返回<a href="http://yoursunny.com/study/IS208/" target="_blank">数字系统设计</a>课程主页</p><script type="text/javascript" src="/lib/10/track.js"></script></body>'
			),
			$h
		);
		echo $h;
		exit;
	}
	if ($w==0) {
		readfile('w.htm');
		exit;
	}
}

include '../include/course.php';
?>