<html><head><meta http-equiv="Content-Type" content="text/html; charset=gb2312" /><title>yoursunny.com你的阳光的智能自助友情链接,申请友情链接</title><style>body,td{FONT-SIZE: 9pt} A:link,A:visited {color:blue}A:active,A:hover {color:red;}</style></head><body>

<!-- ########## 不能修改的代码 开始 ##########  -->
<?php
function my_file_get_contents($url, $timeout=30)	{
	if ( function_exists("curl_init") )	{
		$ch = curl_init();
		curl_setopt ($ch, CURLOPT_URL, $url);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$file_contents = curl_exec($ch);
		curl_close($ch);
	} else if ( ini_get("allow_url_fopen") == 1 || strtolower(ini_get("allow_url_fopen")) == "on" )	{
		$file_contents = @file_get_contents($url);
	} else {
		$file_contents = "";
	}
	return $file_contents;
}
error_reporting(0);
set_time_limit(0);
echo my_file_get_contents("http://www.Lian123.com/all_link/66/5416.html");
?>
<!-- ########## 不能修改的代码 结束 ##########  -->

</body></html>