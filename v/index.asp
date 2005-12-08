<%@LANGUAGE="VBSCRIPT" CODEPAGE="936"%>
<HTML>
<HEAD>
<META http-equiv="Content-Type" content="text/html; charset=gb2312">
<TITLE>Our Dictionary</TITLE>
<script language="JavaScript" type="text/JavaScript">
<!--
function MM_callJS(jsStr) { //v2.0
  return eval(jsStr)
}
//-->
</script>
</HEAD>

<BODY>
<H1>Our Dictionary</H1>
<P>--a web-based dictionary created by and available for everyone in our class</P>
<P>根据老师12/13的要求，我已经修改了本程序，但离线工具没有改。<BR>
已经不能够使用离线工具进行录入！但是查看还是可以的，不过分类名称不对。<BR>
录入的方法是：点击<A href="login.asp">Add words</A>，然后用Jaccount（即交大邮箱）登录后录入，<BR>
请注意选择正确的单词类别！<BR>
enjoy! 石君霄 客服电话13651996435</P>
<H2>阳光力量网站：<A href="http://home.sjtu.info/sunny" target="_blank"><FONT color="#996600">http://home.sjtu.info/sunny</FONT></A></H2>
<P> 
<script type="text/javascript"><!--
google_ad_client = "pub-7124114282586774";
google_ad_width = 728;
google_ad_height = 90;
google_ad_format = "728x90_as";
google_ad_type = "text_image";
google_ad_channel ="";
google_color_border = "FDEFD2";
google_color_bg = "FDEFD2";
google_color_link = "0000CC";
google_color_url = "008000";
google_color_text = "000000";
//--></script>
<script type="text/javascript"
  src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</P>
<FORM action="" name="lookup" id="lookup">
<SCRIPT language="JavaScript" type="text/JavaScript">
function lookup(word) {
	window.open('lookup.asp?'+word);
}
function lookupdictcn(word) {
	window.open('http:\/\/dict.cn\/search\/?q='+word+'&simple=1');
}
</SCRIPT>
Look up 查词典: 
<INPUT name="word" type="text" id="word">
<INPUT type="button" onClick="MM_callJS('lookup(document.forms.lookup.word.value);')" value="Look up Our Dictionary">
<INPUT type="button" onClick="MM_callJS('lookupdictcn(document.forms.lookup.word.value);')" value="Look up Dict.cn">
</FORM>
<P><A href="login.asp">Add words 添加单词</A><BR>
<A href="printwhat.asp">Print 打印单词表</A> output as HTML</P>
<P>You need both the offline tools and one database to use the offline function!<BR>
The database must be named ourdict.mdb and placed in the \v sub-folder.<BR>
<A href="ourdict.rar">Download offline tools 下载离线工具</A> powered by <A href="http://www.netbox.cn/" target="_blank">NetBox</A><BR>
<A href="ourdict.mdb">Download offline database 下载离线数据库</A> with full words</P>
<P>System requirements:</P>
<OL>
<LI>Windows or Linux operating system</LI>
<LI>Internet browser with JavaScript support</LI>
<LI>Windows 98SE/Me/2000/XP or above for offline access</LI>
<LI>Jaccount (@sjtu.edu.cn email) to add words</LI>
</OL>
<P>Powered by sunnyPower 2005-12-08</P>
</BODY>
</HTML>
