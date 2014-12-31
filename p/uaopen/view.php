<?php
$view = $_GET['v'];
$views = array(
	'list'=>'What\'s open in University of Arizona?',
	'library'=>'Library',
	'oscr'=>'OSCR Computer Labs',
	'union'=>'Student Unions',
	'rec'=>'Campus Rec'
);
if (isset($views[$view])) {
	$title = $views[$view];
} else {
	ob_end_clean();
	header('HTTP/1.1 404');
	die;
}

$now = $_SERVER['REQUEST_TIME'];
$endofday = strtotime('23:59:59');

function list_start() {
	global $title;
	printf("<h1>UAOPEN: %s</h1>\n<ul>\n",htmlspecialchars($title));
}
function list_entry($title,$open,$text) {
	printf("<li class=\"%s\"><b>%s</b> <span>%s</span></li>\n",$open?'o':'c',htmlspecialchars($title),htmlspecialchars($text));
}
function list_end() {
	echo "</ul>\n";
}

function disp_openclose($title,$opentime,$closetime) {
	global $now;
	if ($opentime===FALSE) list_entry($title,FALSE,'closed today');
	elseif ($now<$opentime) list_entry($title,FALSE,sprintf('closed, open at %s',date('H:i',$opentime)));
	elseif ($now<$closetime) list_entry($title,TRUE,sprintf('open until %s',date('H:i',$closetime)));
	else list_entry($title,FALSE,'closed');
}
?>
<!doctype html>
<html>
<head>
<title>UAOPEN: <?php echo htmlspecialchars($title); ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<style type="text/css">
body { font-size:12px; }
h1 { font-size:16px; }
ul,li { list-style:none; margin:2px 0; padding:0; }
b,span { display:block; }
.o span { color:#090; }
.c span { color:#900; }
</style>
</head>
<body>
<?php
function view_list() {
?>
<h1>UAOPEN: What's open in University of Arizona?</h1>
<ul style="font-size:14px;line-height:28px;">
<li><a href="?v=library">Library</a></li>
<li><a href="?v=oscr">OSCR Computer Labs</a></li>
<li><a href="?v=union">Student Union</a></li>
<li><a href="?v=rec">Campus Rec</a></li>
</ul>
<?php
}

function view_library() {
	require_once 'libraryhours.func.php';
	list_start();
	foreach ($LibraryBranches as $branch=>$title) {
		list($opentime,$closetime) = Library_hours($branch);
		disp_openclose($title,$opentime,$closetime);
	}
	list_end();
}

function view_oscr() {
	global $now,$endofday;
	require_once 'libraryhours.func.php';
	require_once 'oscrcal.lib.php';
	list_start();
	foreach ($OSCRLabs as $lab) {
		list($title,$locid,$key) = $lab;
		if (is_int($locid)) {
			$labcal = new OSCRCal($locid);
			list($opentime,$closetime) = $labcal->query($now);
			if ($opentime===TRUE) list_entry($title,TRUE,sprintf('open until %s',date('H:i',$closetime)));
			elseif ($opentime===FALSE || $opentime>$endofday) list_entry($title,FALSE,sprintf('closed today'));
			else list_entry($title,FALSE,sprintf('closed, open at %s for %d minutes',date('H:i',$opentime),($closetime-$opentime)/60));
		} else {
			switch ($locid) {
				case 'campusrec':
					break;
				case 'mainlib':
					list($opentime,$closetime) = Library_hours(1);
					disp_openclose($title,$opentime,$closetime);
					break;
				default:
					break;
			}
		}
	}
	list_end();
}

function view_union() {
	require_once 'unionhours.func.php';
	list_start();
	$unionhours = Union_hours();
	foreach ($unionhours as $place) {
		list($title,$opentime,$closetime) = $place;
		disp_openclose($title,$opentime,$closetime);
	}
}

function view_rec() {
	require_once 'recpool.func.php';
	list_start();
	$poolstatus = RecPool_status();
	list_entry('Pool',$poolstatus['open'],$poolstatus['text']);
	list_end();
}

$func = 'view_'.$view;
if (function_exists($func)) $func();

$PR->mobilestat();
?>
</body>
</html>
