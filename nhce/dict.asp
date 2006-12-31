<?xml version="1.0" encoding="gb2312"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
password="870212"
SessionUser="DictUser"
SessionPassword="DictPassword"
'On Error Resume Next
set conn=Server.CreateObject("ADODB.Connection")
conn.open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ="&Server.MapPath("dict.htm")
set rs=server.createobject("ADODB.RecordSet")

adddone=0
deldone=0
word=Request("q")
If Request("do")="login" Then
Session(SessionUser)=Request("user")
ElseIf Request("do")="add" Then
rs.Open "SELECT TOP 1 * FROM [dict]",conn,1,3
rs.AddNew()
rs("date") = Now()
rs("IP") = Request.ServerVariables("REMOTE_ADDR")
rs("user") = Session(SessionUser)
rs("word") = word
rs("ex") = Request("ex")
rs("eg") = Request("eg")
rs.Update
rs.Close
adddone = 1
ElseIf Request("do")="delete" Then
If Session(SessionPassword)=password Or Request("password")=password Then
Session(SessionPassword)=password
conn.Execute "DELETE FROM [dict] WHERE [id]="+Replace(Request("id"),"'","")
deldone=1
Else
deldone=2
End If
End If
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
<title>Our Dictionary</title>
<script language="JavaScript" type="text/JavaScript">
function LookUp(f) {
if (f.q.value.length==0) {alert('Please enter the word to look up!');f.q.focus();return;}
f.submit();
}
function AddWord(f) {
if (f.q.value.length==0) {
f.q.value = window.prompt('Enter the word to add your explanation:');
if (f.q.value.length==0) return;
}
if (f.ex.value.length==0) {alert('Please enter the explanation!');f.ex.focus();return;}
if (f.eg.value.length==0) {alert('Please enter the example!');f.eg.focus();return;}
f.submit();
}
function Delete(n) {
f=document.forms.del;
f.id.value=n;
<%If Session(SessionPassword)=password Then%>
if (!window.confirm('Are you sure to delete this explanation \/ example?')) return;
<%Else%>
f.password.value=window.prompt('Are you sure to delete this explanation \/ example?\nPlease enter the password:');
<%End If%>
if (f.password.value.length!=0) f.submit();
}
</script>
</head>

<body>
<h2 align="center"><font color="#00FF00">Our Dictionary - nhce.yoursunny.com</font></h2>
<%
If Request("do")="all" Then
rs.Open "SELECT * FROM [dict] ORDER BY [word] ASC,[date] DESC",conn,1,3
If rs.EOF Then Response.Write "<i>No entry found.</i>"
Do Until rs.EOF
Response.Write "<p><b>"&Server.HTMLEncode(rs("word"))&"</b> User:<i>"&Server.HTMLEncode(" "&rs("user"))&"</i> Date:"&FormatDateTime(rs("date"),vbShortDate)&" IP:"&Server.HTMLEncode(rs("IP"))&"<br/>"&vbCrLf
Response.Write "<b>"&Server.HTMLEncode(rs("ex"))&"</b><br/>"&vbCrlf&Server.HTMLEncode(rs("eg"))&"</p>"&vbCrLf
rs.MoveNext
Loop
rs.Close
Response.Write "</body></html>"
Response.End
End If
%>
<table width="500" border="0" align="center">
<form method="get" action="dict.asp">
<tr bgcolor="#FFFF99"> 
<td colspan="2" bgcolor="#CCFF99"><a href="?do=all">List all entries</a></td>
</tr>
<tr bgcolor="#FFFF99"> 
<td>Look up</td>
<td> <input name="q" type="text" id="q" size="20" onkeyup="" /> <input name="lookupsubmit" type="button" id="lookupsubmit" value="Look up my dictionary" onclick="LookUp(this.form)" /> 
</td>
</tr>
<tr> 
<td colspan="2"><input name="do" type="hidden" id="action" value="lookup" /></td>
</tr>
<%If word<>"" Then%>
<tr bgcolor="#FFCCFF"> 
<td colspan="2">Look up results for<font color="#FF0000"> <%=Server.HTMLEncode(word)%></font></td>
</tr>
<tr bgcolor="#FFCCFF"> 
<td colspan="2"> <%
rs.Open "SELECT * FROM [dict] WHERE [word]='"&Replace(word,"'","''")&"' ORDER BY [date] DESC",conn,1,3
If rs.EOF Then Response.Write "<i>No entry found.</i>"
Do Until rs.EOF
Response.Write "<p>User:<i>"&Server.HTMLEncode(" "&rs("user"))&"</i> Date:"&FormatDateTime(rs("date"),vbShortDate)&" IP:"&Server.HTMLEncode(rs("IP"))&" <a href='#' onclick='Delete("&rs("id")&")'>delete</a><br/>"&vbCrLf
Response.Write "<b>"&Server.HTMLEncode(rs("ex"))&"</b><br/>"&vbCrlf&Server.HTMLEncode(rs("eg"))&"</p>"&vbCrLf
rs.MoveNext
Loop
rs.Close
%> </td>
</tr>
<%End If%>
</form>
<form id="del" name="del" method="post" action="dict.asp">
<input name="q" type="hidden" id="q" value="<%=Server.HTMLEncode(word)%>" />
<input name="do" type="hidden" id="do" value="delete" />
<input name="id" type="hidden" id="id" />
<input name="password" type="hidden" id="password" value="<%=Session(SessionPassword)%>" />
<tr> 
<td colspan="2"><font color="#0033CC"> 
<%If deldone=1 Then Response.Write("Selected entry deleted.")%>
<%If deldone=2 Then Response.Write("Wrong password.")%>
</font></td>
</tr>
</form>
<form method="post" action="dict.asp">
<tr bgcolor="#99FFFF"> 
<td colspan="2">Add a new explanation / example for<font color="#FF0000"> <%=Server.HTMLEncode(word)%></font> <input name="q" type="hidden" id="q" value="<%=Server.HTMLEncode(word)%>" /> 
<input name="do" type="hidden" id="do" value="add" /></td>
</tr>
<tr bgcolor="#99FFFF"> 
<td>explanation</td>
<td> <textarea name="ex" cols="50" rows="3" id="ex"></textarea></td>
</tr>
<tr bgcolor="#99FFFF"> 
<td>example</td>
<td> <textarea name="eg" cols="50" rows="3" id="eg"></textarea></td>
</tr>
<tr bgcolor="#99FFFF"> 
<td>user</td>
<td><%=Server.HTMLEncode(Session(SessionUser))%></td>
</tr>
<tr bgcolor="#99FFFF"> 
<td colspan="2"><font size="-1">Supply <font color="#FF0000">only one</font> explanation 
and <font color="#FF0000">its</font> example each time.</font></td>
</tr>
<tr bgcolor="#99FFFF"> 
<td colspan="2" align="center"> <input type="button" value="Add to my dictionary" onclick="AddWord(this.form)" /> 
<font color="#006600"> 
<%If adddone=1 Then Response.Write("Word "&word&" added, thank you.")%>
</font></td>
</tr>
<tr bgcolor="#99FFFF"> 
<td colspan="2"><p><font size="-1">If you want to add an explanation for another 
word, look up for it and add your explanation if it has not been added by another 
person.</font></p></td>
</tr>
</form>
</table>
</body>
</html>
