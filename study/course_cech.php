<?php
require 'course_downpage.php';

// http://fs%1.bay.cech.com.cn/download/file_share_%2.html , $key=%1/%2
function course_cech($title,$desc,$file,$link,$key) {
	global $course_name,$course_code,$course_teacher,$course_link;
	$k=explode('/',$key);
	course_downbefore($title,$desc,$file,2);
?>
<p>你下载的文件 <b><?php echo htmlspecialchars($title); ?></b> 来自畅易网盘。</p>
<p>3秒后自动进入畅易网盘：<a id="cech_disk" href="http://fs<?php echo $k[0]; ?>.bay.cech.com.cn/download/file_share_<?php echo $k[1]; ?>.html">下载<?php echo htmlspecialchars($title); ?></a><br/>
进入后，请点击“立即下载”，然后使用普通HTTP电信或网通链接下载。</p>
<script type="text/javascript">//<![CDATA[
(function(){location.replace($('cech_disk').href);}).delay(3);
//]]></script>
<?php
	course_downafter($title,$desc,$file,2);
}
?>