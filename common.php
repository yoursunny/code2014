<?php

# --------------------登录认证--------------------
//程序URL
define('APP_ROOT','http://localhost');
//保存认证信息的cookie名称
define('COOKIE_AUTH','PhoneBook_auth');
//认证信息加密参数
define('AUTH_KEY','1b4777f328799b32e1201f23c1ef9173ffa1471322b7e2c3341ae7f');
//检查登录，返回用户id或NULL
function CheckLogin() {
	if (!isset($_COOKIE[COOKIE_AUTH])) return NULL;
	$a=explode('|',$_COOKIE[COOKIE_AUTH]);
	if (count($a)!=3) return NULL;
	if (sha1(AUTH_KEY.'|'.$a[0].'|'.$a[1])==$a[2] && $a[0]!='-') return $a[0];
}
//当前用户id
$uid=CheckLogin();
$pin='';
function WapCheckLogin() {
	global $uid,$pin,$x,$xp;
	$uid=@$_GET['u'];
	$pin=@$_GET['p'];
	if (!$uid || !$pin || !file_exists(UserFileName())) return FALSE;
	LoadUserFile();
	$PIN=tn($xp->query('pb:Owner/pb:WAPpin')->item(0));
	return ($pin==$PIN);
}
function WapLoginString() {
	global $uid,$pin;
	return 'u='.$uid.'&amp;p='.$pin;
}

# --------------------数据文件--------------------
//XML数据文件的xmlns命名空间
define('NS','http://www.65536.cn/work/2008/PhoneBook/ns/0001');
//数据文件DOM
$x=NULL;
//数据文件XPath
$xp=NULL;
//获取用户的数据文件名
function UserFileName() {
	global $uid;
	if ($uid==NULL) return NULL;
	return 'data/'.$uid{0}.'/'.$uid{1}.'/'.$uid.'.xml';
}
//获取或设置DOMNode的文本内容
function tn($node,$content=NULL) {
	if (get_class($node)=='DOMNodeList') $node=$node->item(0);
	if ($content!==NULL) {
		foreach ($node->childNodes as $c) $node->removeChild($c);
		$node->appendChild(new DOMText($content));
	}
	return $node->textContent;
}
//获取各节点的文本内容
function tn_each($nodelist) {
	$a=array();
	$len=$nodelist->length;
	for ($i=0;$i<$len;++$i) {
		array_push($a,tn($nodelist->item($i)));
	}
	return $a;
}
//读取用户的数据文件，如果不存在则创建
function LoadUserFile() {
	global $x,$xp,$uid;
	$fname=UserFileName();
	if ($fname==NULL) return NULL;
	$newuser=!file_exists($fname);
	$x=new DOMDocument();
	$x->load($newuser?'data/newuser.xml':$fname);
	$xp=new DOMXPath($x);
	$xp->registerNamespace('pb',NS);
	if ($newuser) {
		tn($xp->query('pb:Owner/pb:uid')->item(0),$uid);
	}
}
//保存当前打开的数据文件
function SaveUserFile() {
	global $x,$xp,$uid;
	tn($xp->query('pb:Owner/pb:uid')->item(0),$uid);
	$fname=UserFileName();
	@mkdir(dirname($fname),0777,TRUE);
	$x->save($fname);
}
//选择符合XPath表达式的<Person/>
//删除$x中不符合要求的标签
function SelectPerson($xpath) {
	global $x,$xp;
	$r=$x->documentElement;
	$q=$xp->query($xpath);
	while ($r->hasChildNodes())
		$r->removeChild($r->firstChild);
	$len=$q->length;
	for ($i=0;$i<$len;++$i)
		$r->appendChild($q->item($i));
}

# --------------------单个<Person/>操作--------------------
//查找指定id的<Person/>，返回element
//id格式错误返回NULL，找不到返回FALSE
function FindPerson($id) {
	global $x,$xp;
	if (!ctype_alnum($id)) return NULL;
	$q=$xp->query('pb:Person[@id=\''.$id.'\']');
	if ($q->length < 1) return FALSE;
	return $q->item(0);
}
//创建新的<Person/>，指派新的id
function CreatePerson() {
	global $x;
	$id='';
	do { $id=uniqid(); } while (FindPerson($id)!==FALSE);
	$p=$x->createElement('Person');
	$p->setAttribute('id',$id);
	return $p;
}
//删除指定类型的子element
function RemoveEntry($p,$type) {
	global $xp;
	$q=$xp->query('pb:'.$type,$p);
	$len=$q->length;
	for ($i=0;$i<$len;++$i)
		$p->removeChild($q->item($i));
}
//插入子element
function AddEntry($p,$type,$value,$attributes=array()) {
	global $x;
	$e=$x->createElement($type,$value);
	foreach ($attributes as $k=>$v) {
		$e->setAttribute($k,$v);
	}
	$p->appendChild($e);
}
//用JSON数据(已经解析好的array)更新<Person/>
function PersonFromJSON($p,$o) {
	while ($p->hasChildNodes()) $p->removeChild($p->firstChild);
	AddEntry($p,'Name',$o['Name']);
	foreach ($o['Tag'] as $entry) AddEntry($p,'Tag',$entry);
	AddEntry($p,'Email',$o['Email']);
	foreach ($o['Phone'] as $entry) AddEntry($p,'Phone',$entry['n'],array('type'=>$entry['type']));
	foreach ($o['Address'] as $entry) AddEntry($p,'Address',$entry['n'],array('type'=>$entry['type']));
	foreach ($o['IM'] as $entry) AddEntry($p,'IM',$entry['n'],array('type'=>$entry['type']));
	AddEntry($p,'Company',$o['Company']);
	foreach ($o['Custom'] as $entry) AddEntry($p,'Custom',$entry['n'],array('type'=>$entry['type']));
	foreach ($o['Web'] as $entry) AddEntry($p,'Web',$entry);
	foreach ($o['Meet'] as $entry) AddEntry($p,'Meet','',array('type'=>$entry['type'],'event'=>@$entry['ev'],'year'=>@$entry['year'],'year2'=>@$entry['year2'],'see'=>@$entry['see']));
	AddEntry($p,'Notes',$o['Notes']);
}

# --------------------输出--------------------
//JSON输出
function re($o) {
	header('Content-Type: application/json');
	echo json_encode($o);
}
//XML输出$x
function rex() {
	global $x;
	header('Content-Type: application/xml');
	echo $x->saveXML();
}
?>