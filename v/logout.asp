<% @Language=VBScript %>
<% 
response.buffer=true
dim Jam
dim uaBaseURL,strSiteID, strKeyDir
strSiteID="jaourhome05303"
strKeyDir="c:\key"

if runlocal=1 then
session.Abandon()
response.redirect "./"
else 'runlocal
if session("ourdictlogin")=1 then
    Set Jam = Server.CreateObject("JAccMan.Manager") 
    call Jam.SetJAManager(strSiteID,strKeyDir)
    if Jam.Logout() then 
        session.Abandon()
        response.redirect "./"
    end if
end if
end if 'runlocal
%> 

¡¡¡¡