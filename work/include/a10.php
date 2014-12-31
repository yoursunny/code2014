<?php
$f=fopen($topic_file,'r');
$title=trim(fgets($f));
$options=fgets($f);

$option_fullwidth=stripos($options,'full-width')!==FALSE;
$option_prettyprint=stripos($options,'prettyprint')!==FALSE;

$state=0;//0=body,1=style,2=head
$body='';$head='';$style='';
while (FALSE!==($l=fgets($f))) {
	if ($state==0) {
		if (FALSE!==stripos($l,'<style')) $state=1;
		elseif (FALSE!==stripos($l,'<head')) $state=2;
		else $body.=$l;
	} else if ($state==1) {
		if (FALSE===stripos($l,'</style')) $style.=$l;
		else $state=0;
	} else if ($state==2) {
		if (FALSE===stripos($l,'</head')) $head.=$l;
		else $state=0;
	}
}
fclose($f);

if ($title=='') $title_h=$title=$work_title;
else { $title=htmlspecialchars($title); $title_h=$title.' - '.$work_title; }
if ($style!='') $style='<style type="text/css">/*<![CDATA[*/'."\r\n".$style.'/*]]>*/</style>'."\r\n";

function work_meta() {
	global $work_title,$work_updated;
?>
<div class="cblock" id="work_meta">
<h2 class="tit">作品概况</h2>
<dl><dt>名称</dt><dd><a href="./"><?php echo $work_title; ?></a></dd></dl>
<dl><dt>更新日期</dt><dd><?php echo $work_updated; ?></dd></dl>
</div>
<?php
}
?>
<!doctype html>
<html>
<head>
<meta http-equiv="content-type" content="text/html;charset=utf-8">
<title><?php echo $title_h; ?> - 你的阳光 yoursunny.com</title>
<link rel="canonical" href="<?php echo $canonical_url; ?>">
<link rel="stylesheet" type="text/css" href="/images/10.css">
<script type="text/javascript" src="/lib/10.js"></script>
<?php echo $style.$head; ?>
</head>
<body id="p_worka"<?php if ($option_prettyprint) echo ' onload="W.prettify()"'; ?>><div class="container">

<header><div class="header">
<a href="/" class="logo">你的阳光</a>
<nav><ul class="nav">
<li><a href="/m/">个人</a></li>
<li><a href="/study/">学习</a></li>
<li><a href="/t/">技术</a></li>
<li class="current"><a href="/work/">作品</a></li>
</ul></nav>
</div></header>

<div class="contents"><div class="contents_<?php echo $option_fullwidth?'fullwidth':'maincol'; ?>">

<section><div class="cblock a10">
<h1 class="tit"><?php echo $title; ?></h1>
<?php echo $body; ?>
</div></section>

<?php if ($option_fullwidth) work_meta(); ?>

</div><?php if (!$option_fullwidth) { ?><div class="contents_sidebar">

<?php work_meta(); ?>

<aside><div class="cblock">
<script type="text/javascript">//<![CDATA[
google_ad_client="pub-7124114282586774";google_ad_slot="1008272640";google_ad_width=160;google_ad_height=600;
//]]></script>
<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>
</div></aside>

</div><?php }//fullwidth ?></div><!--/contents-->

<footer><div class="footer">
&copy;2006-2011 yoursunny.com
<script type="text/javascript" src="/lib/10/track.js"></script>
</div></footer>

</div>

</body>
</html>