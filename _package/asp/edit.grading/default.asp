<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
Response.ContentType="text/javascript"
u=Request.ServerVariables("URL")
pos=InStrRev(u,"/")
Response.Write "var PageGenerator_grading_formaction='"&Mid(u,1,pos)&"save.asp';"&vbCrLf
Response.Write "var PageGenerator_grading_path='"&Trim(Request.QueryString("path"))&"';"&vbCrLf
%>
<!--#include file="h.js"-->