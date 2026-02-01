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

a=Request.Form("a")
path=Request.Form("path")

Select Case a
	Case "grade1"
		Grade 1
	Case "grade2"
		Grade 2
	Case "grade3"
		Grade 3
	Case "cmt"
		Comment Request.Form("t")
End Select

Sub Grade(score)
	SQL "SELECT TOP 1 * FROM grade"
	rs.AddNew
	rs("path")=path
	rs("IP")=Request.ServerVariables("REMOTE_ADDR")
	rs("t")=Now
	rs("score")=score
	rs.Update
	rs.Close
End Sub

Sub Comment(cmt)
	SQL "SELECT TOP 1 * FROM comment"
	rs.AddNew
	rs("path")=path
	rs("IP")=Request.ServerVariables("REMOTE_ADDR")
	rs("t")=Now
	rs("cmt")=cmt
	rs.Update
	rs.Close
End Sub
%>