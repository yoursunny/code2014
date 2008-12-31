$date=(Get-Date).AddDays(-1)
function IISlog_conf_parse
{
IISlog_parse $date "test01.yoursunny.cn" @("D:\LogFiles\W3SVC1\&%") "/index.htm" @() | Out-File .\report\test01-yoursunny-cn.txt
IISlog_parse $date "test02.yoursunny.cn" @("\\server1\d$\LogFiles\W3SVC2\%","\\server2\d$\LogFiles\W3SVC2\%") "/default.aspx" @() | Out-File .\report\test02-yoursunny-cn.txt
}

function IISlog_conf_mail
{
$mail_from="IISlog-sender@test01.yoursunny.cn.nospam"
$mail_to="IISlog@admin.yoursunny.cn.nospam"
$mail_title="IISlog"
$mail_body=""
$smtp_server="smtp.yoursunny.cn"
$smtp_username="smtpuser"
$smtp_password="Pass!word1"

# ---- do not change below this line ----
IISlog_SendMail $mail_from $mail_to ($mail_title+" "+$date.ToString("yyyy-MM-dd")) ($mail_body+"`nIISlog_parse started on "+$time_start.ToString("yyyy-MM-dd HH:mm:ss")+" and took "+[Math]::Round(($time_end-$time_start).TotalSeconds)+" seconds.`nhttp://www.65536.cn/work/2008/IISlog/") ".\report" $smtp_server $smtp_username $smtp_password
}

function IISlog_parse
# parse logs of a website and generate a report
# Usage: IISlog_parse date site_name log_files default_page_name count_prefixes
# Example: IISlog_parse (Get-Date).AddDays(-1) "Sample Web Site" @("E:\W3SVC1\%","\\server2\e$\W3SVC1\%") "/index.aspx" @("/dir1/","/dir2/")
{
$filename=Get-Date $args[0] -uformat "ex%y%m%d.log"
$datestr=Get-Date $args[0] -uformat "%Y-%m-%d"
$site_name=$args[1]
$log_files=$args[2]
$default_page_name=$args[3]
$count_prefixes=$args[4]

Remove-Item .\temp\*
for ($i=0;$i -lt $log_files.Length;++$i) {
  $log_file=$log_files[$i]
  $log_file=$log_file.Replace("%",$filename)
  $log_file_new=(".\temp\"+$i.ToString()+".log")
  Copy-Item $log_file $log_file_new
}

$parser_404=IISlog_startparser ".\LogParser.exe -i:iisw3c -o:nat -q:ON `"SELECT COUNT(*) As Hits,cs-uri-stem AS URL FROM .\temp\*.log WHERE sc-status=404 GROUP BY URL ORDER BY Hits DESC`"" ".\temp\404.txt"
$parser_500=IISlog_startparser ".\LogParser.exe -i:iisw3c -o:nat -q:ON `"SELECT COUNT(*) AS Hits,cs-uri-stem AS URL FROM .\temp\*.log WHERE sc-status=500 GROUP BY URL ORDER BY Hits DESC`"" ".\temp\500.txt"
$parser_total=IISlog_startparser ".\LogParser.exe -i:iisw3c -o:nat -q:ON -spaceCol:OFF `"SELECT COUNT(DISTINCT c-ip),'IP,',COUNT(*),'Hits, ' FROM .\temp\*.log`"" ".\temp\total.txt"
$parser_total_pv=IISlog_startparser ".\LogParser.exe -i:iisw3c -o:nat -q:ON -spaceCol:OFF `"SELECT COUNT(*),'PV' USING TO_LOWERCASE(cs-uri-stem) AS URL FROM .\temp\*.log WHERE (URL LIKE '%.html' OR URL LIKE '%.htm' OR URL LIKE '%.shtml' OR URL LIKE '%.aspx' OR URL LIKE '%.asp' OR URL LIKE '%.php')`"" ".\temp\totalpv.txt"
$parser_default=IISlog_startparser (".\LogParser.exe -i:iisw3c -o:nat -q:ON -spaceCol:OFF `"SELECT COUNT(DISTINCT c-ip),'IP,',COUNT(*),'Hits,',COUNT(*),'PV' FROM .\temp\*.log WHERE TO_LOWERCASE(cs-uri-stem) LIKE '"+$default_page_name.ToLower().Replace("/","\/")+"'`"") ".\temp\default.txt"
$parser_prefixes=$count_prefixes.Clone()
$parser_prefixes_pv=$count_prefixes.Clone()
for ($i=0;$i -lt $count_prefixes.Length;++$i)
{
  $parser_prefixes[$i]=IISlog_startparser (".\LogParser.exe -i:iisw3c -o:nat -q:ON -spaceCol:OFF `"SELECT COUNT(DISTINCT c-ip),'IP,',COUNT(*),'Hits, ' FROM .\temp\*.log WHERE TO_LOWERCASE(cs-uri-stem) LIKE '"+$count_prefixes[$i].ToLower().Replace("/","\/")+"%'`"") (".\temp\prefix"+$i.ToString()+".txt")
  $parser_prefixes_pv[$i]=IISlog_startparser (".\LogParser.exe -i:iisw3c -o:nat -q:ON -spaceCol:OFF `"SELECT COUNT(*),'PV' USING TO_LOWERCASE(cs-uri-stem) AS URL FROM .\temp\*.log WHERE (URL LIKE '"+$count_prefixes[$i].ToLower().Replace("/","\/")+"%') AND (URL LIKE '%.html' OR URL LIKE '%.htm' OR URL LIKE '%.shtml' OR URL LIKE '%.aspx' OR URL LIKE '%.asp' OR URL LIKE '%.php')`"") (".\temp\prefix"+$i.ToString()+"pv.txt")
}

IISlog_waitparser $parser_404 $parser_500 $parser_total $parser_default $parser_prefixes

Write-Output ("======== "+$site_name+" 404 ERROR "+$datestr+" ========")
Write-Output (Get-Content .\temp\404.txt)
Write-Output ""

Write-Output ("======== "+$site_name+" 500 ERROR "+$datestr+" ========")
Write-Output (Get-Content .\temp\500.txt)
Write-Output ""

Write-Output ("======== "+$site_name+" IP/Hits/PV Statistics "+$datestr+" ========")
Write-Output ("Total = "+(Get-Content .\temp\total.txt)+(Get-Content .\temp\totalpv.txt))
Write-Output ("Default page = "+(Get-Content .\temp\default.txt))
for ($i=0;$i -lt $count_prefixes.Length;++$i)
{
  Write-Output ($count_prefixes[$i]+" = "+(Get-Content (".\temp\prefix"+$i+".txt"))+(Get-Content (".\temp\prefix"+$i+"pv.txt")))
}
Write-Output ""

Remove-Item .\temp\*
}

function IISlog_startparser
# start a logparser process
# Usage: IISlog_startparser command_line out_file
{
$process=[System.Diagnostics.Process]::Start("cmd.exe",("/c "+$args[0]+" > "+$args[1]))
$process.PriorityClass=[System.Diagnostics.ProcessPriorityClass]::BelowNormal
return $process
}

function IISlog_waitparser
# wait for logparser processes
# Usage: IISlog_waitparser process1 @(process2,process3)
{
while (1)
{
  Start-Sleep 5
  $all_exit=1
  $i=0
  while (($args[$i] -is [System.Diagnostics.Process]) -or ($args[$i] -is [System.Array]))
  {
    if (($args[$i] -is [System.Diagnostics.Process]) -and (-not $args[$i].HasExited)) { $all_exit=0 }
    if ($args[$i] -is [System.Array]) { foreach ($process in $args[$i]) { if (-not $process.HasExited) { $all_exit=0 } } }
    ++$i
  }
  if ($all_exit -eq 1) { return "" }
}
}

function IISlog_SendMail
# send email with all reports
# Usage: IISlog_SendMail from to subject body attach_dir server username password
{
$mail=New-Object System.Net.Mail.MailMessage
$mail.From=New-Object System.Net.Mail.MailAddress($args[0])
$mail.To.Add($args[1])
$mail.Subject=$args[2]
$mail.Body=$args[3]
$files=Get-ChildItem $args[4]
foreach ($file in $files) { $mail.Attachments.Add((New-Object System.Net.Mail.Attachment($args[4]+"\"+$file))) }
$smtp=New-Object System.Net.Mail.SmtpClient -argumentList $args[5]
$smtp.Credentials=New-Object System.Net.NetworkCredential -argumentList $args[6],$args[7]
$smtp.Send($mail)
}

function IISlog_main
{
Remove-Item .\report\*
$time_start=Get-Date
IISlog_conf_parse
$time_end=Get-Date
IISlog_conf_mail
}

IISlog_main
