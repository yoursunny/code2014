<?php
require_once 'common.php';
switch ($_GET['a'])
{
	case 'list':
		query_json('SELECT * FROM product',array());
		break;
	case 'insert':
		$db->execute('INSERT INTO product(ID, pName, cat, brandName, model) VALUES(?pID, ?pName, ?1cat, ?brandName, ?model) ',array('pID'=>$_POST['ID'],'pName'=>$_POST['pName'],'1cat'=>$_POST['cat'],'brandName'=>$_POST['brandName'],'model'=>$_POST['model']));
		echo 'OK';
		break;
	case 'edit':
		$col=$_GET['col'];
		if (!in_array($col,array('pName','cat','brandName','model'))) die('无效的列名');
		$db->execute('UPDATE product SET ?COL=?value WHERE ID=?id',array('COL'=>$col,'value'=>$_POST['value'],'id'=>$_GET['ID']));
		echo $_POST['value'];
		break;
	case 'price':
		query_json('SELECT * FROM pPrice WHERE pID=?pID',array('pID'=>$_POST['ID']));
		break;
	case 'price_insert':
		$db->execute('INSERT INTO pPrice(pID, shopID, creditReq, price, creditGet, startDate, endDate) VALUES(?pID, ?1shopID, ?1creditReq, ?1price, ?1creditGet, ?startDate, ?endDate)',array('pID'=>$_POST['pID'],'1shopID'=>$_POST['shopID'],'1creditReq'=>$_POST['creditReq'],'1price'=>$_POST['price'],'1creditGet'=>$_POST['creditGet'],'startDate'=>$_POST['startDate'],'endDate'=>$_POST['endDate']));
		echo 'OK';
		break;
	case 'price_delete':
		$db->execute('DELETE FROM pPrice WHERE ID=?1ID',array('1ID'=>$_POST['ID']));
		break;
}
?>