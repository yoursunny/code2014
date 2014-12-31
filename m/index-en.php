<?php
$PR->head('sunny boy\'s vCard','/m/','en');
?>
<style>
.m-list >li { padding-top:10px; }
</style>
<?php
$PR->header();
?>
<div class="container">
<h1>sunny boy's vCard</h1>
<div class="row"><div class="span4"><ul class="m-list unstyled">

<li><i class="icon-x"><img src="<?php echo ICON_GMAIL; ?>" alt="Email"></i> <img src="email.php?n=1&amp;l=1" alt="" style="background:url(email.php?n=1&amp;l=0);max-width:none;">
<br><small>I read emails a few times per day.</small>

<li><i class="icon-x"><img src="<?php echo ICON_VOICE; ?>" alt="Phone"></i> +1 804 457 8669 <a href="#callModal" role="button" data-toggle="modal">more</a>
<br><small>I answer most calls. Do not text.</small>

<li><i class="icon-time"></i> <?php clock(); ?>
<br><small>Don't call when I'm sleeping (11PM - 6AM) - phone won't ring.</small>

<li><i class="icon-x"><img src="<?php echo ICON_TWTTR; ?>" alt="Twitter"></i> @<a href="https://twitter.com/yoursunny">yoursunny</a>
<br><small>I read home_timeline daily.</small>

<li><i class="icon-x"><img src="<?php echo ICON_4SQ; ?>" alt="Foursquare"></i> <a href="https://foursquare.com/yoursunny">Foursquare profile</a>
<br><small>I check in very frequently.</small>

<li><i class="icon-x"><img src="<?php echo ICON_FB; ?>" alt="Facebook"></i> <a href="https://www.facebook.com/yoursunny">Facebook profile</a>
<br><small>I visit Facebook a few times per week.</small>

</ul></div><div class="span4">

<img src="//www.gravatar.com/avatar/70a55686123e015e401aaa2783632534?s=300" class="img-rounded" alt="photo of sunny boy">

</div><div class="span4"><ul class="m-list unstyled">

<li><i class="icon-x"><img src="<?php echo ICON_ARIZONA; ?>" alt="University of Arizona"></i> <a href="http://www.cs.arizona.edu/people/shijunxiao/">PhD student</a>

<li><i class="icon-thumbs-up"></i> believe in open and free Internet

<li><i class="icon-x"><img src="<?php echo ICON_ANDROID; ?>" alt="Android"></i> 4 Android devices

<li class="dropdown"><i class="icon-eye-open"></i> <a class="dropdown-toggle" data-toggle="dropdown" href="#">Reality TV</a> fan
  <ul class="dropdown-menu">
    <li><a href="http://www.cbs.com/shows/amazing_race/">The Amazing Race</a>
    <li><a href="http://www.cbs.com/shows/big_brother/">Big Brother</a>
    <li><a href="http://www.mtv.com/shows/real_world/portland/series.jhtml">The Real World</a>
  </ul>

<li><i class="icon-film"></i> <a href="https://www.facebook.com/yoursunny/movies">moviegoer</a>

<li><i class="icon-x"><img src="<?php echo ICON_GEOCACHING; ?>" alt="Geocaching"></i> <a href="http://www.geocaching.com/profile/?guid=e344547e-a2c2-4544-817a-76ffee1e1afb">Geocacher</a>

</ul></div></div></div>
<?php
$PR->footer();
?>
<div id="callModal" class="modal hide fade" tabindex="-1" role="dialog"><div class="modal-header">
  <button type="button" class="close" data-dismiss="modal">×</button>
  <h3>Phone Call</h3>
</div><div class="modal-body">
  <ul class="nav nav-pills">
    <li class="active"><a href="#callNumbers" data-toggle="tab">numbers</a>
    <li><a href="#callPSTN" data-toggle="tab" id="callPSTNl">PSTN call</a>
    <li><a href="#callVoIP" data-toggle="tab" id="callVoIPl">VoIP call</a>
  </ul>
  <div class="tab-content">
    <div class="tab-pane active" id="callNumbers">
      <ul>
        <li>PSTN: +1 804 457 8669
        <li>iNum: +883 5100 1202 3660
        <li><img src="email.php?n=4&amp;l=1" alt="" style="background:url(email.php?n=4&amp;l=0);max-width:none;">
      </ul>
      <p>Note: PSTN is always available. iNum and SIP are online in select hours only.</p>
    </div>
    <div class="tab-pane" id="callPSTN">
      <p>USA callback number is required to use this feature.</p>
      <p>You may also dial +1 804 457 8669 on your PSTN phone.</p>
    </div>
    <div class="tab-pane" id="callVoIP">
      <button type="button" id="callBtn" class="btn btn-warning" disabled data-t-call="VoIP call" data-t-hangup="Hang Up" data-t-calling="VoIP calling" data-t-ringing="ringing" data-t-answered="answered">VoIP connecting...</button>
      <p>Please approve Microphone request in order to connect the call.</p>
      <p>You may also dial <img src="email.php?n=4&amp;l=1" alt="" style="background:url(email.php?n=4&amp;l=0);max-width:none;"> on your SIP phone.</p>
    </div>
  </div>
</div></div>
<?php phono_script(); ?>
<script>
$('#callPSTNl').one('show',function(){
  $('#callPSTN').prepend('<object type="application/x-shockwave-flash" data="https://clients4.google.com/voice/embed/webCallButton" width="230" height="85"><param name="movie" value="https://clients4.google.com/voice/embed/webCallButton"><param name="wmode" value="transparent"><param name="FlashVars" value="id=2636192a170d77669dd7680a332a0386f5a6097b&style=0"></object>');
});
$('#callVoIPl').one('show',phono_connect);
</script>
