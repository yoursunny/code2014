<?php
$PR->head('阳光男孩的网上名片','/m/','zh','yoursunny.cn');
?>
<style>
.m-list >li { padding-top:10px; }
</style>
<?php
$PR->header();
?>
<div class="container">
<h1>阳光男孩的网上名片</h1>
<div class="row"><div class="span4"><ul class="m-list unstyled">

<li><i class="icon-x"><img src="<?php echo ICON_GMAIL; ?>" alt="Email"></i> <img src="email.php?n=1&amp;l=1" alt="" style="background:url(email.php?n=1&amp;l=0);max-width:none;">
<br><small>每天多次阅读邮件</small>

<li><i class="icon-x"><img src="<?php echo ICON_VOICE; ?>" alt="Phone"></i> +1 804 457 8669 <a href="#callModal" role="button" data-toggle="modal">更多</a>
<br><small>不上课时接电话</small>

<li><i class="icon-time"></i> <?php clock(); ?>
<br><small>晚上11点-早上6点为睡觉时间</small>

<li><i class="icon-x"><img src="<?php echo ICON_FANFOU; ?>" alt="饭否"></i> <a href="http://fanfou.com/sunnyboy">阳光男孩</a>
<br><small>每周手机登录</small>

<li><i class="icon-x"><img src="<?php echo ICON_RENREN; ?>" alt="人人网"></i> <a href="http://www.renren.com/200037590">人人网个人主页</a>
<br><small>每周手机登录</small>

</ul></div><div class="span4">

<img src="//www.gravatar.com/avatar/70a55686123e015e401aaa2783632534?s=300" class="img-rounded" alt="阳光男孩的照片">

</div><div class="span4"><ul class="m-list unstyled">

<li><i class="icon-x"><img src="<?php echo ICON_ARIZONA; ?>" alt="亚利桑那大学"></i> <a href="http://www.cs.arizona.edu/people/shijunxiao/">研究生</a>

<li><i class="icon-thumbs-up"></i> 坚信开放和自由的互联网

<li><i class="icon-x"><img src="<?php echo ICON_ANDROID; ?>" alt="Android"></i> 4块Android切菜板

<li class="dropdown"><i class="icon-film"></i> <a class="dropdown-toggle" data-toggle="dropdown" href="#">真人秀</a>粉丝
  <ul class="dropdown-menu">
    <li><a href="http://www.cbs.com/shows/amazing_race/">极速前进</a>
    <li><a href="http://www.cbs.com/shows/big_brother/">老大哥</a>
    <li><a href="http://www.mtv.com/shows/real_world/portland/series.jhtml">The Real World</a>
  </ul>
<br><small>不需要字幕</small>

<li><i class="icon-film"></i> <a href="https://www.facebook.com/yoursunny/movies">爱看电影</a>

<li><i class="icon-x"><img src="<?php echo ICON_GEOCACHING; ?>" alt="Geocaching"></i> <a href="http://www.geocaching.com/profile/?guid=e344547e-a2c2-4544-817a-76ffee1e1afb">地谜藏宝玩家</a>

</ul></div></div></div>
<?php
$PR->footer();
?>
<div id="callModal" class="modal hide fade" tabindex="-1" role="dialog"><div class="modal-header">
  <button type="button" class="close" data-dismiss="modal">×</button>
  <h3>语音通话</h3>
</div><div class="modal-body">
  <ul class="nav nav-pills">
    <li class="active"><a href="#callNumbers" data-toggle="tab">电话号码</a>
    <li><a href="#callPSTN" data-toggle="tab" id="callPSTNl">传统电话</a>
    <li><a href="#callVoIP" data-toggle="tab" id="callVoIPl">网络电话</a>
  </ul>
  <div class="tab-content">
    <div class="tab-pane active" id="callNumbers">
      <ul>
        <li>美国号码: +1 804 457 8669
        <li>国际号码: +883 5100 1202 3660
        <li><img src="email.php?n=4&amp;l=1" alt="" style="background:url(email.php?n=4&amp;l=0);max-width:none;">
      </ul>
      <p>注：美国号码始终在线。国际号码和SIP只在部分时段在线。</p>
    </div>
    <div class="tab-pane" id="callPSTN">
      <p>请拨打+1 804 457 8669</p>
    </div>
    <div class="tab-pane" id="callVoIP">
      <button type="button" id="callBtn" class="btn btn-warning" disabled data-t-call="拨打" data-t-hangup="挂断" data-t-calling="正在呼叫" data-t-ringing="正在振铃" data-t-answered="已接通">正在登录</button>
      <p>请允许麦克风权限。</p>
      <p>你也可以在SIP话机上拨打<img src="email.php?n=4&amp;l=1" alt="" style="background:url(email.php?n=4&amp;l=0);max-width:none;"></p>
    </div>
  </div>
</div></div>
<?php phono_script(); ?>
<script>
$('#callVoIPl').one('show',phono_connect);
</script>
