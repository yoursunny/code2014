<%@LANGUAGE="VBSCRIPT" CODEPAGE="936"%>
<!--#include file="conn.asp"-->
<!--#include file="common.asp"-->
<%
if session("ourdictlogin")<>1 then response.redirect "./"

classid=str2lng(request("classid"))
word=ReplaceDangerousChar(request("word"))
phonetic=ReplaceDangerousChar(request("phonetic"))
ex1=ReplaceDangerousChar(request("ex1"))
eg1=ReplaceDangerousChar(request("eg1"))
ex2=ReplaceDangerousChar(request("ex2"))
eg2=ReplaceDangerousChar(request("eg2"))
ex3=ReplaceDangerousChar(request("ex3"))
eg3=ReplaceDangerousChar(request("eg3"))
sub errmsg(msg)
%><HTML><HEAD><TITLE>Our Dictionary</TITLE></HEAD><BODY>错误：<%=msg%><BR><INPUT type=button onclick="history.go(-1)" value="返回修改"></BODY></HTML><%
response.end
end sub
if classid<=0 or classid>=classcount then
errmsg ("分类无效")
end if
session("ourdictclassid")=classid
if word="" then
errmsg("单词为空")
end if
if ex1="" then
errmsg("解释1为空")
end if

SQL "SELECT TOP 1 * FROM dict"
rs.addnew
rs("user")=session("ourdictjaccount")
rs("date")=now()
rs("class")=classid
rs("word")=word
rs("phonetic")=phonetic
rs("ex1")=ex1
rs("eg1")=eg1
rs("ex2")=ex2
rs("eg2")=eg2
rs("ex3")=ex3
rs("eg3")=eg3
rs.update
rs.close

SQL "SELECT * FROM user WHERE jaccount='"&session("ourdictjaccount")&"'"
rs("words")=rs("words")+1
rs.update
rs.close

response.redirect "start.asp"
%>