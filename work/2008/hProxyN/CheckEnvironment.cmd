@ECHO OFF
ECHO hProxyN requirement check v20090223
ECHO.


ECHO Checking required environment for hProxyN...

IF EXIST %systemroot%\Microsoft.NET\Framework\v3.5\NUL GOTO NET35OK
ECHO Not Found: .Net Framework 3.5
ECHO Download it on http://www.microsoft.com/net/
GOTO HASERR
:NET35OK
ECHO .Net Framework 3.5  OK

powershell -NoLogo -Command "Write-Host 'Windows PowerShell 1.0 OK'"
IF NOT ERRORLEVEL 1 GOTO PS1OK
ECHO Not Found: Windows PowerShell 1.0
ECHO Download it on http://www.microsoft.com/powershell/
GOTO HASERR
:PS1OK

ECHO.
ECHO Requirement check succeeded

GOTO END
:HASERR
ECHO.
ECHO Requirement check failed
:END
PAUSE
