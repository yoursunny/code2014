<?php
require_once 'common.php';
switch ($_GET['a'])
{
	case 'list':
		$wInto=$_POST['wInto'];
		echo '[';
		query_json('SELECT stock.ID AS ID,supplier.sName AS sName,product.ID AS pID,product.pName AS pName,stock.price AS price,stock.quantity AS quantity FROM supplier INNER JOIN stock ON supplier.ID=stock.supID INNER JOIN product ON stock.pID=product.ID WHERE stock.isReceived=0 AND stock.wInto=?1wInto',array('1wInto'=>$wInto));
		echo ',[]]';
		break;
	case 'recv_stock':
		$stockID=$_POST['ID'];
		$db->query('SELECT * FROM stock WHERE ID=?1ID AND isReceived=0; ',array('1ID'=>$stockID));
		if ($row=$db->read())
		{
			$db->execute('UPDATE stor SET quantity=quantity+?1quantity WHERE pID=?pID AND wID=?1wID;',array('1quantity'=>$row['quantity'],'pID'=>$row['pID'],'1wID'=>$row['wInto']));
			if ($db->num_rows()<1)
			{
				$db->execute('INSERT INTO stor(pID, wID, quantity) VALUES(?pID, ?1wID, ?1quantity) ;',array('1quantity'=>$row['quantity'],'pID'=>$row['pID'],'1wID'=>$row['wInto']));
			}
			$db->execute('UPDATE stock SET isReceived=1 WHERE ID=?1ID;',array('1ID'=>$stockID));
			echo 'OK';
		}
		else
		{
			echo '找不到进货记录或已经被收货';
		}
		break;
}
?>