<?php
require_once $_SERVER["DOCUMENT_ROOT"].'/include/2011.php';
$PR->lang='en';
$PR->starthtml();
$PR->head('DeleteTweet','/p/deletetweet/');
?>
<style type="text/css">
#i_inbox,#i_token { width:98%; }
kbd { display:inline-block; border:dotted 1px #090; padding:3px 4ex; margin:2px; }
</style>
<?php
$PR->startbody();
$PR->header();
$PR->startcontent(PageRenderHelper::main);
?>
<h1>DeleteTweet action for ifttt</h1>

<p>You can post a tweet to Twitter via SMS by sending a text message to 40404 (<a href="https://support.twitter.com/groups/34-apps-sms-and-mobile/topics/153-twitter-via-sms/articles/14589-getting-started-with-twitter-via-sms#post-tweet" target="_blank" onclick="W.trackout(this.href)">detail</a>). This enables you to tweet with your messaging phone, and doesn't require a data plan.</p>

<p>From time to time, Twitter 40404 tells you: "Oops! Your tweet was over 140 characters. We shortened it a bit. It now ends with", along with an ugly truncated ending. In other cases, you might have a fat finger and send a tweets with a mistyped word. Do you want to delete these incorrect tweets? Unfortunately, Twitter does not provide an SMS command for deleting a tweet. DeleteTweet is here to help.</p>

<p>DeleteTweet is a service that allows you to delete one of your recent tweets, by sending a SMS from your mobile phone.</p>

<h2>Get Started</h2>

<ol class="list">
<li><span class="token0"><a href="token.php">Obtain OAuth access token</a></span>
<span class="token1">Obtain OAuth access token: done</span></li>
<li><a href="http://ifttt.com/recipes/36124" target="_blank" onclick="W.trackout(this.href)">Use this ifttt recipe</a>.<br/>
ifttt is a service that makes the Internet work for you. It triggers the DeleteTweet service when you send an SMS. The SMS and Gmail channels are required.</li>
<li>Copy the service inbox address, and paste into "Gmail Action - To Address" textbox.<br/>
<input id="i_inbox" type="text" onclick="this.select()"/></li>
<li>Copy the OAuth access token, and paste into "Gmail Action - Body" textbox.<br/>
<input id="i_token" type="text" onclick="this.select()" value="(please obtain one by clicking)"/></li>
<li>When you decide to delete a tweet, text the following to the <a href="http://ifttt.com/sms" target="_blank" onclick="W.trackout(this.href)">ifttt phone number</a>:<br/>
<kbd>#deletetweet keyword</kbd><br/>
where keyword is a substring of the tweet you wish to delete.</li>
</ol>

<?php
$PR->endcontent();
$PR->footer();
?>
<script type="text/javascript">
var token = (<?php echo json_encode(@$_COOKIE['a0bd74de']); ?>);
var inbox = ['appspotmail','com'];
inbox.unshift('deletetweetZpubapi'.replace(/z/i,String.fromCharCode(0x40)));
inbox = inbox.join('yoursunny.com'.charAt(3*3));

if (token) {
	$('.token0').hide();
	$('#i_token').val(token);
} else {
	$('.token1').hide();
}
$('#i_inbox').val(inbox);
</script>
<?php
$PR->endhtml();
?>
