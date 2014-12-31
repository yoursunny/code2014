<?php
require_once $_SERVER["DOCUMENT_ROOT"].'/include/2011.php';

if (isset($_GET['v'])) {
	require 'view.php';
	exit;
}

$PR->lang='en';
$PR->starthtml();
$PR->head('UAOPEN: What\'s open in University of Arizona?','/p/uaopen/');
?>
<style type="text/css">
.u { font-size:150%; text-align:center; }
</style>
<?php
$PR->startbody();
$PR->header();
$PR->startcontent(PageRenderHelper::main);
?>
<h1>UAOPEN: What's open in University of Arizona?</h1>

<p>UAOPEN allows you to view the operation hours of various facilities at the University of Arizona on a mobile device. You can easily know what's open right now on the go.</p>

<h2>UAOPEN mobile pages</h2>
<p>View Library, OSCR computer labs, Student Unions, and Campus Rec hours on mobile devices</p>
<p class="u"><a href="./?v=list">http://bit.ly/uaopen</a></p>

<h2>UAPOOL by SMS</h2>
<p>Retrieve Campus Rec pool status by text messaging</p>
<p class="u">Text <b>W UAPOOL</b> to <b>40404</b></p>

<?php
$PR->nextcolumn();
$PR->endcontent();
$PR->footer();
$PR->endhtml();
?>
