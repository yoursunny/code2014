<?php
require_once 'common.php';
switch ($_GET['a'])
{
	case 'by_cat/product':
		query_json('SELECT * FROM pAvailable WHERE catID=?1catID AND shopID=?1shopID UNION SELECT pAvailable.* FROM pAvailable INNER JOIN category ON pAvailable.catID=category.ID WHERE category.parentID=?1catID AND shopID=?1shopID;',array('1catID'=>$_POST['cat'],'1shopID'=>$_POST['shop']));
		break;
	case 'by_cat/sub_cat':
		query_json('SELECT ID, title FROM category WHERE parentID=?1catID;',array('1catID'=>$_POST['cat']));
		break;
	case 'by_name':
		query_json("SELECT * FROM pAvailable WHERE pName LIKE CONCAT('%',?pName,'%') AND shopID=?1shopID;",array('pName'=>$_POST['name'],'1shopID'=>$_POST['shop']));
		break;
}
?>