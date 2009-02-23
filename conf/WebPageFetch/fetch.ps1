$url=$args[0]
$timeout=30000
$proxy="127.0.0.1:3128"

$internet_cache=[System.Environment]::GetFolderPath("InternetCache")
Remove-Item $internet_cache -recurse -force -ErrorAction SilentlyContinue

$process_proxy=New-Object System.Diagnostics.Process
$process_proxy.StartInfo.FileName="..\..\bin\Release\hProxyN.exe"
$process_proxy.StartInfo.Arguments="proxy.config"
$process_proxy.StartInfo.UseShellExecute=$false
$process_proxy.StartInfo.RedirectStandardInput=$true
$process_proxy.Start() | Out-Null
Start-Sleep 2

$process_fetch=New-Object System.Diagnostics.Process
$process_fetch.StartInfo.FileName="..\..\bin\Release\WebPageFetch.exe"
$process_fetch.StartInfo.Arguments=($url+" "+$timeout+" "+$proxy)
$process_fetch.StartInfo.UseShellExecute=$false
$process_fetch.Start() | Out-Null
$process_fetch.WaitForExit()

Write-Host $process_fetch.ExitCode

$process_proxy.StandardInput.WriteLine()
$process_proxy.WaitForExit()