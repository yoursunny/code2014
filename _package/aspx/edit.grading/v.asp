<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
Set conn=Server.CreateObject("ADODB.Connection")
conn.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ="&Server.MapPath("db/global.asa")
Set rs=Server.CreateObject("ADODB.RecordSet")

rsIsOpen=False
Sub SQL(sqlstr) 'SQL执行到rs对象
	If rsIsOpen Then rs.Close
	rsIsOpen=False
	If UCase(mid(sqlstr,1,6))="SELECT" Then
		rs.Open sqlstr,conn,1,3
		rsIsOpen=True
	Else
		rs.Open sqlstr,conn,1,1
	End If
End Sub

Function ReplaceDangerousChar(str) '过滤危险字符，减少SQL注入攻击
	str=Replace(str,";","$")
	str=Replace(str,",","$")
	str=Replace(str,"'","$")
	str=Replace(str,"(","$")
	str=Replace(str,")","$")
	str=Replace(str,"<","$")
	str=Replace(str,">","$")
	ReplaceDangerousChar=Replace(str,Chr(34),"$")
End Function

path=ReplaceDangerousChar(Request.QueryString("path"))
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>PageGenerator - 评分结果、反馈留言</title>
</head>

<body>
<h1>PageGenerator - 评分结果、反馈留言</h1>
<form method="get">
页面地址
<input name="path" type="text" id="path" size="60" />
<input type="submit" value="  查  询  " />
</form>
<%
If Len(path)>0 Then
%><h2><%=Server.HTMLEncode(path)%> 的查询结果</h2><%

StartDate=DateAdd("d",-30,Now)

SQL "SELECT * FROM grade WHERE path='"&path&"' ORDER BY t DESC"
count1=0
count2=0
count3=0
Do Until rs.EOF
	If rs("t")<StartDate Then Exit Do
	If rs("score")=1 Then count1=count1+1
	If rs("score")=2 Then count2=count2+1
	If rs("score")=3 Then count3=count3+1
	rs.MoveNext
Loop
%>
<table width="150" border="1" cellspacing="0" cellpadding="3">
<tr>
<th width="70">评分
<th width="80">计数</th>
</tr>
<tr>
<td align="center"><font color="#669933">★</font></th>
<td align="right"><%=count3%></td>
</tr>
<tr>
<td align="center"><font color="#996600">▲</font></th>
<td align="right"><%=count2%></td>
</tr>
<tr>
<td align="center"><font color="#FF0000">×</font></th>
<td align="right"><%=count1%></td>
</tr>
</table><hr/>
<%
SQL "SELECT * FROM comment WHERE path='"&path&"' ORDER BY t DESC"
Do Until rs.EOF
	If rs("t")<StartDate Then Exit Do
	Response.Write "<p>留言#"&rs("ID")&" "&Replace(Replace(Server.HTMLEncode(rs("cmt")),vbCr,""),vbLf,"<br/>")&"</p><hr/>"&vbCrLf
	rs.MoveNext
Loop

%><p>注：30天内数据有效，超出30天的不统计与显示</p><%
End If
%>
</body>
</html>
