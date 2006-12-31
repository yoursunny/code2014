<%
'网站点击计数与统计 0.1内测版
'sunny land 阳光家园 http://sunnyland.1a.cn/ 出品
'
'引用方法 <IFRAME src="http://****.com/**/**.asp" width=1 height=1></IFRAME>


'--------------------------------设置区域--------------------------------

const dbname="statistics.htm" '数据库文件名(相对路径)
const logdetail=1 '是否记录详情：每次点击的IP、日期
const sameiponce=1 '同一IP只记录最新点击时间
const usemustinc=0 '激活“URL必须包含”选项
const mustinc1="sunny" 'URL必须包含的字符串，不包含就不会统计
const mustinc2="2048" '这三个有任何一个就行
const mustinc3="fangwen" '如果不需要三个，请填成一样的

'--------------------------------设置结束--------------------------------






on error resume next
%><HTML><HEAD><TITLE>sunny land 统计 (隐藏页)</TITLE><BODY></BODY></HTML><%
URL=Request.ServerVariables("HTTP_REFERER")
%><!<%=URL%>><%
if URL="" then '客户浏览器不支持Referer功能
%><!浏览器不支持Referer><%
response.end
elseif usemustinc=1 and instr(1,URL,mustinc1)<1 and instr(1,URL,mustinc2)<1 and instr(1,URL,mustinc3)<1 then '未包含必须包含的串
%><!该页不可引用统计><%
response.end
end if

function ReplaceDangerousChar(str) '过滤危险字符，减少SQL注入攻击
str=replace(str,";","$")
str=replace(str,",","$")
str=replace(str,"'","$")
str=replace(str,"(","$")
str=replace(str,")","$")
str=replace(str,"<","$")
str=replace(str,">","$")
ReplaceDangerousChar=replace(str,chr(34),"$")
end function
URL=ReplaceDangerousChar(URL)


'数据库连接
connstr="DRIVER={Microsoft Access Driver (*.mdb)};DBQ="&Server.Mappath(dbname)
set conn=Server.CreateObject("ADODB.Connection")
conn.open connstr
set rs=server.createobject("adodb.recordset")

sub SQL(sqlstr) 'SQL执行到rs对象
if ucase(mid(sqlstr,1,6))="SELECT" then
rs.open sqlstr,conn,1,3
else
rs.open sqlstr,conn,1,1
end if
end sub

SQL "SELECT * FROM count WHERE URL='"&URL&"'"
if rs.bof and rs.eof then
rs.addnew
rs("URL")=URL
rs("clicks")=0
end if
rs("clicks")=rs("clicks")+1
clicks=rs("clicks")
rs.update
rs.close
%><!计数器 <%=clicks%> ><%

if logdetail=0 then response.end
IP=Request.ServerVariables("REMOTE_ADDR")
UA=Request.ServerVariables("HTTP_USER_AGENT")
SQL "SELECT * FROM detail WHERE URL='"&URL&"' AND IP='"&IP&"'"
if (rs.bof and rs.eof) or sameiponce=0 then rs.addnew
rs("URL")=URL
rs("IP")=IP
rs("UA")=UA
rs("date")=now()
rs.update
rs.close
%><!已记录 IP <%=IP%> 浏览器 <%=UA%> ><%

%>