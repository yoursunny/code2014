<?php
require_once 'oscrcal.lib.php';
require_once 'unionhours.func.php';
require_once 'recpool.func.php';
require_once 'libraryhours.func.php';
date_default_timezone_set('America/Phoenix');

//new UnionHours;
//new RecPool;
print_r(Library_hours(1));
die;

$cal = new OSCRCal($argv[1]);
$res = $cal->query(strtotime($argv[2]));

if ($res[0]===TRUE) {
	printf("OPEN until %s\n",date('Y-m-d H:i:s',$res[1]));
} elseif ($res[0]===FALSE) {
	printf("CLOSED to end of week\n");
} else {
	printf("CLOSED, will open from %s to %s\n",date('Y-m-d H:i:s',$res[0]),date('Y-m-d H:i:s',$res[1]));
}


?>
