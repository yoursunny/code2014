<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013.php';
header('HTTP/1.1 410');
$PR->head('backuplet','/p/backuplet/','en');
$PR->header();
?>
<div class="container">
<div class="row"><div class="span12">
<h1>backuplet is closed</h1>

<p>Thank you for your interest in backuplet online export tool. Unfortunately backuplet has been closed since Dec 2013.</p>
<p>backuplet injects a script to the webpage, which sends requests to website in the same way as the website's client application. It then compiles the collected information into a file for download.</p>
<p>The way backuplet works implies that it is sensitive to the AJAX API between website client and server. Websites can change this API at any time when they also change the client application, and such changes will immediately backuplet. When this happens, backuplet must be updated to continue working.</p>
<p>However, sunny boy, the author of yoursunny.com, is too busy to update backuplet. Therefore, I have to close backuplet.</p>
<p>In the future, I might reopen backuplet as an open-source, community driven project. You'll be able to enjoy backuplet online export tool again by then.</p>

</div></div></div>
<?php
$PR->footer();
?>
