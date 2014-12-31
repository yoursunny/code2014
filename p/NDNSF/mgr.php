<?php
$ndndid = $_GET['mgr'];
$host = $_GET['host']; $host_a = explode(':',$host); if (count($host_a)!=2) die();
$PR->head('NDNSF Manager','/p/NDNSF/?mgr='.urlencode($ndndid).'&host='.urlencode($host),'en');
$PR->header();
?>
<div class="container"><div class="row"><div class="span12">
<h1>NDNSF Manager - <?php echo htmlspecialchars($host); ?></h1>
<div id="connection_status" class="alert alert-info">loading</div>

<ul class="nav nav-tabs">
  <li class="active"><a href="#tools" data-toggle="tab">tools</a>
  <li><a href="#faces" data-toggle="tab">faces &amp; FIB</a>
</ul>

<div class="tab-content">
<div class="tab-pane active" id="tools">

<form id="ping"><div>
ping <input type="text" id="ping_uri"> <input type="submit" value="OK" disabled class="ready-enable"><br>
<div id="ping_result"></div>
</div></form>

</div><div class="tab-pane" id="faces">

<div id="facelist">
</div>

</div></div>

</div></div></div>
<?php
$PR->footer();
?>
<script src="<?php echo $PR->staticfile('/p/NDNSF/ndn.fac97ec44311224ecb66d3d583eaafb9a5381ae2.js'); ?>"></script>
<script src="<?php echo $PR->staticfile('/p/NDNSF/jquery.ndn.js'); ?>"></script>
<script>
var config = (<?php echo json_encode(array('hostname'=>$host_a[0],'port'=>intval($host_a[1]),'host'=>$host,'ndndid'=>$ndndid)); ?>);
</script>
<script src="<?php echo $PR->staticfile('/p/NDNSF/mgr.js'); ?>"></script>

