<%@LANGUAGE="VBSCRIPT" CODEPAGE="936"%>
<!--#include file="common.asp"-->
<%
if session("ourdictlogin")<>1 then response.redirect "./"
%>
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
<TABLE width="97%" border="0">
<TR>
<TD>Welcome, <%=session("ourdictpname")%> . <A href="logout.asp">logout 退出</A></TD>
<TD><SCRIPT type="text/javascript"><!--
google_ad_client = "pub-7124114282586774";
google_ad_width = 125;
google_ad_height = 125;
google_ad_format = "125x125_as_rimg";
google_cpa_choice = "CAAQ7-bnzwEaCMQUcnn9ADW1KN2_93M";
//--></SCRIPT> <SCRIPT type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</SCRIPT></TD>
</TR>
</TABLE>
<FORM action="" method="post" name="lookup" id="lookup">
<P> 
<SCRIPT language="JavaScript" type="text/JavaScript">
function lookup(word) {
	window.open('lookup.asp?'+word);
}
function lookupdictcn(word) {
	window.open('http:\/\/dict.cn\/search\/?q='+word+'&simple=1');
}
</SCRIPT>
Look up 查词典: 
<INPUT name="word" type="text" id="word22">
<INPUT name="button" type="button" onClick="MM_callJS('lookup(document.forms.lookup.word.value);')" value="Look up Our Dictionary">
<INPUT name="button" type="button" onClick="MM_callJS('lookupdictcn(document.forms.lookup.word.value);')" value="Look up Dict.cn">
</P>
</FORM>
<FORM action="doadd.asp" method="post" name="add" id="add">
<H2>Add new word 添加新词</H2>
<TABLE width="97%">
<TR> 
<TD>分类</TD>
<TD><SELECT name="classid" id="classid">
<%
for i=1 to classcount
isit=""
if i=session("ourdictclassid") then isit="SELECTED"
%>
<OPTION value="<%=i%>" <%=isit%>><%=classname(i)%></OPTION>
<%
next
%>
</SELECT></TD>
<TD>&nbsp;</TD>
<TD>&nbsp;</TD>
</TR>
<TR> 
<TD>单词<BR>
或词组</TD>
<TD><INPUT name="word" type="text" id="word" size="40" maxlength="40">
<BR>
<INPUT name="button2" type="button" onClick="MM_callJS('lookupdictcn(document.forms.add.word.value);')" value="Look up Dict.cn"></TD>
<TD>&nbsp;</TD>
<TD><BR> 
<INPUT name="phonetic" type="hidden" id="phonetic" value="." size="40" maxlength="40"> 
</TD>
</TR>
<TR> 
<TD>解释1</TD>
<TD><TEXTAREA name="ex1" cols="40" rows="8" id="ex1"></TEXTAREA></TD>
<TD>用法与<BR>
例句1</TD>
<TD><TEXTAREA name="eg1" cols="40" rows="8" id="eg1"></TEXTAREA></TD>
</TR>
<TR> 
<TD>解释2</TD>
<TD><TEXTAREA name="ex2" cols="40" rows="8" id="ex2"></TEXTAREA></TD>
<TD>用法与<BR>
例句2</TD>
<TD><TEXTAREA name="eg2" cols="40" rows="8" id="eg2"></TEXTAREA></TD>
</TR>
<TR> 
<TD>解释3</TD>
<TD><TEXTAREA name="ex3" cols="40" rows="8" id="ex3"></TEXTAREA></TD>
<TD><P>用法与<BR>
例句3</P></TD>
<TD><TEXTAREA name="eg3" cols="40" rows="8" id="eg3"></TEXTAREA></TD>
</TR>
<TR>
<TD>&nbsp;</TD>
<TD>&nbsp;</TD>
<TD>&nbsp;</TD>
<TD><INPUT name="" type="submit" style="width:120;height:50;" value="OK, 添加！"></TD>
</TR>
</TABLE>
</FORM>

<P><A href="printwhat.asp">Print 打印单词表</A> output as HTML</P>
</BODY>
</HTML>
