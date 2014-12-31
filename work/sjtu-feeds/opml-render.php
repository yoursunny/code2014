<?php
$x=simplexml_load_file('opml.xml');
foreach ($x->body->outline->outline as $site) {
	echo "<div class=\"a-site\">\r\n";
	$link=$site->outline[0];//type="link"
	echo '<h3><a href="'.$link['url'].'" target="_blank">'.htmlspecialchars($site['text'])."</a></h3>\r\n";
	if (strlen(@$link['description'])>0) echo '<p>'.htmlspecialchars($link['description'])."</p>\r\n";
	echo "<ul>\r\n";
	foreach ($site->outline as $feed) {
		if ($feed['type']!='rss') continue;
		echo '<li><a href="'.$feed['xmlUrl'].'">'.htmlspecialchars($feed['text']).'</a> '.htmlspecialchars(@$feed['description'])."</li>\r\n";
	}
	echo "</ul>\r\n</div>\r\n\r\n";
}
?>