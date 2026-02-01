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
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>PageGenerator - 计数器数值显示</title>
</head>

<body>
<h1>PageGenerator - 计数器数值显示</h1>
<table width="750" border="1" cellspacing="0" cellpadding="0">
<thead>
<tr>
<th width="700">页面地址</th>
<th width="50">计数</th>
</tr>
</thead>
<tbody><%
SQL "SELECT * FROM counter ORDER BY path"
Do Until rs.EOF
%>
<tr>
<td><%=Server.HTMLEncode(rs("path"))%></td>
<td><%=rs("v")%></td>
</tr><%
rs.MoveNext
Loop
rs.Close
%>
</tbody>
</table>
</body>
</html>
