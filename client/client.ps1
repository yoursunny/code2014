# ScoreBoard client
$server="127.0.0.1"

$ep=New-Object System.Net.IPEndPoint @([System.Net.IPAddress]::Parse($server),1127)
$udp=New-Object System.Net.Sockets.UdpClient
$udp.Connect($ep)

function IntToBigEndian($n) {
# convert Int32 to 4 bytes big endian
  $b=@(0)*4
  $b[3]=$n%0x100
  $n=($n-$b[3])/0x100
  $b[2]=$n%0x100
  $n=($n-$b[2])/0x100
  $b[1]=$n%0x100
  $n=($n-$b[1])/0x100
  $b[0]=$n%0x100
  return [byte[]]$b
}

function BigEndianToInt($b,$start) {
  $n=$b[$start]
  $n*=0x100
  $n+=$b[$start+1]
  $n*=0x100
  $n+=$b[$start+2]
  $n*=0x100
  $n+=$b[$start+3]
  return $n
}

[byte[]]$identifier=([regex]::Matches("e2cbb580cb094ebaa36bf607ce953f2b","\w{2}") |% {"0x$_"})

function GetValue() {
  req ($identifier+0x00)
  recv
}

function SetValue($L,$R) {
  req ($identifier+0x01+(IntToBigEndian $L)+(IntToBigEndian $R))
  recv
}

function GetColor() {
  req ($identifier+0x10)
  recv
}

function SetColor($R,$G,$B) {
  req ($identifier+0x11+$R+$G+$B)
  recv
}

function req($diagram) {
  while ($udp.Available) { $udp.Receive([ref]$ep) }
  $udp.Send($diagram,$diagram.Length) | Out-Null
}

function recv() {
  Start-Sleep -milliseconds 100
  if ($udp.Available) {
    $diagram=$udp.Receive([ref]$ep)
    trap {
      Write-Host "ScoreBoard server not available"
      break
    }
    switch ($diagram[16]) {
      0x80 {
        if ($diagram.Length -ge 25) {
          Write-Host ("VALUE L="+(BigEndianToInt $diagram 17)+" R="+(BigEndianToInt $diagram 21))
          return
        }
      }
      0x90 {
        if ($diagram.Length -ge 20) {
          Write-Host ("VALUE Red="+$diagram[17]+" Green="+$diagram[18]+" Blue="+$diagram[19])
          return
        }
      }
    }
  }
  Write-Host "No response"
}

