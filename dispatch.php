<?php
require_once 'common.php';
switch ($_GET['a'])
{
	case 'list':
		$shop=$_POST['shop'];
		query_json('SELECT bill.*,product.pName AS pName FROM bill INNER JOIN product ON bill.pID=product.ID WHERE bill.shopID=?1shopID AND bill.salesID is not null',array('1shopID'=>$_POST['shop']));
		break;
	case 'dispatch':
		$shopID=$_POST['shopID'];
		$billID=$_POST['ID'];
		$pID=$_POST['pID'];
		$param=array('1shopID'=>$shopID,'pID'=>$pID,'1billID'=>$billID);
		$db->execute('UPDATE stor SET quantity=quantity-1 WHERE pID=?pID AND wID=(SELECT ID FROM warehouse WHERE shopID=?1shopID) ; ',$param);
		$db->execute('DELETE FROM bill WHERE ID=?1billID;',$param);
		header('Content-type: text/javascript');
		echo "dispatch('dispatch_done',".$billID.");";
		break;
}
?>