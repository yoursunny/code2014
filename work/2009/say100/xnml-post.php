<?php
$w=''.@$_POST['w'];
if ($w=='') redirect();
$wh=htmlspecialchars($w);
?>
<p>我要用100种语言说 <span class="text"><?php echo $wh; ?></span> <span style="font-size:11px;">[<a href="<?php echo APP_CANVAS; ?>">返回修改</a>]</span></p>
<xn:iframe src="<?php echo APP_SERVER; ?>/view.htm?w=<?php echo $wh; ?>" width="640" height="300" addxnsig="false" frameborder="0" scrolling="no"/>
<form action="send" method="post">
<input type="hidden" name="w" value="<?php echo $wh; ?>"/>
<div style="clear:both;margin-top:30px;">
<div style="width:320px;padding:5px 10px;float:left;">
<h2><input type="radio" name="to" value="feed" <?php echo isset($_POST['ids'])?'':'checked="checked"'; ?> onclick="document.getElementById('to_friend').setStyle('visibility','hidden');"/> 发布到个人新鲜事</h2>
<h2><input type="radio" name="to" value="friend" <?php echo isset($_POST['ids'])?'checked="checked"':''; ?> onclick="document.getElementById('to_friend').setStyle('visibility','');"/> 发送给好友</h2>
<div id="to_friend" style="line-height:14px;font-size:12px;<?php echo isset($_POST['ids'])?'':'visibility:hidden;'; ?>">
<xn:multi-friend-selector max="1" include_me="true" selected_ids="<?php echo @$_POST['ids']; ?>"/>
<p>注：每天只能给发送8条消息给好友</p>
</div>
</div>
<div style="width:320px;padding:5px 10px;float:right;">
<h2>支持的语言</h2>
<ul style="font-size:13px;line-height:16px;margin-bottom:18px;">
<li>谷歌翻译提供的所有语言：阿拉伯语,保加利亚语,中文(简体和繁体),加泰罗尼亚语,克罗地亚语,捷克语,丹麦语,荷兰语,英语,菲律宾语,芬兰语,法语,德语,希腊语,希伯来语,北印度语,印度尼西亚语,意大利语,日语,韩语,拉脱维亚语,立陶宛语,挪威语,波兰语,葡萄牙语,罗马尼亚语,俄语,西班牙语,塞尔维亚语,斯洛伐克语,斯洛维尼亚语,瑞典语,乌克兰语,越南语</li>
<li>中文的汉语拼音</li>
<li>英文的莫尔斯电码(即将支持)</li>
</ul>
<input type="submit" value="用100种语言发送" class="btn"/>
</div>
</div>
</form>
<?php
appstat('post');
?>