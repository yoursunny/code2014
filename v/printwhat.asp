<%@LANGUAGE="VBSCRIPT" CODEPAGE="936"%>
<!--#include file="common.asp"-->
<HTML>
<HEAD>
<META http-equiv="Content-Type" content="text/html; charset=gb2312">
<TITLE>Our Dictionary</TITLE>
</HEAD>

<BODY>
<P>Choose what to print?<BR>
选择打印内容？</P>
<OL>
<%
for i=1 to classcount
%>
<LI><A href="print.asp?<%=i%>"><%=classname(i)%></A></LI>
<%
next
%>
</OL>
</BODY>
</HTML>
