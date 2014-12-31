<?php
/*  xxx.article.htm generates xxx.htm
title
technology
keywords
copyright
dtd,sidebar settings
<style>
style-rules
</style>
body
<!-- sidebar -->
sidebar
 */
$f=fopen($topic_file,'r');
$title=trim(fgets($f));
fgets($f);//ignore technology
fgets($f);//ignore keywords
fgets($f);//ignore copyright
fgets($f);//ignore options
$has_style=0;//0=before,1=inside,2=after
$style='';
$body='';
$sidebar='';
while (FALSE!==($l=fgets($f))) {
	if ($has_style==2) {
		$body.=$l;
	} else if ($has_style==0){
		if (FALSE===stripos($l,'<style')) $body.=$l;
		else $has_style=1;
	} else if ($has_style==1) {
		if (FALSE===stripos($l,'</style')) $style.=$l;
		else $has_style=2;
	}
}
fclose($f);
$sidebar_pos=strpos($body,'<!-- sidebar -->');
if ($sidebar_pos!==FALSE) {
	$sidebar=substr($body,$sidebar_pos+17);
	$body=substr($body,0,$sidebar_pos);
}
$title_pos=strpos($title,'-|-');
if ($title_pos!==FALSE) {
	$title=htmlspecialchars(substr($title,$title_pos+3));
	$title_h=$title.' - '.$work_title;
} else {
	$title=$title_h=$work_title;
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $title_h; ?> - 你的阳光 yoursunny.com</title>
<link rel="canonical" href="<?php echo $canonical_url; ?>"/>
<link rel="stylesheet" type="text/css" href="/images/10.css" />
<link rel="stylesheet" type="text/css" href="/images/10/a9.css" />
<script type="text/javascript" src="/lib/10.js"></script>
<script type="text/javascript" src="/lib/10/a9.js"></script>
<style type="text/css">/*<![CDATA[*/
<?php echo $style; ?>
/*]]>*/</style>
</head>
<body id="p_worka"><div class="container">

<div class="header">
<a href="/" class="logo">你的阳光</a>
<ul class="nav">
<li><a href="/m/">个人</a></li>
<li><a href="/study/">学习</a></li>
<li><a href="/t/">技术</a></li>
<li class="current"><a href="/work/">作品</a></li>
</ul>
</div>
<div class="contents"><div class="contents_maincol">

<div class="cblock a9p">
<h1 class="tit"><?php echo $title; ?></h1>
<?php echo $body; ?>

<?php
if ($sidebar!='') echo '<hr/>'.$sidebar;
?>
</div>

</div><div class="contents_sidebar">

<div class="cblock" id="work_meta">
<h2 class="tit">作品概况</h2>
<dl><dt>名称</dt><dd><a href="./"><?php echo $work_title; ?></a></dd></dl>
<dl><dt>更新日期</dt><dd><?php echo $work_updated; ?></dd></dl>
</div>

<div class="cblock">
<script type="text/javascript">//<![CDATA[
google_ad_client="pub-7124114282586774";google_ad_slot="1008272640";google_ad_width=160;google_ad_height=600;
//]]></script>
<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>
</div>

</div></div><!--/contents-->

<div class="footer">
&copy;2006-2011 yoursunny.com
<script type="text/javascript" src="/lib/10/track.js"></script>
</div>

</div>
</body>
</html>