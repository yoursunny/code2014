<?php
$PR->head('','/','en');
head_common();
$PR->header();
?>
<div class="container"><div class="row"><div class="span3">

<ul class="unstyled">
<li><a href="/m/">sunny boy's vCard</a></li>
<li><a href="/p/">Products</a></li>
<li><a href="/p/suntran-sms/">Sun Tran SMS schedule</a></li>
</ul>
<?php $PR->adsense(200,200); ?>

</div><div class="span9">
<ul id="hagg" class="unstyled"><?php echo hagg(); ?></ul>
</div></div></div>
<?php
$PR->footer();
?>
