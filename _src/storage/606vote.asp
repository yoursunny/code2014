<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
function r()
r=trim(rnd()*100000)
end function
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
</head>

<body>
<img src="http://www.sjtu.info/vgz/grzy.asp?tt=68&pagenum=5&extra=<%=r%>" width="1" height="1">
<img src="http://www.sjtu.info/vgz/grzy.asp?tt=68&pagenum=5&extra=<%=r%>" width="1" height="1">
<!--img src="http://www.sjtu.info/vgz/grzy.asp?tt=68&pagenum=5&extra=<%=r%>" width="1" height="1"-->
<img src="http://www.sjtu.info/vblog/BLOG.asp?tt=35&pagenum=8&extra=<%=r%>" width="1" height="1">
<img src="http://www.sjtu.info/vblog/BLOG.asp?tt=35&pagenum=8&extra=<%=r%>" width="1" height="1">
<!--img src="http://www.sjtu.info/vblog/BLOG.asp?tt=35&pagenum=8&extra=<%=r%>" width="1" height="1"-->
<iframe src="606vote10.asp?<%=r%>" width="1" height="1"></iframe>
<iframe src="606vote10.asp?<%=r%>" width="1" height="1"></iframe>
<!--iframe src="606vote10.asp?<%=r%>" width="1" height="1"></iframe-->
</body>
</html>
