<?php
require_once 'common.php';

switch ($_GET['a'])
{
	case 'autocompleter':
		$supplier=$_POST['supplier'];
		$db->query("SELECT * FROM supplier WHERE sName LIKE CONCAT(?sName,'%') LIMIT 0,5",array('sName'=>$supplier));
		echo '<ul>';
		while ($row=$db->read())
		{
			echo '<li>'.$row['sName'].'</li>';
		}
		echo '</ul>';
		break;
	case 'submit':
		header('Content-type: text/javascript');
		$sName=$_POST['sName'];
		$supplierID=0;
		if ($_POST['sNew']==1)
		{
			$db->execute('INSERT INTO supplier(sName, sManager, phone) VALUES(?sName, ?sManager, ?phone) ;',array('sName'=>$sName,'sManager'=>$_POST['sManager'],'phone'=>$_POST['sPhone']));
		}
		$db->query('SELECT * FROM supplier WHERE sName=?sName',array('sName'=>$sName));
		if ($row=$db->read())
		{
			$supplierID=$row['ID'];
		}
		else
		{
			echo "stock('new_supplier');"; exit;
		}
		$db->execute('INSERT INTO stock(supID, pID, wInto, t, price, quantity, isReceived) VALUES(?1supID, ?pID, ?1wInto, NOW(), ?1price, ?1quantity, 0) ;',array('1supID'=>$supplierID,'pID'=>$_POST['pID'],'1wInto'=>$_POST['wInto'],'1price'=>$_POST['price'],'1quantity'=>$_POST['quantity']));
		echo "alert('进货处理成功');gohome();";
		break;
}
?>