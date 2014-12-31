<?php
$f=fopen($topic_file,'r');
switch ($topic_a9) {
	case 'single':
		fgets($f);//ignore course_title
		$title=trim(fgets($f));
		fgets($f);//ignore keywords
		fgets($f);//ignore options
		break;
	case 'multi':
		$startline='<!--#PAGE '.$topic_key.'-->';
		while (FALSE!==($l=fgets($f))) {
			if (trim($l)==$startline) break;
		}
		if ($l===FALSE) {
			header('HTTP/1.1 404 Content Not Found');
			exit;
		}
		$title=trim(fgets($f));
		fgets($f);//ignore keywords
		break;
}
$found=3;
$body='';$style='';
while (FALSE!==($l=fgets($f))) {
	switch ($found) {
		case 3://current line is body
			if (strpos($l,'<style')!==FALSE) $found=5;
			elseif (strpos($l,'<!--#PAGE')===0) $found=6;
			else $body.=$l;
			break;
		case 5://current line is style
			if (strpos($l,'</style>')!==FALSE) $found=3;
			else $style.=$l;
	}
	if ($found==6) break;
}
fclose($f);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $title_h=htmlspecialchars($title); echo ' - '.$course_title; ?> - 你的阳光 yoursunny.com</title>
<link rel="canonical" href="<?php echo $canonical_url; ?>"/>
<link rel="stylesheet" type="text/css" href="/images/10.css" />
<link rel="stylesheet" type="text/css" href="/images/10/a9.css" />
<script type="text/javascript" src="/lib/10.js"></script>
<script type="text/javascript" src="/lib/10/a9.js"></script>
<style type="text/css">/*<![CDATA[*/
<?php echo $topic_basestyle.$style; ?>
/*]]>*/</style>
</head>
<body id="p_studya"><div class="container">

<div class="header">
<a href="/" class="logo">你的阳光</a>
<ul class="nav">
<li><a href="/m/">个人</a></li>
<li class="current"><a href="/study/">学习</a></li>
<li><a href="http://www.65536.cn/t/">技术</a></li>
<li><a href="http://www.65536.cn/work/">作品</a></li>
</ul>
</div>
<div class="contents"><div class="contents_maincol">

<div class="cblock a9p">
<h1 class="tit"><?php echo $title_h; ?></h1>
<?php echo $body; ?>

<?php echo $topic_byline; ?>
<p id="course_link">返回《<a href="./"><?php echo $course_title; ?></a>》课程主页</p>
</div>

</div><div class="contents_sidebar">

<div class="cblock" id="course_meta">
<h2 class="tit">课程概况</h2>
<dl><dt>代码</dt><dd><?php echo $course_code; ?></dd></dl>
<dl><dt>名称</dt><dd><a href="./"><?php echo $course_title; ?></a></dd></dl>
<dl><dt>教师</dt><dd><?php echo $course_teachers; ?></dd></dl>
</div>

<div class="cblock">
<script type="text/javascript">//<![CDATA[
google_ad_client="pub-7124114282586774";google_ad_slot="1008272640";google_ad_width=160;google_ad_height=600;
//]]></script>
<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>
</div>

</div></div><!--/contents-->

<div class="footer">
&copy;2006-2010 yoursunny.com
<script type="text/javascript" src="/lib/10/track.js"></script>
</div>

</div>
</body>
</html>