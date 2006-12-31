<%
'文件点击计数与统计 0.1内测版
'sunnyPower阳光力量 http://spower.008.net/ 出品
'
'引用方法 <A href="http://****.com/**/?file.ext">file</A>


'--------------------------------设置区域--------------------------------

const dbname="count.htm" '数据库文件名(相对路径)
const logdetail=1 '是否记录详情：每次点击的IP、日期

'--------------------------------设置结束--------------------------------






on error resume next

file=Request.ServerVariables("QUERY_STRING")
if file="" then
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
file=ReplaceDangerousChar(file)



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

SQL "SELECT * FROM count WHERE file='"&file&"'"
if rs.bof and rs.eof then
rs.addnew
rs("file")=file
rs("clicks")=0
end if
rs("clicks")=rs("clicks")+1
clicks=rs("clicks")
rs.update
rs.close

if logdetail=1 then
IP=Request.ServerVariables("REMOTE_ADDR")
UA=Request.ServerVariables("HTTP_USER_AGENT")
SQL "SELECT * FROM detail WHERE file='"&URL&"' AND IP='"&IP&"'"
rs.addnew
rs("file")=file
rs("IP")=IP
rs("UA")=UA
rs("date")=now()
rs.update
rs.close
end if

'response.redirect file
response.redirect "http://yoursunny.com:81/transfer/"&file
%>