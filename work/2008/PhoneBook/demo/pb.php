<?php
//yoursunny.P2008.PhoneBook
//个人电话本，服务端接口
header('X-PhoneBook-Version: yoursunny.P2008.PhoneBook/20080701');
require_once 'common.php';
//error_reporting(E_ALL);
//ini_set('display_errors','On');
if (!isset($_POST['a'])) { header('HTTP/1.1 400 Invalid Request'); die('数据提交错误'); }
if ($uid==NULL) {
	header('HTTP/1.1 403 Please Login');
	header('X-PhoneBook-Login: required');
	die('Please Login');
}
$action=$_POST['a'];
switch ($action) {

	case 'nop':
	//空操作(可用于检查是否登录)
	break;

	case 'basic':
	//获取基本信息
	//Owner:{uid:...,WAPtinyurl:...,WAPpin:...},
	//Tags:[{n:name,c:count},...],
	//Phone_types:[{n:name,c:count},...],
	//Address_types:[{n:name,c:count},...],
	//IM_types:[{n:name,c:count},...],
	//Custom_types:[{n:name,c:count},...],
	{
		LoadUserFile();
		$a=array();
		$q=$xp->query('pb:Owner')->item(0);
		$uid_=tn($xp->query('pb:uid',$q));
		$WAPtinyurl=tn($xp->query('pb:WAPtinyurl',$q));
		$WAPpin=tn($xp->query('pb:WAPpin',$q));
		$a['Owner']=array('uid'=>$uid_,'WAPtinyurl'=>$WAPtinyurl,'WAPpin'=>$WAPpin);
		function name_count_pair(&$v,$k) {
			$v=array('n'=>$k,'c'=>$v);
		}
		function name_count_array($a) {
			$a=array_count_values($a);
			array_walk($a,'name_count_pair');
			return array_values($a);
		}
		$a['Tags']=name_count_array(tn_each($xp->query('pb:Person/pb:Tag')));
		$a['Phone_types']=name_count_array(tn_each($xp->query('pb:Person/pb:Phone/@type')));
		$a['Address_types']=name_count_array(tn_each($xp->query('pb:Person/pb:Address/@type')));
		$a['IM_types']=name_count_array(tn_each($xp->query('pb:Person/pb:IM/@type')));
		$a['Custom_types']=name_count_array(tn_each($xp->query('pb:Person/pb:Custom/@type')));
		re($a);
	}
	break;

	case 'all':
	//获取全部Person
	{
		LoadUserFile();
		SelectPerson('pb:Person');
		rex();
	}
	break;
	
	case 'person':
	//创建、更新、删除一个Person
	{
		$id=$_POST['id'];
		$create=$id=='_';
		$delete=$id{0}=='-';
		if ($delete) $id=substr($id,1);
		else {
			$o=json_decode($_POST['p'],TRUE);
			if (!$o) { header('HTTP/1.1 500 JSON Decode Error'); die('JSON解码出错'); }
		}
		LoadUserFile();
		$r=$x->documentElement;
		if ($create) {
			$p=CreatePerson();
			PersonFromJSON($p,$o);
			$r->appendChild($p);
		} else {
			$p=FindPerson($id);
			if (!$p) exit();
			if ($delete) {
				$r->removeChild($p);
			} else {
				PersonFromJSON($p,$o);
			}
		}
		SaveUserFile();
		re(array('create'=>$create,'delete'=>$delete,'id'=>$p->getAttribute('id')));
	}
	break;
	
	case 'multi_delete':
	//按ID删除多个联系人
	{
		$ids=explode(',',$_POST['id']);
		LoadUserFile();
		$r=$x->documentElement;
		foreach ($ids as $id) {
			$p=FindPerson($id);
			if ($p) $r->removeChild($p);
		}
		SaveUserFile();
		re(array('delete'=>TRUE,'id'=>$ids));
	}
	break;
	
	case 'multi_tag':
	//按ID对多个联系人添加或删除标签
	{
		$P=json_decode($_POST['P'],TRUE);
		LoadUserFile();
		foreach ($P as $id=>$tags) {
			$p=FindPerson($id);
			if ($p) {
				RemoveEntry($p,'Tag');
				$tags=explode(',',$tags);
				foreach ($tags as $tag) if (strlen($tag)>0) AddEntry($p,'Tag',$tag);
			}
		}
		SaveUserFile();
		re(NULL);
	}
	break;
	
	case 'WAPtinyurl':
	//为手机访问申请短URL地址
	{
		LoadUserFile();
		$e=$xp->query('pb:Owner/pb:WAPtinyurl')->item(0);
		$u=tn($e);
		if (strlen($u)<1) {
			$u=file_get_contents('http://tieurl.com/api_text?url='.urlencode(APP_ROOT.'/wap_login.php?u='.$uid));
			tn($e,$u);
			SaveUserFile();
		}
		re(array('WAPtinyurl'=>$u));
	}
	break;

	case 'WAPpin':
	//设置手机登录密码
	{
		LoadUserFile();
		$e=$xp->query('pb:Owner/pb:WAPpin')->item(0);
		tn($e,$_POST['pin']);
		SaveUserFile();
		re(NULL);
	}
	break;

}
?>