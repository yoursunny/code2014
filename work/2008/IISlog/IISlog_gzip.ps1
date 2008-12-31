$compress_tool="GZip"
#$compress_tool="WinRAR"
# please choose one and only one compress_tool
function IISlog_gzip_main
{
  $date=(Get-Date).AddDays(-4)
  IISlog_gzip $date "D:\LogFiles\W3SVC1" ".\yoursunny.cn\server1"
  IISlog_gzip $date "\\server2\d$\LogFiles\W3SVC1" ".\yoursunny.cn\server2"
}
# ---- do not change below this line ----

function CopyStream ([System.IO.Stream] $source, [System.IO.Stream] $target)
{
  $bufSize=65536
  [byte[]] $buf=0,0,0,0,0,0,0,0
  for ($i=3;$i -lt 16;++$i) { $buf=$buf+$buf }
  $bytesRead=0
  while (($bytesRead=$source.Read($buf,0,$bufSize)) -gt 0) {
    $target.Write($buf,0,$bytesRead)
  }
}

function GZip ([string] $source, [string] $target)
{
  $s1=New-Object System.IO.FileStream @($source,[System.IO.FileMode]::Open)
  $s2=New-Object System.IO.FileStream @($target,[System.IO.FileMode]::Create)
  $sg=New-Object System.IO.Compression.GZipStream @($s2,[System.IO.Compression.CompressionMode]::Compress)
  CopyStream $s1 $sg
  $s1.Close()
  $sg.Close()
}

function WinRAR ([string] $source, [string] $target)
{
  $process=[System.Diagnostics.Process]::Start("C:\Program Files\WinRAR\rar.exe",("m -ep -m5 `""+$target+"`" `""+$source+"`""))
  $process.PriorityClass=[System.Diagnostics.ProcessPriorityClass]::BelowNormal
  $process.WaitForExit()
}

function IISlog_gzip ($date, $logpath, $gzpath)
# gzip logfiles before $date from $logpath into $gzpath
{
  $date_max=$date.Year%100*10000+$date.Month*100+$date.Day
  $l=Get-ChildItem -path $logpath -filter "ex??????.log"
  $gzpatha=Join-Path $gzpath . -resolve
  if (-not $l) { return }
  foreach ($f in $l)
  {
    $d=0
    $d=[int]::Parse($f.Name.SubString(2,6))
    if (($d -gt 0) -and ($d -le $date_max)) {
      if ($compress_tool -eq "GZip") {
        GZip $f.FullName ($gzpatha+"`\"+$f.Name+".gz")
        $f.Delete()
      }
      elseif ($compress_tool -eq "WinRAR") {
        WinRAR $f.FullName ($gzpatha+"`\"+[System.IO.Path]::ChangeExtension($f.Name,".rar"))
      }
    }
    trap [System.FormatException] { continue }
    trap [System.IO.IOException] { }
  }
}

IISlog_gzip_main