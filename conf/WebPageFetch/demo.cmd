@ECHO OFF
SETLOCAL
SET PAGE_TO_FETCH=http://cn.msn.com
ECHO Running the PowerShell script to fetch a web page...
ECHO   1.clear Internet Explorer cache
ECHO   2.start hProxyN.exe
ECHO   3.invoke WebPageFetch.exe
ECHO     a) save current IE proxy settings
ECHO     b) set IE proxy to hProxyN
ECHO     c) navigate to the web page
ECHO     d) restore IE proxy settings
ECHO     Please do not use Internet Explorer at the moment.
ECHO   4.tell hProxyN.exe to quit
powershell .\fetch.ps1 %PAGE_TO_FETCH%
ECHO   return code: 0=finish, 1=timeout
ECHO.
IF NOT EXIST LogParser.exe GOTO download_LogParser
IF NOT EXIST LogParser.dll GOTO download_LogParser
ECHO Invoke LogParser.exe to know the servers used by this page:
logparser -i:IISW3C -o:NAT -rtp:-1 -stats:OFF "SELECT COUNT(*) AS HITS,cs-host AS HOST FROM proxy.log GROUP BY cs-host"
ECHO.
ECHO Use LogParser COM API to find out whether there is a 4xx or 5xx error:
regsvr32 /s LogParser.dll
cscript /nologo 4xx5xx.vbs
ECHO.
GOTO after_LogParser
:download_LogParser
ECHO LogParser is not avaliable,
ECHO visit http://tinyurl.com/LogParser and download it,
ECHO then put LogParser.exe and LogParser.dll in this folder:
CD
ECHO.
:after_LogParser
ECHO You may open proxy.log to read the full log file.
PAUSE