# create aspnet.config
# usage: powershell .\aspnet.ps1 path\to\wwwroot
# note: you must cd to conf before running this script
# example: powershell .\aspnet.ps1 D:\wwwroot

[string]$c=[System.IO.File]::ReadAllText("aspnet.config.template")
$c=$c.Replace("`$_wwwroot_`$",$args[0])
[System.IO.File]::WriteAllText("aspnet.config",$c)
