<%@LANGUAGE="VBSCRIPT" CODEPAGE="936"%>
<!--#include file="conn.asp"-->
<%
user=ReplaceDangerousChar(request.ServerVariables("QUERY_STRING"))
SQL "SELECT * FROM user WHERE jaccount='"&user&"'"
if rs.bof and rs.eof then
	response.write "无此用户"
	response.End()
end if
%>
<HTML>
<HEAD>
<META http-equiv="Content-Type" content="text/html; charset=gb2312">
<TITLE>Our Dictionary</TITLE>
</HEAD>

<BODY>
<H1><%=user%></H1>
<P>姓名：<%=rs("pname")%></P>
<P>登录次数：<%=rs("logins")%></P>
<P>录入单词数：<%=rs("words")%></P>
<P>电子邮件：<%=user%>@sjtu.edu.cn</P>
</BODY>
</HTML>
