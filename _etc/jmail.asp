<%
Set JMail=Server.CreateObject("JMail.SMTPMail")
JMail.ContentType="text/html"
JMail.Encoding = "base64"
JMail.Charset="gb2312"
JMail.Sender = "jmail@yoursunny.com"
JMail.Subject = "JMail测试"
JMail.AddRecipient("yoursunny.com@gmail.com")
JMail.Body ="hello"
JMail.AddHeader "Originating-IP", Request.ServerVariables("REMOTE_ADDR")
JMail.Execute
JMail.Close
Set JMail = Nothing
%>