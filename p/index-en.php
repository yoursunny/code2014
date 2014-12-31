<?php
$PR->head('Products','/p/','en');
$PR->header();
?>
<div class="container">
<h1>Products</h1>
<div class="row"><div class="span8">

<!--<h3>Internet Applications</h3>
<ul>
</ul>-->

<h3>Mobile Applications</h3>
<ul>
<li><a href="suntran-sms/">Sun Tran SMS schedule</a> <small>query Tucson bus schedule from mobile phone</small>
<li><a href="deletetweet/">DeleteTweet</a> <small>an ifttt recipe that deletes a mistyped tweet via SMS</small>
<li><a href="uaopen/">UAOPEN</a> <small>What's open in University of Arizona?</small>
</ul>

<h3>Desktop / Server Applications</h3>
<ul>
<li><a href="vmapi/">VMAPI for VirtualBox</a>
</ul>

</div><div class="span4">
<?php $PR->adsense(300,250); ?>
</div></div></div>
<?php
$PR->footer();
?>
