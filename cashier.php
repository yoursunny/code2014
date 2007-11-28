<?php
require_once 'common.php';
switch ($_GET['a'])
{
	case 'list':
		$db->execute_sql('DELETE FROM bill WHERE salesID is null AND t<NOW()-interval 30 minute;');
		$shop=$_POST['shop'];
		query_json('SELECT bill.ID AS ID,bill.pID AS pID,product.pName AS pName FROM bill INNER JOIN product ON bill.pID=product.ID WHERE bill.shopID=?1shopID AND bill.salesID is null',array('1shopID'=>$_POST['shop']));
		break;
	case 'price':
		$memberID=intval($_POST['member'],10);
		$credit=0;
		if ($memberID!=0)
		{
			$db->query('SELECT credit FROM member WHERE ID=?1memberID; ',array('1memberID'=>$memberID));
			$row=$db->read();
			if ($row) $credit=$row['credit'];
			else
			{
				echo json_encode(array('errmsg'=>'会员卡不存在'));
				exit;
			}
		}
		$db->query('SELECT price, creditGet FROM pPrice WHERE shopID=?1shopID AND pID=?pID AND startDate<=NOW() AND endDate>=NOW() AND creditReq<=?1credit ORDER BY price desc limit 0, 1;',array('1shopID'=>$_POST['shop'],'pID'=>$_POST['pID'],'1credit'=>$credit));
		$row=$db->read();
		if ($row)
		{
			$row['creditMember']=$credit;
			echo json_encode($row);
		}
		else
		{
			echo json_encode(array('errmsg'=>'商品报价不存在'));
		}
		break;
	case 'pay':
		$shopID=$_POST['shop'];
		$billID=$_POST['ID'];
		$pID=$_POST['pID'];
		$member=intval($_POST['member'],10);
		$price=$_POST['price'];
		$credit=$_POST['creditGet'];
		$param=array('1shopID'=>$shopID,'pID'=>$pID,'1memberID'=>$member,'1price'=>$price,'1credit'=>$credit,'1billID'=>$billID);
		$db->execute('INSERT INTO sales(pID, shopID, t, memberID, price, credit) VALUES(?pID, ?1shopID, NOW(), ?1memberID, ?1price, ?1credit) ;',$param);
		$db->execute('UPDATE bill SET salesID=LAST_INSERT_ID() WHERE ID=?1billID;',$param);
		$db->execute('UPDATE member SET credit=credit+?1credit WHERE ID=?1memberID;',$param);
		header('Content-type: text/javascript');
		echo "cashier_m('pay_done',".$billID.");";
		break;
}
?>