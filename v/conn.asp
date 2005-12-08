<%
runlocal=0 '0=网站，1=本地
'数据库连接
connstr="DRIVER={Microsoft Access Driver (*.mdb)};DBQ="&Server.Mappath("ourdict.mdb")
set conn=Server.CreateObject("ADODB.Connection")
conn.open connstr
set rs=server.createobject("adodb.recordset")


function ReplaceDangerousChar(str) '过滤危险字符，减少SQL注入攻击
str=replace(str,"'","＇")
ReplaceDangerousChar=replace(str,chr(34),"＂")
end function

sub SQL(sqlstr) 'SQL执行到rs对象
if ucase(mid(sqlstr,1,6))="SELECT" then
rs.open sqlstr,conn,1,3
else
rs.open sqlstr,conn,1,1
end if
end sub

function str2lng(str)
'str2lng=str 'for local
str2lng=jsstr2lng(str) 'for web
end function
%>
<SCRIPT language=JScript runat=server>function jsstr2lng(str){return Number(str)}//字符转为数字</SCRIPT>