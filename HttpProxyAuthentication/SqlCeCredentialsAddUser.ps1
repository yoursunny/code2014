# if you deleted yourself from the database by mistake,
# run this script to add a user to the database
# usage: powershell path\to\SqlCeCredentialsAddUser.ps1 path\to\HttpProxyAuthentication.sdf userid password
# example: powershell scripts\SqlCeCredentialsAddUser.ps1 conf\HttpProxyAuthentication.sdf sunny 123456

[System.Reflection.Assembly]::LoadWithPartialName("System.Data.SqlServerCe")
$conn=New-Object System.Data.SqlServerCe.SqlCeConnection ("datasource="+$args[0]+";mode=Read Write;")
$conn.Open()
$cmd=$conn.CreateCommand()
$cmd.CommandText="INSERT UserCredentials (userid,password) VALUES (@userid,@password)"
$cmd.Parameters.Add("@userid",$args[1]);
$cmd.Parameters.Add("@password",$args[2]);
$cmd.ExecuteNonQuery()
$conn.Close()
