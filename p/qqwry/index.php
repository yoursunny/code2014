<?php
require_once $_SERVER["DOCUMENT_ROOT"].'/include/2011.php';
$PR->starthtml();
$PR->head('纯真IP数据库批量查询','/p/qqwry/');
$PR->startbody();
$PR->header();
$PR->startcontent(PageRenderHelper::main);
?>
<h1>纯真IP数据库批量查询</h1>

<p>纯真IP数据库（qqwry.dat）批量查询PHP脚本，qqwry.lib.php。此脚本适合一次性查询大量IP地址的归属地，比如在几万行的网站日志文件中添加IP归属地。</p>

<h2>接口使用示例</h2>
<p>使用前请<a href="http://code.google.com/p/yoursunny/downloads/detail?name=qqwry_20111005.tar.bz2">下载纯真IP数据库批量查询PHP脚本</a>，并<a href="http://www.onlinedown.net/soft/19051.htm" onclick="W.trackout(this.href)">获取纯真IP数据库</a>存储qqwry.dat于同一目录。</p>
<pre><code>
require 'qqwry.lib.php';
$qqwry=new QQWRY;
$ip_arr=array();
$ip_arr[]=ip2long('8.8.8.8');
$ip_arr[]=ip2long('10.0.0.1');
$results=$qqwry->query($ip_arr);
foreach ($results as $ip=>$record) {
    echo long2ip($ip).' '.$record->get_c().' '.$record->get_a()."\n";
}
</code></pre>

<h2>批量替换API使用示例</h2>
<p>此方式将会上传你的文件到本站API服务器。absolutely no warranty, use at your own risk</p>
<p><code>wget http://pubapi1.yoursunny.com/qqwry/replace1.php --post-file=input.txt -Ooutput.txt</code></p>
<p>replace1.php接受fmt参数，例如?fmt=%24ip%20(%24c%20%24a)，默认值是$ip ($c $a)；找到的IPv4地址均会按此格式替
换。其中，$ip表示IP地址，$c表示国家/地区记录，$a表示城市/接入商记录。</p>

<h2>批量替换脚本使用示例</h2>
<p>使用前请<a href="http://code.google.com/p/yoursunny/downloads/detail?name=qqwry_20111005.tar.bz2">下载纯真IP数据库批量查询PHP脚本</a>，并<a href="http://www.onlinedown.net/soft/19051.htm" onclick="W.trackout(this.href)">获取纯真IP数据库</a>存储qqwry.dat于同一目录。</p>
<p><code>php5 replace-cli.php input.txt output.txt</code></p>
<p>格式是$ip ($c $a)。若需要其他格式，请修改replace-cli.php代码。</p>

<?php
$PR->endcontent();
$PR->footer();
$PR->endhtml();
?>
