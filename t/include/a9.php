<?php
/*
key.article.htm
line 1: title
line 2: keywords (ignored)
line 3: options - 'prettify'
line 4: byline
<style>
stylesheet
</style>
contents
*/

$f = fopen($t_key.'.article.htm','r');
$title = trim(fgets($f));
fgets($f);
$options = fgets($f);
$option_prettyprint = stripos($options,'prettify')!==FALSE;
$byline = trim(fgets($f));

$in_style = FALSE;
$style = '';
$body = '';
while (FALSE!==($l=fgets($f))) {
	if ($in_style) {
		if (FALSE===stripos($l,'</style')) $style .= $l;
		else $in_style = FALSE;
	} else {
		if (FALSE===stripos($l,'<style')) $body .= $l;
		else $in_style = TRUE;
	}
}
fclose($f);

if ($option_prettyprint) $PR->addlib('prettify');
$PR->head($title,$canonical);
?>
<style>
#a9_body .indent { text-indent:2em; }
#a9_body .para { margin-bottom:1em; }
#a9_body .f-clear { clear:both; }
#a9_body .f-left { float:left; clear:left; }
#a9_body .f-right { float:right; clear:right; }
#a9_body img.border { border:solid 3px #cdcda9; margin:5px 10px; padding:1px; }
#a9_body .center { text-align:center; }
<?php echo $style; ?>
</style>
<?php
$PR->header();
?>
<div class="container"><div class="row"><div class="span9">

<div class="page-header">
<h1><?php echo htmlspecialchars($title); ?></h1>
</div>

<p><?php echo $byline; ?></p>

<div id="a9_body">
<?php echo $body; ?>
</div>

</div><div class="span3">
<?php $PR->adsense(160,600); ?>
</div></div></div>
<?php
$PR->footer();
?>
<script>
$(function(){ $('#a9_body table').addClass('table table-bordered'); });
<?php if ($option_prettyprint) echo '$(prettyPrint);'; ?>
var c = $.noop;
function tech_download(f,t){ if (!t) t=f; W.track(t||f); window.open('http://cid-1fa4aa816e7dc9f3.office.live.com/self.aspx/yoursunny-tech/articles/'+f); }
</script>
