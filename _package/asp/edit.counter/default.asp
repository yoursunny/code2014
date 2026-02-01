<%
Response.ContentType="text/javascript"

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

Sub CounterAdd() '增加计数值，要求记录已存在
	SQL "UPDATE counter SET v=v+1 WHERE path='"&path&"'"
End Sub

path=ReplaceDangerousChar(Request.QueryString("path"))
part=Request.QueryString("part")

'获得当前计数值
current=0
SQL "SELECT v FROM counter WHERE path='"&path&"'"
If rs.EOF Then
	SQL "INSERT INTO counter (path,v) VALUES ('"&path&"',0)"
Else
	current=rs("v")
End If

'输出当前计数值
Response.Write "{var d=document.getElementById('PageGenerator_counter_"&part&"');if (d) d.innerHTML='"&current&"';}"

'清除陈旧数据
SQL "DELETE FROM detail WHERE t<DATEADD('d',-1,NOW())"

'判断是否应该计数加一
Select Case Request.QueryString("t")
	Case "ip"
		IP=Request.ServerVariables("REMOTE_ADDR")
		SQL "SELECT * FROM detail WHERE path='"&path&"' AND key='"&IP&"'"
		If rs.EOF Then
			CounterAdd
			SQL "INSERT INTO detail (path,key,t) VALUES ('"&path&"','"&IP&"',NOW())"
		End If
	Case "cookie"
		cookie=ReplaceDangerousChar(Request.Cookies("PageGenerator_counter"))
		If Len(cookie)=32 Then
			SQL "SELECT * FROM detail WHERE path='"&path&"' AND key='"&cookie&"'"
			If rs.EOF Then
				CounterAdd
				SQL "INSERT INTO detail (path,key,t) VALUES ('"&path&"','"&cookie&"',NOW())"
			End If
		Else
			CounterAdd
			cookie=""
			Const r="1234567890qwertyuiopasdfghjklzxcvbnm"
			Randomize
			For i=1 To 32
				cookie=cookie&Mid(r,Fix(Rnd()*Len(r))+1,1)
			Next
			Response.Cookies("PageGenerator_counter")=cookie
			SQL "INSERT INTO detail (path,key,t) VALUES ('"&path&"','"&cookie&"',NOW())"
		End If
	Case "referrer"
		CounterAdd
	Case "referrernoop"
	Case "hit"
		CounterAdd
End Select

conn.Close
%>