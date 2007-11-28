<?php
require_once 'common.php';
switch ($_GET['a'])
{
	case 'autocompleter':
		$pID=$_POST['pID'];
		if (strlen($pID)==13) { echo '<ul></ul>'; exit; }
		$db->query("SELECT * FROM product WHERE ID LIKE CONCAT(?pID,'%') LIMIT 0,5",array('pID'=>$pID));
		echo '<ul>';
		while ($row=$db->read())
		{
			echo '<li>'.$row['ID'].'<span class="informal"><br/>'.htmlspecialchars($row['pName']).'</span></li>';
		}
		echo '</ul>';
		break;
	case 'available':
		$db->execute_sql('DELETE FROM bill WHERE salesID is null AND t<NOW()-interval 30 minute;');
		$pID=$_POST['pID'];
		$shop=$_POST['shop'];
		$db->query('SELECT n FROM pAvailable WHERE shopID=?1shopID AND pID=?pID;',array('1shopID'=>$shop,'pID'=>$pID));
		if ($row=$db->read()) echo json_encode(array('shop'=>$shop,'pID'=>$pID,'available'=>true,'msg'=>'本店可提取'.$row['n'].'件'));
		else echo json_encode(array('shop'=>$shop,'pID'=>$pID,'available'=>false,'msg'=>'商品不存在或本店无货可提取'));
		break;
	case 'submit':
		$pID=$_POST['pID'];
		$shop=$_POST['shop'];
		$db->execute('INSERT INTO bill(shopID, t, pID, receiptPrinted) VALUES(?1shopID, NOW(), ?pID, 0) ;',array('1shopID'=>$shop,'pID'=>$pID));
		header('Content-type: text/javascript');
		echo "alert('开购物单成功 (作为演示，不打印)');gohome();";
}
?>