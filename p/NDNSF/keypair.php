<?php
$p_pvtkey = popen('openssl genrsa -out /dev/stdout 1024', 'r');
$pvtkey = stream_get_contents($p_pvtkey);
pclose($p_pvtkey);

$p_pubkey = proc_open('openssl rsa -in /dev/stdin -pubout', array(0=>array('pipe','r'),1=>array('pipe','w')), $pipes_pubkey);
fwrite($pipes_pubkey[0], $pvtkey);
fclose($pipes_pubkey[0]);
$pubkey = stream_get_contents($pipes_pubkey[1]);
fclose($pipes_pubkey[1]);
proc_close($p_pubkey);

header('Content-Type: application/json');
header('Content-Disposition: attachment; filename=keypair.json');
echo json_encode(array('pvtkey'=>$pvtkey,'pubkey'=>$pubkey));
?>

