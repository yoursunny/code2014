<?php
require_once 'common.func.php';

function Library_hours($branch) {
	$body = cached_load(sprintf('library_%d',$branch),sprintf('http://www.library.arizona.edu/applications/hours/building_parts/today/%d.json',$branch));
	$json = json_decode($body);
	$houra = explode('-',$json->student);
	if ($houra[0]=='Closed') return array(FALSE,FALSE);
	$opentime = strtotime($houra[0]);
	$closetime = strtotime($houra[1]);
	if ($closetime<$opentime) $closetime += 86400;
	return array($opentime,$closetime);
}

$LibraryBranches = array(
	1=>'Main Library',
	3=>'Express Document Center',
	4=>'Administration and Office of the Dean',
	14=>'Bookend Cafe',
	15=>'Center for Creative Photography',
	6=>'CCP Gallery',
	7=>'Laura Volkerding Study Center',
	9=>'Fine Arts Library',
	10=>'Science and Engineering Library',
	13=>'Special Collections',
);

?>
