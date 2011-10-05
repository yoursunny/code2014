<?php
# https://yoursunny.com/p/qqwry/
require 'replace.func.php';

$contents=file_get_contents($argv[1]);
$format='$ip ($c $a)';

file_put_contents($argv[2],qqwry_replace($contents,$format));

?>