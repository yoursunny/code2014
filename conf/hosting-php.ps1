# create hosting-php.config
# usage: powershell .\hosting-php.ps1 path/to/wwwroot path/to/php
# note: you must cd to conf before running this script
# example: powershell .\hosting-php.ps1 D:/wwwroot C:/php5

[string]$c=[System.IO.File]::ReadAllText("hosting-php.config.template")
$c=$c.Replace("`$_wwwroot_`$",$args[0]).Replace("`$_php_`$",$args[1])
[System.IO.File]::WriteAllText("hosting-php.config",$c)
