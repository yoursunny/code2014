@ECHO OFF
REM create hosting-*.config and decompress demo sites
SETLOCAL
SET /P wwwroot=Enter full path to decompress wwwroot (eg. D:\wwwroot )?
SET /P php=Enter full path to php-cgi.exe (eg. C:\php5 )?
MD %wwwroot%
COPY hosting-wwwroot.exe %wwwroot%\
PUSHD %wwwroot%
hosting-wwwroot.exe -x
DEL hosting-wwwroot.exe
POPD
powershell .\hosting-simple.ps1 %wwwroot%
powershell .\hosting-php.ps1 %wwwroot% %php%
