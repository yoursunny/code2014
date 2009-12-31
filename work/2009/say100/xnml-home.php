<div style="text-align:center;">
<h1>我要用<b class="title">100种语言</b>说</h1>
<form action="post" method="post">
<input type="text" name="w" class="ti"/>
<input type="submit" value="继续" class="btn"/>
</form>
</div>
<div style="clear:both;margin-top:30px;">
<div style="width:320px;padding:5px 10px;float:left;">
<h2>我发出的消息</h2>
<?php
$db->query('SELECT `id`,`sender`,`to`,`text`,###msg.`t` AS `t`,COUNT(###read.`t`) AS `c` FROM ###msg LEFT JOIN ###read ON `id`=`msgid` WHERE `sender`=?sender GROUP BY `msgid` ORDER BY `id` DESC LIMIT 0,4',array('sender'=>$_POST['xn_sig_user']));
if ($db->eof()) echo '<p>你还没有发送过消息，马上发送一条吧。</p>';
while ($row=$db->read()) {
	echo '<dl class="msg sent-'.$row['to'].' '.($row['c']>0?'read':'unread').'">';
	echo '<dt class="text"><a href="'.APP_CANVAS.'/'.$row['sender'].'/'.$row['id'].'">'.htmlspecialchars($row['text']).'</a></dt>';
	echo '<dd class="time" title="'.$row['t'].'">'.$row['t'].'</dd>';
	echo '<dd class="read">'.$row['c'].'人读过</dd>';
	echo '</dl>';
}
?>
<?php
/*
<h2>我发出的消息</h2>
<dl class="msg sent-feed unread">
<dt class="text"><a href="http://apps.xiaonei.com/say-it-to/view/200037590/1234">新年快乐</a></dt>
<dd class="time" title="2009-01-01 00:00:00">4小时前</dd>
<dd class="read">没人读过</dd>
</dl>
<dl class="msg sent-feed read">
<dt class="text"><a href="http://apps.xiaonei.com/say-it-to/view/200037590/1234">万事如意</a></dt>
<dd class="time" title="2009-01-01 00:00:00">3天前</dd>
<dd class="read">16人读过</dd>
</dl>
<dl class="msg sent-friend read">
<dt class="text"><a href="http://apps.xiaonei.com/say-it-to/view/200037590/1234">我爱你</a></dt>
<dd class="time" title="2009-01-01 00:00:00">4小时前</dd>
<dd class="read"><a href="http://xiaonei.com/profile.do?id=200037590">sunny 石君霄</a> 已读</dd>
</dl>
<dl class="msg sent-friend unread">
<dt class="text"><a href="http://apps.xiaonei.com/say-it-to/view/200037590/1234">我不爱你</a></dt>
<dd class="time" title="2009-01-01 00:00:00">4小时前</dd>
<dd class="read"><a href="http://xiaonei.com/profile.do?id=200037590">sunny 石君霄</a> 未读</dd>
</dl>
*/
?>
</div>
<div style="width:320px;padding:5px 10px;float:right;">
<?php
/*
<h2>我收到的消息</h2>
<dl class="msg recv-friend">
<dt class="text"><a href="http://apps.xiaonei.com/say-it-to/view/200037590/1234">新年快乐</a></dt>
<dd class="time" title="2009-01-01 00:00:00">4小时前</dd>
<dd class="sender"><a href="http://xiaonei.com/profile.do?id=200037590">sunny 石君霄</a></dd>
</dl>
<dl class="msg recv-friend">
<dt class="text"><a href="http://apps.xiaonei.com/say-it-to/view/200037590/1234">万事如意</a></dt>
<dd class="time" title="2009-01-01 00:00:00">3天前</dd>
<dd class="sender"><a href="http://xiaonei.com/profile.do?id=200037590">sunny 石君霄</a></dd>
</dl>
<dl class="msg recv-friend">
<dt class="text"><a href="http://apps.xiaonei.com/say-it-to/view/200037590/1234">新年快乐</a></dt>
<dd class="time" title="2009-01-01 00:00:00">4小时前</dd>
<dd class="sender"><a href="http://xiaonei.com/profile.do?id=200037590">sunny 石君霄</a></dd>
</dl>
<dl class="msg recv-friend">
<dt class="text"><a href="http://apps.xiaonei.com/say-it-to/view/200037590/1234">万事如意</a></dt>
<dd class="time" title="2009-01-01 00:00:00">3天前</dd>
<dd class="sender"><a href="http://xiaonei.com/profile.do?id=200037590">sunny 石君霄</a></dd>
</dl>
*/
?>
</div>
</div>
<?php
appstat('home');
?>