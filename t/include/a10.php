<?php
/*
a10.htm
line 1: title
line 2: byline
line 3: options - 'full-width' need more width, 'prettyprint' need prettify
contents (html)
*/

$f = fopen('a10.htm','r');
$title = trim(fgets($f));
$byline = trim(fgets($f));
$options = fgets($f);
$option_prettyprint = stripos($options,'prettyprint')!==FALSE;

if ($option_prettyprint) $PR->addlib('prettify');
$PR->head($title,$canonical);
$PR->header();
?>
<div class="container"><div class="row"><div class="span9">

<div class="page-header">
<h1><?php echo htmlspecialchars($title); ?></h1>
</div>

<p><?php echo $byline; ?></p>

<div id="a10_body">
<?php
while (FALSE!==($l=fgets($f))) echo $l;
fclose($f);
?>
</div>

</div><div class="span3">
<?php $PR->adsense(160,600); ?>
</div></div></div>
<?php
$PR->footer();
?>
<script>
$(function(){ $('#a10_body table').addClass('table table-bordered'); });
<?php if ($option_prettyprint) echo '$(prettyPrint);'; ?>
var c = $.noop;
function tech_download(f,t){ if (!t) t=f; W.track(t||f); window.open('http://cid-1fa4aa816e7dc9f3.office.live.com/self.aspx/yoursunny-tech/articles/'+f); }
</script>
