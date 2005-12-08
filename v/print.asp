<%@LANGUAGE="VBSCRIPT" CODEPAGE="936"%>
<!--#include file="conn.asp"-->
<!--#include file="common.asp"-->
<%
classid=str2lng(request.ServerVariables("QUERY_STRING"))
thisclass=classname(classid)
%>
<HTML>
<HEAD>
<META http-equiv="Content-Type" content="text/html; charset=gb2312">
<TITLE>Our Dictionary - <%=thisclass%></TITLE>
</HEAD>
<BODY>
<%
SQL "SELECT * FROM dict WHERE class="&classid&" ORDER BY word"
if rs.bof and rs.eof then
response.write "该类无单词</BODY></HTML>"
response.end
end if
do until rs.eof
%>
<P><%=rs("word")%>
<FONT size="-1">录入者：<%=rs("user")%><BR>
<%=replace(server.htmlencode(rs("ex1")),vbcrlf,"<BR>")%>
<I><%=replace(server.htmlencode(rs("eg1")),vbcrlf,"<BR>")%></I><BR>
<%=replace(server.htmlencode(rs("ex2")),vbcrlf,"<BR>")%>
<I><%=replace(server.htmlencode(rs("eg2")),vbcrlf,"<BR>")%></I><BR>
<%=replace(server.htmlencode(rs("ex3")),vbcrlf,"<BR>")%>
<I><%=replace(server.htmlencode(rs("eg3")),vbcrlf,"<BR>")%></I>
</FONT></P>
<%
rs.movenext
loop
%>

</BODY>
</HTML>
