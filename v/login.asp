<% @Language=VBScript %>
<!--#include file="conn.asp"-->
<% 
response.buffer=true


dim userProfile 'useProfile is a dictionary object

dim Jam ' JAM is a jaccount Object

dim uaBaseURL,strSiteID, strKeyDir
strSiteID="jaourhome05303"
strKeyDir="c:\key"

if runlocal=1 then
	localuser="-local-"
    session("ourdictlogin")=1
	session("ourdictjaccount")=localuser
	session("ourdictclassid")=0
	session("ourdictpname")="本地输入"
	SQL "SELECT * FROM user WHERE jaccount='"&localuser&"'"
	if rs.bof and rs.eof then
		rs.addnew
		rs("logins")=0
		rs("words")=0
	end if
	rs("jaccount")=localuser
	rs("studno")="0"
	rs("pname")="本地输入"
	rs("lastin")=now()
	rs("logins")=rs("logins")+1
	rs.update
	rs.close

    response.redirect "start.asp"
else 'runlocal
if session("ourdictlogin")<>1 then
    Set Jam = Server.CreateObject("JAccMan.Manager") 
    
    call Jam.SetJAManager(strSiteID,strKeyDir)
    set userProfile=Jam.checkLogin()
    if (userProfile.count>0 and Jam.hasTicketInURL) then
        call Jam.redirectWithoutTicket()
    end if
    session("ourdictlogin")=1
	session("ourdictjaccount")=userProfile("uid")
	session("ourdictclassid")=0
	session("ourdictpname")=ReplaceDangerousChar(userProfile("chinesename"))
	SQL "SELECT * FROM user WHERE jaccount='"&ReplaceDangerousChar(userProfile("uid"))&"'"
	if rs.bof and rs.eof then
		rs.addnew
		rs("logins")=0
		rs("words")=0
	end if
	rs("jaccount")=ReplaceDangerousChar(userProfile("uid"))
	rs("studno")=ReplaceDangerousChar(userProfile("id"))
	rs("pname")=ReplaceDangerousChar(userProfile("chinesename"))
	rs("lastin")=now()
	rs("logins")=rs("logins")+1
	rs.update
	rs.close

    response.redirect "start.asp"
end if
end if 'runlocal
%>