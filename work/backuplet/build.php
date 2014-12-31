<?php
$x=simplexml_load_file('sites.xml');
foreach ($x->site as $xsite) {
	$p=strval($xsite['p']);
	ob_start();
	$sitename=strval($xsite->name);
	$domain=strval($xsite->domain);
	$channels=array();
	foreach ($xsite->channel as $xch) {
		$channels[]=strval($xch->name);
	}
	$channels=implode('、',$channels);
?>
backuplet备份 <?php echo $sitename.' '.$channels."\r\n"; ?>

<p><a href="./">backuplet书签式网站导出/备份工具</a>支持<?php echo $sitename.' ('.$domain.')'; ?>，
可以将<?php echo $sitename.'的'.$channels; ?>导出/备份成一个文件，并保存到你的计算机上。
你再也不用担心<?php echo $sitename; ?>网站故障，导致你的<?php echo $channels; ?>丢失。</p>

<?php foreach ($xsite->channel as $xch) {
$chname=strval($xch->name);
?>
<h2>备份<?php echo $sitename.$chname; ?></h2>
<p>只需3步，你就可以将你或好友在<?php echo $sitename.'的'.$chname; ?>导出/备份成一个文件，并保存到你的计算机上。</p>
<ol>
<li class="step1">添加backuplet书签</li>
<li class="step2">访问你或好友的<?php echo $sitename.$chname; ?>首页<br/>
网址举例：<?php echo strval($xch->example); ?></li>
<li class="step3">点击backuplet书签</li>
</ol>
<?php } ?>

<script type="text/javascript">alimama_pid="mm_10110350_192293_8883533";alimama_titlecolor="0000FF";alimama_descolor ="000000";alimama_bgcolor="FFFFFF";alimama_bordercolor="E6E6E6";alimama_linkcolor="008000";alimama_bottomcolor="FFFFFF";alimama_anglesize="0";alimama_bgpic="0";alimama_icon="0";alimama_sizecode="12";alimama_width=468;alimama_height=60;alimama_type=2;</script><script src="http://a.alimama.cn/inf.js" type="text/javascript"></script>

<h2>特别提示</h2>
<ul>
<li>请勿将backuplet用于违反法律、违反<?php echo $sitename; ?>用户协议、侵犯隐私等用途，否则一切后果由使用者承担。</li>
<li>backuplet的原理是通过使用者的浏览器请求<?php echo $sitename; ?>的数据接口，不提供任何形式的代理服务器。如果你无法直接访问<?php echo $sitename; ?>网站，则你无法使用backuplet。</li>
<li>使用backuplet导出别人的<?php echo $channels; ?>时，将使用当前登录用户的会话cookies。如果好友设置了隐私设置、但授权你阅读，同样可以完成导出操作。这种情况下，你不应该将导出的文件发布到互联网上，以免侵犯好友的隐私。</li>
<li>backuplet是在Firefox浏览器的最新版本中开发、调试的。如果backuplet无法在其他浏览器中正常工作，则请换用Firefox浏览器。</li>
</ul>

<script type="text/javascript" src="instructions.js"></script>

<?php
	file_put_contents($p.'.a10.htm',ob_get_clean());
}
?>