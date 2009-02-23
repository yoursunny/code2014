
function UseDirectRequestLine() {
  return $false
}

function Credentials() {
  return $null
}

function GetProxy($u) {
  if ($u -contains "blogspot.com") { return "www.google.cn:80" }
}

function IsBypassed($uhost) {
  return $false
}
