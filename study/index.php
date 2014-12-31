<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013.php';

$PR->head('学习','/study/');
$PR->header();
?>
<div class="container"><div class="row"><div class="span3">

<div data-spy="affix">
<h1>学习</h1>

<ul class="nav nav-pills nav-stacked hash-scroll">
<li><a href="#humanity">人文社科类课程</a>
<li><a href="#science">自然科学类课程</a>
<li><a href="#computer">计算机类课程</a>
<li><a href="#electronic">电子技术类课程</a>
<li><a href="#communication">通信类课程</a>
<li><a href="#misc">其他课程</a>
</ul>
</div>

</div><div class="span7">

<h3 id="humanity">人文社科类课程</h3>
<ul>
<li><a href="TH002/">思想道德修养</a>
<li><a href="MU019/">中外艺术歌曲欣赏</a>
<li><a href="/t/2007/google-ad/">现代广告学</a> <small>从谷歌谈网络广告媒体</small>
</ul>
<h3 id="science">自然科学类课程</h3>
<ul>
<li><a href="IS407/">现代密码学</a>
<li><a href="IS201/">信息安全的数学基础</a>
<li><a href="EI223/">电磁场</a>
</ul>
<h3 id="computer">计算机类课程</h3>
<ul>
<li><a href="IS206/">操作系统</a>
<li><a href="EI209/">计算机组成与体系结构</a>
<li><a href="IS214/">数据库原理</a>
<li><a href="IS219/">Windows安全原理与技术</a>
<li><a href="IS203/">编译原理</a>
<li><a href="EI102/">数据结构与算法</a>
<li><a href="EE305/">微机原理与接口技术</a>
<li><a href="/work/hProxyN/">大型系统软件课程设计</a> <small>hProxyN代理服务器</small>
<li><a href="/t/2007/iptables/">信息安全科技创新</a> <small>计算机网络安全访问控制系统的实现</small>
</ul>
<h3 id="electronic">电子技术类课程</h3>
<ul>
<li><a href="IS222/">嵌入式系统原理与应用</a>
<li><a href="IS208/">数字系统设计、FPGA应用实验</a>
<li><a href="EI103/">电院科技创新1</a> <small>调频无线话筒,DT832万用表</small>
<li><a href="EI205/">数字电子技术</a>
<li><a href="/t/2007/elevator/">数字电子技术实验</a> <small>AHDL电梯控制器</small>
</ul>
<h3 id="communication">通信类课程</h3>
<ul>
<li><a href="IS409/">下一代网络及软交换原理</a>
<li><a href="IS404/">数据通信</a>
<li><a href="IS205/">信息论与编码</a>
<li><a href="IS204/">计算机通信网络</a>
<li><a href="IS216/">Internet安全协议与标准</a>
<li><a href="IS406/">数字程控交换</a>
<li><a href="IS401/">移动通信</a>
<li><a href="IS410/">路由器原理</a>
<li><a href="/t/2008/underwater-communication/">数字信号处理DSP</a> <small>超声波水下扩频通信系统的设计</small>
</ul>
<h3 id="misc">其他课程</h3>
<ul>
<li><a href="IS221/">信息安全工程原理</a>
<li><a href="IS215/">网络信息安全基础</a>
<li><a href="IS220/">信息安全管理体系及技术</a>
<li><a href="chemistry/">高中化学</a>
</ul>

</div><div class="span2">
<?php $PR->adsense(160,600); ?>
</div></div></div>

<?php
$PR->footer();
?>
