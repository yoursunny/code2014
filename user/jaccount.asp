<%
'PageGenerator jaccount登录

Randomize
'JAccount登录
strSiteID="jaourhome05303"
strKeyDir="E:\web\Jaccount"
Set Jam = Server.CreateObject("JAccMan.Manager") 
call Jam.SetJAManager(strSiteID,strKeyDir)
set userProfile=Jam.checkLogin()
if (userProfile.count>0 and Jam.hasTicketInURL) then
    call Jam.redirectWithoutTicket()
end if

'生成随机验证码
auth=""
x="1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"
For i=1 To 32
auth=auth&Mid(x,Fix(Rnd()*Len(x))+1,1)
Next

'获得JAccount信息
uid=userProfile("id")

ip=Request.ServerVariables("REMOTE_ADDR")

'写入数据表
connstr="DRIVER={Microsoft Access Driver (*.mdb)};DBQ="&Server.Mappath("../conf/db.user.axd")
set conn=Server.CreateObject("ADODB.Connection")
conn.open connstr
'set rs=Server.CreateObject("ADOBD.RecordSet")
conn.execute "DELETE FROM [u] WHERE [uid]='"&uid&"'"
conn.execute "INSERT INTO [u] ([uid],[pwl],[auth],[IP],[tick],[block]) VALUES ('"&Replace(uid,"'","''")&"','@jaccount','"&auth&"','"&ip&"',NOW(),'1987-02-12 00:00:00')"
conn.close

Response.Redirect "jaccount.aspx?uid="&Server.URLEncode(uid)&"&auth="&Server.URLEncode(auth)
%>