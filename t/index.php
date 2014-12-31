<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013.php';

$PR->altlang();
switch ($_SERVER['HTTP_HOST']) {
	case 'yoursunny.com':
	case 'local.yoursunny.com':
		$title = 'sunny boy\'s Technical Blog';
		$PR->head($title,'/t/','en');
		break;
	case 'yoursunny.cn':
	case 'local.yoursunny.cn':
		$title = '原创网络技术文章';
		$PR->head($title,'/t/','zh','yoursunny.cn');
		break;
	default:
		header('HTTP/1.1 404');
		break;
}
$PR->header();
?>
<div class="container"><div class="row"><div class="span9">

<h1><?php echo $title; ?></h1>

<?php
$x = simplexml_load_file('feed.xml');
$first = TRUE;
foreach ($x->entry as $xe) {
	if ($first) {
		$first = FALSE;
?>
<div class="hero-unit">
<h2><?php echo htmlspecialchars($xe->title); ?> <span class="label label-info"><?php echo substr($xe->updated,0,10); ?></span></h2>
<p><?php echo htmlspecialchars($xe->summary); ?></p>
<a href="<?php echo $xe->id; ?>" class="btn btn-primary">Read More</a>
</div>
<?php
		continue;
	}
?>
<p>
<span class="label"><?php echo substr($xe->updated,0,7); ?></span>
<strong><a href="<?php echo $xe->id; ?>"><?php echo htmlspecialchars($xe->title); ?></a></strong>
<br>
<small><?php echo htmlspecialchars($xe->summary); ?></small>
</p>
<?php
}
?>
</ul>

</div><div class="span2">
<?php $PR->adsense(160,600); ?>
</div></div></div>

<?php
$PR->footer();
?>
