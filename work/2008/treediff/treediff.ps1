function treediff_conf_compare
{
treediff_compare "server1" "E:\wwwroot" "server2" "\\server2\e$\wwwroot" @("/temp") @("*.log") | Out-File .\report\yoursunny.csv -encoding default
}

$allow_timediff=600
$allow_sizediff=0

function treediff_conf_mail
{
$mail_from="treediff-sender@test01.yoursunny.cn.nospam"
$mail_to="treediff@admin.yoursunny.cn.nospam"
$mail_title="treediff report"
$mail_body=""
$smtp_server="smtp.yoursunny.cn"
$smtp_username="smtpuser"
$smtp_password="Pass!word1"

# ---- do not change below this line ----
treediff_SendMail $mail_from $mail_to ($mail_title+" "+(Get-Date).ToString("yyyy-MM-dd")) ($mail_body+"`ntreediff started on "+$time_start.ToString("yyyy-MM-dd HH:mm:ss")+" and took "+[Math]::Round(($time_end-$time_start).TotalSeconds)+" seconds.`nhttp://www.65536.cn/work/2008/treediff/") ".\report" $smtp_server $smtp_username $smtp_password
}

function treediff_compare($name1,$folder1,$name2,$folder2,$skip,$ignore)
# compare two folders and generate a report
# Usage: treediff_compare folder_name_1 folder_1 folder_name_2 folder_2 skip_pathes ignore_files
# Example: treediff_compare "PC" "D:\doc" "U-disk" "F:\" @("/app_log","/temp") @("*.tmp")
{
Write-Output ("`"path`",`""+$name1+"`",`""+$name2+"`"")
treediff_folder $name1 $folder1 $name2 $folder2 $skip $ignore ""
}

function treediff_folder($name1,$folder1,$name2,$folder2,$skip,$ignore,$path)
{
if ((treediff_is_skip $skip $path)) { return }
$path1=Join-Path $folder1 $path
$path2=Join-Path $folder2 $path
$c1=Get-ChildItem $path1
$c2=Get-ChildItem $path2
if ($c1) {
  foreach ($f in $c1) {
    $fn=$f.Name
    if ((treediff_is_ignore $ignore $fn)) { continue }
    $fp=$path+"/"+$fn
    $fpc="`""+$fp.Replace("`"","`"`"")+"`""
    $other=treediff_find $c2 $fn
    if ($other -eq "<>") {
      Write-Output ($fpc+",`"exist`",`"not exist`"")
      continue
    }
    if (($f -is [System.IO.FileInfo]) -and ($other -is [System.IO.DirectoryInfo])) {
      Write-Output ($fpc+",`"file`",`"folder`"")
      continue
    }
    if (($f -is [System.IO.DirectoryInfo]) -and ($other -is [System.IO.FileInfo])) {
      Write-Output ($fpc+",`"folder`",`"file`"")
      continue
    }
    if ($f -is [System.IO.DirectoryInfo]) {
      treediff_folder $name1 $folder1 $name2 $folder2 $skip $ignore $fp
      continue
    }
    $time1=$f.LastWriteTime
    $time2=$other.LastWriteTime
    $timediff=($time1-$time2).TotalSeconds
    if ($timediff -lt -$allow_timediff) {
      Write-Output ($fpc+",`"old "+$time1.ToString("yyyy-MM-dd HH:mm:ss")+"`",`"new "+$time2.ToString("yyyy-MM-dd HH:mm:ss")+"`"")
      continue
    }
    if ($timediff -gt $allow_timediff) {
      Write-Output ($fpc+",`"new "+$time1.ToString("yyyy-MM-dd HH:mm:ss")+"`",`"old "+$time2.ToString("yyyy-MM-dd HH:mm:ss")+"`"")
      continue
    }
    $size1=$f.Length
    $size2=$other.Length
    $sizediff=$size1-$size2
    if ($sizediff -lt -$allow_sizediff) {
      Write-Output ($fpc+",`"small "+$size1+" bytes`",`"large "+$size2+" bytes`"")
      continue
    }
    if ($sizediff -gt $allow_sizediff) {
      Write-Output ($fpc+",`"large "+$size1+" bytes`",`"small "+$size2+" bytes`"")
      continue
    }
  }
}
if ($c2) {
  foreach ($f in $c2) {
    $fn=$f.Name
    $fp=$path+"/"+$fn
    $fpc="`""+$fp.Replace("`"","`"`"")+"`""
    $other=treediff_find $c1 $fn
    if ($other -eq "<>") {
      Write-Output ($fpc+",`"not exist`",`"exist`"")
      continue
    }
  }
}
}

function treediff_find($list,$name)
{
if (-not $list) { return "<>" }
$namel=$name.ToLower()
foreach ($f in $list) { if ($f.Name.ToLower() -eq $namel) { return $f } }
return "<>"
}

function treediff_is_skip($skip,$path)
{
if (-not $skip) { return 0 }
$pathl=$path.ToLower()
foreach ($skippath in $skip) { if ($skippath.ToLower() -eq $pathl) { return 1 } }
return 0
}

function treediff_is_ignore($ignore,$fn)
{
if (-not $ignore) { return 0 }
foreach ($ignorepattern in $ignore) { if ($fn -like $ignorepattern) { return 1 } }
return 0
}

function treediff_SendMail
# send email with all reports
# Usage: treediff_SendMail from to subject body attach_dir server username password
{
$mail=New-Object System.Net.Mail.MailMessage
$mail.From=New-Object System.Net.Mail.MailAddress($args[0])
$mail.To.Add($args[1])
$mail.Subject=$args[2]
$mail.Body=$args[3]
$files=Get-ChildItem $args[4]
foreach ($file in $files) { $mail.Attachments.Add((New-Object System.Net.Mail.Attachment($args[4]+"\"+$file))) }
$smtp=New-Object System.Net.Mail.SmtpClient $args[5]
$smtp.Credentials=New-Object System.Net.NetworkCredential $args[6],$args[7]
$smtp.Send($mail)
}

function treediff_main
{
Remove-Item .\report\*
$time_start=Get-Date
treediff_conf_compare
$time_end=Get-Date
treediff_conf_mail
}

treediff_main
