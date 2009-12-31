<?php
$w=''.@$_POST['w'];
if ($w=='') redirect();
$wh=htmlspecialchars($w);
$uid=$_POST['xn_sig_user'];
$viewurl='';
$msgid=0;
function save_msg($reader=NULL) {
	global $db,$uid,$msgid,$w,$viewurl;
	//$msgid=1;
	$db->execute("INSERT INTO ###msg (`sender`,`to`,`text`,`t`) VALUES (?sender,?to,?text,NOW())",array('sender'=>$uid,'to'=>$reader==NULL?'feed':'friend','text'=>$w));
	$msgid=$db->insert_id();
	if ($reader!=NULL) $db->execute("INSERT INTO ###read (`msgid`,`reader`) VALUES (?0msgid,?reader)",array('0msgid'=>$msgid,'reader'=>$reader));
	$viewurl=APP_CANVAS.'/'.$uid.'/'.$msgid;
}
$to=@$_POST['to'];
switch($to) {
	case 'feed':
		save_msg();
		xiaonei_api('xiaonei.feed.publishTemplatizedAction',array('template_id'=>'1','title_data'=>json_encode(array('uid'=>$uid,'msgid'=>$msgid)),'body_data'=>json_encode(array('msg'=>$w))));
		break;
	case 'friend':
		if (!isset($_POST['ids'])) {
			redirect('/post?w='.urlencode($w));
		}
		$ids=$_POST['ids'];
		if (is_array($ids)) $ids=$ids[0];
		save_msg($ids);
		$notification='<xn:name uid="'.$uid.'" linked="true" shownetwork="true"/>用100种语言对你说了一句话，<a href="'.$viewurl.'">点击查看</a>';
		xiaonei_api('xiaonei.notifications.send',array('to_ids'=>$ids,'notification'=>$notification));
		break;
	default:
		redirect('/post?w='.urlencode($w));
		break;
}
?>
<div>
<h1>已经用<b class="title">100种语言</b>说出</h1>
<p style="text-align:center;"><span class="text"><?php echo $wh; ?></span></p>
</div>
<ul style="margin-top:20px;">
<?php
if ($to=='feed') echo '<li>消息将出现在你的个人新鲜事</li>';
if ($to=='friend') echo '<li>好友 <xn:name uid="'.$ids.'" linked="true" shownetwork="true"/> 将收到通知</li>';
echo "\r\n";
?>
<li><a href="<?php echo $viewurl; ?>">查看已发出的消息</a></li>
<li><a href="<?php echo APP_CANVAS; ?>">发送下一条消息</a></li>
</ul>
<?php
appstat('send');
?>