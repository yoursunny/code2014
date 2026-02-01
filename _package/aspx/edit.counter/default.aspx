<%@ Page Language="VB" %>
<%@ Import Namespace="System.Data.OleDb" %>
<%--
本页代码直接移植于ASP版本
--%>
<script runat="server">
    Dim conn As OleDbConnection
    Dim rsIsOpen As Boolean
    Dim rs As OleDbDataReader
    Dim path As String
    Dim Part As String
    
    Sub SQL(ByVal sqlstr As String) 'SQL执行到rs对象
        Dim cmd As New OleDbCommand(sqlstr)
        cmd.Connection = conn
        If rsIsOpen Then rs.Close()
        rsIsOpen = False
        If UCase(Mid(sqlstr, 1, 6)) = "SELECT" Then
            rs = cmd.ExecuteReader()
            rsIsOpen = True
        Else
            cmd.ExecuteNonQuery()
            rs = Nothing
        End If
    End Sub

    Function ReplaceDangerousChar(ByVal str) As String '过滤危险字符，减少SQL注入攻击
        str = Replace(str, ";", "$")
        str = Replace(str, ",", "$")
        str = Replace(str, "'", "$")
        str = Replace(str, "(", "$")
        str = Replace(str, ")", "$")
        str = Replace(str, "<", "$")
        str = Replace(str, ">", "$")
        ReplaceDangerousChar = Replace(str, Chr(34), "$")
    End Function

    Sub CounterAdd() '增加计数值，要求记录已存在
        SQL("UPDATE counter SET v=v+1 WHERE path='" & path & "'")
    End Sub
    
    Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs)
        Response.ContentType = "text/javascript"

        conn = New OleDbConnection("Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("db/global.asa"))
        conn.Open()
        rs = Nothing

        rsIsOpen = False

        path = ReplaceDangerousChar(Request.QueryString("path"))
        Part = Request.QueryString("part")

        '获得当前计数值
        Dim current As Integer
        current = 0
        SQL("SELECT v FROM counter WHERE path='" & path & "'")
        If Not rs.Read() Then
            SQL("INSERT INTO counter (path,v) VALUES ('" & path & "',0)")
        Else
            current = rs.GetInt32("v")
        End If

        '输出当前计数值
        Response.Write("{var d=document.getElementById('PageGenerator_counter_" & Part & "');if (d) d.innerHTML='" & current.ToString() & "';}")

        '清除陈旧数据
        SQL("DELETE FROM detail WHERE t<DATEADD('d',-1,NOW())")

        '判断是否应该计数加一
        Select Case Request.QueryString("t")
            Case "ip"
                Dim IP As String
                IP = Request.ServerVariables("REMOTE_ADDR")
                SQL("SELECT * FROM detail WHERE path='" & path & "' AND key='" & IP & "'")
                If Not rs.Read() Then
                    CounterAdd()
                    SQL("INSERT INTO detail (path,key,t) VALUES ('" & path & "','" & IP & "',NOW())")
                End If
            Case "cookie"
                Dim cookie As String
                cookie = ReplaceDangerousChar(Request.Cookies("PageGenerator_counter").Value)
                If Len(cookie) = 32 Then
                    SQL("SELECT * FROM detail WHERE path='" & path & "' AND key='" & cookie & "'")
                    If Not rs.Read() Then
                        CounterAdd()
                        SQL("INSERT INTO detail (path,key,t) VALUES ('" & path & "','" & cookie & "',NOW())")
                    End If
                Else
                    CounterAdd()
                    cookie = ""
                    Const r = "1234567890qwertyuiopasdfghjklzxcvbnm"
                    Randomize()
                    Dim i As Integer
                    For i = 1 To 32
                        cookie = cookie & Mid(r, Fix(Rnd() * Len(r)) + 1, 1)
                    Next
                    Response.Cookies.Add(New HttpCookie("PageGenerator_counter", cookie))
                    SQL("INSERT INTO detail (path,key,t) VALUES ('" & path & "','" & cookie & "',NOW())")
                End If
            Case "referrer"
                CounterAdd()
            Case "referrernoop"
            Case "hit"
                CounterAdd()
        End Select

        conn.Close()
    End Sub
</script>