<?php
/*
a2012.meta
line 1: language: en|zh
line 2: title
line 3: post date: 2012-12-31
line 4: edit date (optional): 2012-12-31

a2012.md
contents (markdown)

a2012.footer.htm (optional)
scripts after footer
*/

list($lang,$title,$postdate,$editdate) = array_map('trim',file('a2012.meta'));

$PR->head($title,$canonical,$lang);
$PR->header();
?>
<div class="container"><div class="row"><div class="span9">

<div class="page-header">
<h1><?php echo htmlspecialchars($title); ?></h1>
</div>

<p><?php if ($lang=='zh') {
	echo '阳光男孩 发表于'.$postdate;
	if ($editdate) echo ' 更新于'.$editdate;
} else {
	echo 'sunny boy, posted '.$postdate;
	if ($editdate) echo ', updated '.$editdate;
} ?></p>

<?php echo markdown_file('a2012.md'); ?>

</div><div class="span3">
<?php $PR->adsense(160,600); ?>
</div></div></div>
<?php
$PR->footer();
if (file_exists('a2012.footer.htm')) readfile('a2012.footer.htm');
?>
