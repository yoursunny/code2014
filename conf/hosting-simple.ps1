# create hosting-simple.config
# usage: powershell .\hosting-simple.ps1 path/to/wwwroot
# note: you must cd to conf before running this script
# example: powershell .\hosting-simple.ps1 D:/wwwroot

[string]$c=[System.IO.File]::ReadAllText("hosting-simple.config.template")
$c=$c.Replace("`$_wwwroot_`$",$args[0])
[System.IO.File]::WriteAllText("hosting-simple.config",$c)
