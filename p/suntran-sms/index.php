<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013.php';

$PR->head('Sun Tran SMS schedule','/p/suntran-sms/','en');
$PR->header();
?>
<div class="container"><div class="row"><div class="span9">
<h1>Sun Tran SMS Schedule</h1>
<p><a href="http://www.suntran.com" target="_blank" onclick="W.trackout(this.href)">Sun Tran</a> is the public transit system serving the city of Tucson, Arizona. yoursunny.com provides a tool to retrieve realtime Tucson bus schedule by text message from your mobile phone.</p>

<ul class="nav nav-tabs">
  <li class="active"><a href="#info" data-toggle="tab">How to Use</a>
  <li><a href="#faq" data-toggle="tab">FAQ</a>
</ul>

<div class="tab-content">
<div class="tab-pane active" id="info">

<h3>live times</h3>
<p><img src="<?php echo $PR->staticfile('/p/suntran-sms/cmd-live.png'); ?>" alt="live departure/arrival times command">

<h3>scheduled times</h3>
<p><img src="<?php echo $PR->staticfile('/p/suntran-sms/cmd-sched.png'); ?>" alt="scheduled times command">

<h3>send commands to</h3>
<table class="table">
<thead>
  <tr>
    <th>service
    <th>account
    <th>note
<tbody>
  <tr>
    <td>SMS
    <td>(520)201-1601
    <td><a href="http://smsified.com">smsified</a>
  <tr>
    <td>SMS
    <td>DOTCOM (368266) <br><small>add "yoursunny suntran " before commands, eg. yoursunny suntran 6n speedway</small>
    <td><small class="muted">Message and data rates may apply. Text HELP for help, STOP to opt-out, and email support@dotgo.com for support. View our <a href="http://dotgo.com/PrivacyPolicy/">Privacy Policy</a>.</small>
  <tr>
    <td>SMS
    <td>(774)314-1398
    <td><a href="http://bot.im">imified</a>
  <tr>
    <td>GTalk
    <td id="xmpp-account">
    <td>
</table>

</div><div class="tab-pane" id="faq">

<h4>Do I have to type the full command?</h4>
<p>Only route number and stop name are required. All other fields are optional. To query scheduled times, include date and/or time, or the word 'NOW'. Otherwise, the service will query live arrival times.</p>

<h4>Do I have to type the exact stop name?</h4>
<p>Any substring of a stop name is OK. The service can even recognize some common variations and alternative spellings. Multiple results might be returned if the input matches multiple stops.</p>

<h4>Is that live departure time or live arrival time?</h4>
<p>It's live departure time. As a result, querying the final stop will show NO MORE.</p>

<h4>How to enter/interpret bus direction?</h4>
<p>The direction is same as the ride guide. If the ride guide lists "Northbound Eastbound", you can enter either N or E.</p>
<p>In some parts of a route, buses may travel on a different direction than the listed direction. Example: on Swan, 1S goes north, 1N goes south.</p>

<h4>Is this service free?</h4>
<p>yoursunny.com does not charge you for using this service.</p>
<p>Standard messaging rates apply. You may receive up to five reply messages for each request.</p>

<h4>I never see the bus coming!</h4>
<p>The results are collected from upstream sources. yoursunny.com makes no guarantee on the accuracy. If you have been waiting for a long time, call Sun Tran customer service (520)792-9222 to find out what's happening.</p>

<h4>Do I still need the ride guide?</h4>
<p>This service is not a replacement of Sun Tran ride guide. You should plan trips according to the ride guide. When you are on the road, you can query live times through this service.</p>

<h4>Is this service affiliated with Sun Tran?</h4>
<p>No. The author is just another bus rider who <del>has a U-PASS and</del> likes to solve the toughest problem in daily life with technology.</p>

<h4>What are the data sources?</h4>
<p>SunTran schedule data comes from <a href="http://www.suntran.com/routes.php" target="_blank" onclick="W.trackout(this.href)">Sun Tran Routes &amp; Times</a>.</p>
<p>SunTran live departure times comes from <a href="http://www.suntran.com/webwatch/ada.aspx" target="_blank" onclick="W.trackout(this.href)">Sun Tran WebWatch</a>.</p>


</div></div>

</div><div class="span3">
<?php $PR->adsense(160,600); ?>
</div></div></div>
<?php
$PR->footer();
?>
<script>
var xmppAccount = ['appspot.com'];
xmppAccount.unshift('suntranDpubapi'.replace(/[A-Z]/,'@'));
xmppAccount = xmppAccount.join('.').replace(/(spot)/,'$1chat');
$('#xmpp-account').text(xmppAccount);
</script>
