Set InputFormat=CreateObject("MSUtil.LogQuery.IISW3CInputFormat")
Set LogQuery=CreateObject("MSUtil.LogQuery")
Set RS=LogQuery.Execute("SELECT * FROM proxy.log",InputFormat)

Do Until RS.atEnd
  Set R=RS.getRecord
  status=R.getValue("sc-status")
  If status >= 400 Then
    WScript.Echo status&" "&R.getValue("cs-host")&" "&R.getValue("cs-uri-stem")&" "&R.getValue("cs-uri-query")
  End If
  RS.moveNext
Loop
