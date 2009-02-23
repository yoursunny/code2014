@ECHO OFF
REM create aspnet.config and decompress demo files
SETLOCAL
SET /P wwwroot=Enter full path to decompress wwwroot (eg. D:\wwwroot )?
MD %wwwroot%
COPY aspnet-wwwroot.exe %wwwroot%\
PUSHD %wwwroot%
aspnet-wwwroot.exe -x
DEL aspnet-wwwroot.exe
POPD
powershell .\aspnet.ps1 %wwwroot%
