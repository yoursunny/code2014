<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013.php';
if (@$_GET['p'] == 'keypair') {
  require_once 'keypair.php';
  exit;
}
if (@$_GET['mgr']) {
  require_once 'mgr.php';
  exit;
}

$PR->head('NDNSF - NDN Slim Forwarder','/p/NDNSF/','en');
$PR->header();
?>
<div class="container"><div class="row"><div class="span9">
<h1>NDNSF - NDN Slim Forwarder</h1>

<p>NDNSF is a lightweight <a href="http://named-data.net/">Named Data Networking</a> forwarder based on <a href="https://github.com/named-data/NDN-On-Node">NDN-On-Node</a>.</p>
<p>Check out <a href="https://github.com/yoursunny/NDNSF">GitHub repository</a> for source code and installation steps.</p>

</div><div class="span3">
<?php $PR->adsense(160,600); ?>
</div></div></div>
<?php
$PR->footer();
?>
