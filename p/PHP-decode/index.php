<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013.php';

$PR->addlib('prettify');
$PR->head('PHP解密工具','/p/PHP-decode/');
$PR->header();
?>
<div class="container"><div class="row"><div class="span8">
<h1>PHP解密工具</h1>

<ul class="nav nav-tabs">
  <li class="active"><a href="#input" data-toggle="tab">代码输入</a>
  <li class="hide"><a id="tab_result" href="#result" data-toggle="tab">解密结果</a>
  <li><a href="#info" data-toggle="tab">功能说明</a>
  <li><a href="#api" data-toggle="tab">API v1</a>
</ul>

<div class="tab-content">
<div class="tab-pane active" id="input">

<form id="f_code">
  <textarea class="span8" id="i_code" placeholder="经过编码混淆的PHP代码" rows="10"></textarea>
  <div class="form-actions">
    <button class="btn btn-primary" type="submit">PHP解码</button>
  </div>
</form>

</div><div class="tab-pane" id="result">

<pre id="d_result" class="prettyprint"></pre>

</div><div class="tab-pane" id="info">

<p>本工具可以解码用 微盾PHP脚本加密专家 （vidun 威盾PHP脚本加密专家、VirtualWall PHPCodeLock） V1.0.0.1000 加密过的PHP脚本。这类PHP程序往往会包含形如 $OOO0O0O00=__FILE__;<wbr>$OOO000000<wbr>=urldecode<wbr>('%74%68%36%73%62%65%68%71%6c%61%34%63%6f%5f%73%61%64%66%70%6e%72');、<wbr>eval(($$O0O0000O0( 等代码。本工具可以处理在“微盾PHP脚本加密专家”勾选Enable Encoding、Enable Obfuscation等选项后，经过编码、混淆的PHP代码，可以将威盾加密过的代码恢复成接近于原文。</p>
<p>相关技术文章：<a href="/t/2009/PHP-decode-2/">又一个加密PHP脚本的解码方法</a></p>

</div><div class="tab-pane" id="api">

<p>PHP-decode API为开发者提供与《PHP解密工具》等价的解密PHP脚本功能。本文档描述了PHP-decode API版本1。</p>

<h2>使用方法</h2>

<h3>第1步 服务地址发现</h3>
<p>请对 http://yoursunny.com/ 执行<a href="http://en.wikipedia.org/wiki/Yadis">Yadis</a>服务发现流程，找到类型为 http://yoursunny.com/work/PHP-decode/?ns=APIv1 的服务URI。</p>
<p>你也可以直接使用这个服务URI： http://pubapi1.yoursunny.com/PHP-decode/APIv1.php <br>但是若服务URI调整，你的客户端程序将停止运行。</p>

<h3>第2步 调用解密服务</h3>
<p>向上一步找到的服务URI发送下列HTTP请求：</p>
<ul>
<li>method: POST</li>
<li>Content-Type: application/x-httpd-php</li>
<li>request body: 要解密的PHP脚本</li>
<li>为了提高性能，请勿使用Expect: 100-continue</li>
</ul>
<p>读取HTTP响应：</p>
<ul>
<li>HTTP状态码是200：解密成功，response body是解密后的PHP脚本</li>
<li>HTTP状态码是400：解密失败</li>
<li>其他情况：API错误</li>
</ul>

<h2>注意事项</h2>
<ul>
<li>API为免费提供，yoursunny.com有权随时停止此服务。</li>
<li>API解密的PHP脚本，版权归原作者所有；请勿利用API进行侵犯他人权益的操作，否则后果自负。</li>
</ul>

</div></div>

</div><div class="span4">
<?php $PR->adsense(300,250); ?>
</div></div></div>

<div id="alert_fail" class="modal hide fade">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h3>解密失败</h3>
  </div>
  <div class="modal-body">
    <p>可能的原因有：</p>
    <ul>
      <li>PHP解密API不能识别该脚本：本工具只支持微盾PHP脚本加密专家编码、混淆的脚本。
      <li>网页无法连接到PHP解密API：请使用支持跨域XmlHttpRequest的浏览器，例如Chrome、Firefox。
    </ul>
  </div>
</div>

<?php
$PR->footer();
?>
<script>
$('#f_code').on('submit',function(){
	var code = $('#i_code').val();
	$.post('http://pubapi1.yoursunny.com/PHP-decode/APIv1.php',code)
		.success(function(result){
			var pretty_result = prettyPrintOne($('<pre>').text(result).html(),'php');
			$('#d_result').html(pretty_result);
			$('#tab_result').parent().removeClass('hide').end().tab('show');
		})
		.error(function(){
			$('#alert_fail').modal('show');
		});
	return false;
});
</script>
