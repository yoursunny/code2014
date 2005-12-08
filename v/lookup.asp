<%@LANGUAGE="VBSCRIPT" CODEPAGE="936"%>
<!--#include file="conn.asp"-->
<!--#include file="common.asp"-->
<%
word=ReplaceDangerousChar(request.ServerVariables("QUERY_STRING"))
%>
<HTML>
<HEAD>
<META http-equiv="Content-Type" content="text/html; charset=gb2312">
<TITLE><%=word%> - Our Dictionary</TITLE>
</HEAD>
<BODY>
<script type="text/javascript"><!--
google_ad_client = "pub-7124114282586774";
google_ad_width = 728;
google_ad_height = 90;
google_ad_format = "728x90_as";
google_ad_type = "text_image";
google_ad_channel ="";
google_color_border = "FDEFD2";
google_color_bg = "FDEFD2";
google_color_link = "0000CC";
google_color_url = "008000";
google_color_text = "000000";
//--></script>
<script type="text/javascript"
  src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
<%
SQL "SELECT * FROM dict WHERE word='"&word&"'"
if rs.bof and rs.eof then
response.write "单词未找到</BODY></HTML>"
response.end
end if
do until rs.eof
%>
<H1><%=word%></H1>
<P>
<%=classname(rs("class"))%>
录入者：<A href="userinfo.asp?<%=rs("user")%>"><%=rs("user")%></A></P>
<DL>
<DT><%=replace(server.htmlencode(rs("ex1")),vbcrlf,"<BR>")%></DT>
<DD><%=replace(server.htmlencode(rs("eg1")),vbcrlf,"<BR>")%></DD>
<DT><%=replace(server.htmlencode(rs("ex2")),vbcrlf,"<BR>")%></DT>
<DD><%=replace(server.htmlencode(rs("eg2")),vbcrlf,"<BR>")%></DD>
<DT><%=replace(server.htmlencode(rs("ex3")),vbcrlf,"<BR>")%></DT>
<DD><%=replace(server.htmlencode(rs("eg3")),vbcrlf,"<BR>")%></DD>
</DL>
<%
rs.movenext
loop
%>
</BODY>
</HTML>
