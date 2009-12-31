<?php
if (!preg_match('/^\/(\d+)\/(\d+)$/',$path_info,$m)) redirect();
$sender=$m[1];
$id=$m[2];
$reader=$_POST['xn_sig_user'];
$db->query('SELECT * FROM ###msg WHERE `sender`=?sender AND `id`=?0id',array('sender'=>$sender,'0id'=>$id));
$row=$db->read();
if (!$row) redirect();
$wh=htmlspecialchars($row['text']);
if ($reader!=$sender) $db->execute('REPLACE ###read (`msgid`,`reader`,`t`) VALUES (?0id,?reader,NOW())',array('0id'=>$id,'reader'=>$reader));
?>
<div style="clear:both;">
<div style="float:right;padding:10px;width:120px;">
<xn:profile-pic uid="<?php echo $sender; ?>" linked="true" size="normal"/>
<p style="font-size:14px;line-height:18px;">
<span id="sender_name"><xn:name uid="<?php echo $m[1]; ?>" linked="true" shownetwork="true"/></span><br/>
<?php echo $row['t']; ?>
</p>
</div>
<h1><xn:name uid="<?php echo $sender; ?>" linked="false"/> 用<b class="title">100种语言</b>说 <span style="font-size:11px;">[<a href="<?php echo APP_CANVAS; ?>">返回首页</a>]</span></h1>
<xn:iframe src="<?php echo APP_SERVER; ?>/view.htm?w=<?php echo $wh; ?>" width="550" height="500" addxnsig="false" frameborder="0" scrolling="no"/>
</div>
<xn:if-is-friends-with-viewer uid="<?php echo $sender; ?>">
<div style="margin-top:30px;">
<form action="post" method="post">
回复<xn:name uid="<?php echo $sender; ?>" linked="false"/>：
<input type="hidden" name="ids" value="<?php echo $sender; ?>"/>
<input type="text" name="w" class="ti"/>
<input type="submit" value="继续" class="btn"/>
</form>
</div>
</xn:if-is-friends-with-viewer>
<?php if ($reader==$sender) {
$db->query('SELECT COUNT(*) AS c FROM ###read WHERE `msgid`=?0id AND `t` IS NOT NULL',array('0id'=>$id));
$counter=$db->read();
?>
<div style="clear:both;margin-top:30px;">
<div style="width:320px;padding:5px 10px;float:left;">
<h2><?php echo $counter['c']; ?> 人阅读了本消息</h2>
<ul style="font-size:12px;line-height:15px;">
<?php
$db->query('SELECT * FROM ###read WHERE `msgid`=?0id AND `t` IS NOT NULL ORDER BY `t` DESC LIMIT 0,10',array('0id'=>$id));
while ($read=$db->read()) {
	echo '<li><xn:name uid="'.$read['reader'].'" linked="true"/> '.$read['t'].'</li>';
}
?>
</ul>
</div>
<div style="width:320px;padding:5px 10px;float:right;">

</div>
</div>
<?php } ?>
<script type="text/javascript">
(function(){
	document.getElementById('sender_name').getElementsByTagName('A')[0].appendChild(document.createElement('BR'));
})();
</script>