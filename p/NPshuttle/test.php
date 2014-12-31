<!doctype html>
<html>
<head>
<title>NorthPointe shuttle</title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<style type="text/css">
body { font-size:12px; }
h1 { font-size:16px; }
</style>
</head>
<body>
<h1>NorthPointe shuttle</h1>
<?php
date_default_timezone_set('America/Phoenix');
$offset_mst = date('Z');
date_default_timezone_set('America/Chicago');
$offset_central = date('Z');

$xml_url = 'http://www.landairsea.com/silvercloud/default.aspx?template=sharedvehicles.xml&sid=193&_='.time().mt_rand(100,999);
$xroot = simplexml_load_file($xml_url);

$vehicles = array(
  '8880324868'=>array('Wildcat','brown'),
  '8880324870'=>array('Big Blue','blue'),
);
function in_box($lat, $lng, $lat_north, $lng_east, $lat_south, $lng_west) {
  return $lat < $lat_north && $lat > $lat_south && $lng >= $lng_west && $lng <= $lng_east;
}
$places = array(
  'NorthPointe'=>array(32.28696,-110.957977, 32.284272,-110.959619),
  'Sixth Street Garage'=>array(32.228848,-110.95349, 32.227607,-110.955233),
  'Highland Avenue Garage'=>array(32.238168,-110.949732, 32.23718,-110.951342),
);

foreach ($xroot->vehicle as $xvehicle) {
  $vinfo = $vehicles[strval($xvehicle->sn)];
  $latlng = strval($xvehicle->lat).','.strval($xvehicle->lon);
  $dt = strtotime(strval($xvehicle->date))-$offset_central+$offset_mst;

  $lat = floatval($xvehicle->lat);
  $lng = floatval($xvehicle->lon);
  $speed = intval($xvehicle->speed);
  $heading = deg2rad(intval($xvehicle->heading));
  $head_latlng = ($lat+cos($heading)/150).','.($lng+sin($heading)/150);
  
  $parked = FALSE;
  foreach ($places as $place=>$coords) {
    if (in_box($lat,$lng, $coords[0],$coords[1],$coords[2],$coords[3])) {
      $parked = $place;
    }
  }
  
  $map = 'http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyCEQAQTCAtvlwSgAkwHQxsunxBTvoNR0TI&sensor=true&center='.$latlng.'&zoom=14&size=300x300&markers=color:'.$vinfo[1].'|'.$latlng.'&path=color:'.$vinfo[1].'|'.$latlng.'|'.$head_latlng;
  echo '<p><strong>'.$vinfo[0].'</strong> '.date('Y-m-d H:i:s', $dt);
  if ($parked === FALSE) {
    echo '<br><img src="'.$map.'" alt="">';
  } else {
    echo ' at '.$parked;
  }
  echo '</p>';
}
?>
</body>
</html>
