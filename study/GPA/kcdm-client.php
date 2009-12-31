<?php
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
load_nusoap();
// Create the client instance
$client = new soapclient('http://your9.sunny/study/GPA/kcdm.php');
// Check for an error
$err = $client->getError();
if ($err) {
    // Display the error
    echo '<p><b>Constructor error: ' . $err . '</b></p>';
    // At this point, you know the call that follows will fail
}
// Call the SOAP method
$result = $client->call(
    'lookup',                     // method name
    array('name' => 'DV创作基础'),    // input parameters
    'http://yoursunny.com/study/GPA/kcdm',            // namespace
    'http://yoursunny.com/study/GPA/kcdm.lookup'       // SOAPAction
);
// Strange: the following works just as well!
//$result = $client->call('hello', array('name' => 'Scott'));
// Check for a fault
if ($client->fault) {
    echo '<p><b>Fault: ';
    print_r($result);
    echo '</b></p>';
} else {
    // Check for errors
    $err = $client->getError();
    if ($err) {
        // Display the error
        echo '<p><b>Error: ' . $err . '</b></p>';
    } else {
        // Display the result
        print_r($result);
    }
}
?>
