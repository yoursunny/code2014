$wc=New-Object Net.WebClient
$h=$wc.DownloadString("http://www.nic.edu.cn/RS/ipstat/internalip/").Split("`n")
$in=$false
$regex=New-Object Text.RegularExpressions.Regex "(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)",ECMAScript
function P() {
  foreach ($l in $h) {
    if ($l -contains "</pre>") { $in=$false }
    if ($in) {
      $m=$regex.Match($l)
      if ($m.get_Success()) {
        $g=$m.get_Groups()
        $a=$g[1].get_Value().Split(".")
        $network_number=((([int]::Parse($a[0])*256)+[int]::Parse($a[1]))*256+[int]::Parse($a[2]))*256+[int]::Parse($a[3])
        $a=$g[2].get_Value().Split(".")
        $host_bits=((([int]::Parse($a[0])*256)+[int]::Parse($a[1]))*256+[int]::Parse($a[2]))*256+[int]::Parse($a[3])
        Write-Output ($network_number.ToString()+","+($network_number+$host_bits))
      }
    }
    if ($l -contains "<pre>") { $in=$true }
  }
}
P | Out-File CernetFreeIP.csv