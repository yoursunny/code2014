sample configuration files for hProxyN

----------------------------------------------------------------
proxy-simple.config
  HTTP Proxy without authentication or access control.

----------------------------------------------------------------
proxy-auth-basic.config
  Proxy-Authenticate, Basic schema.
  Visit http://any.host/_hProxyN_/B36EB0E1-3A9F-438c-8E82-B69F8F11786B/ to create users.
  Admin userid: sunny, password: 123456
  If you deleted yourself by mistake, add a user with HttpProxyAuthenticationAddUser.ps1

----------------------------------------------------------------
proxy-auth-digest.config
  Proxy-Authenticate, Digest schema.
  Visit http://any.host/_hProxyN_/B36EB0E1-3A9F-438c-8E82-B69F8F11786B/ to create users.
  userid & password: see above

----------------------------------------------------------------
proxy-auth-sjtubbs.config
  Proxy-Authenticate, validates against bbs.sjtu.edu.cn id/password

----------------------------------------------------------------
proxy-acl.config
  HTTP Proxy, with an Access Control List.
  The Access Control List (in proxy-acl.xml) does the following:
  procedure main()
    If you are not from 127.0.0.0/8, deny.
    If HTTP method is not GET or HEAD, deny.
    If visiting *.sjtu.edu.cn (including sjtu.edu.cn), goto procedure sjtu.
    If visiting tieba.baidu.com, deny.
    If visiting feed.feedsky.com from http://yoursunny.com*, deny.
    Accept.
  end procedure
  procedure sjtu()
    If your userid is 'sjtu' or 'sjtuer', accept.
    If visiting (any .asp page on comic.sjtu.edu.cn) or *.seiee.sjtu.edu.cn, deny.
    If visiting the server 202.120.58.161, and url matches regex \/bbsb?find.*, deny.
    If visiting the server 202.120.58.161, and port=8000, deny.
    If visiting bbs.sjtu.edu.cn or bbs6.sjtu.edu.cn, and url matches regex \/bbsdoc.*, and url doesn't contain "board=IS" (determined by a VBScript script), deny.
    If visiting bbs.sjtu.edu.cn or bbs6.sjtu.edu.cn, and url matches regex \/bbstdoc.*, and url doesn't contain "board=SJTUNews" (determined by a PowerShell script), deny.
    Accept.
  end procedure

----------------------------------------------------------------
logging-off.config
  Turn off logging, does not generate log files.

----------------------------------------------------------------
logging-iisw3c.config
  Writes IISW3C log to files.

----------------------------------------------------------------
logging-ncsa.config
  Writes NCSA log to files.

----------------------------------------------------------------
proxy-decompress.config
  HTTP Proxy, decompress any gzip or deflate entities.

----------------------------------------------------------------
proxy-savetofile.config
  HTTP Proxy, save the response entity of every successful GET requests to disk.

----------------------------------------------------------------
proxy-hijack.config
  HTTP Proxy, with "hijacking":
    redirect Google,baidu,soso,sogou queries to Live Search;
    injects ads on bbs.sjtu.edu.cn/bbscon,bbsdoc and comic.sjtu.edu.cn homepage.

----------------------------------------------------------------
service-simple.config
  HTTP Proxy, run as Windows Service.
  Install this with:
    sc create hProxyN binPath= "C:\full\path\to\hProxyN.exe D:\full\path\to\service-simple.config" start= demand
  Then laungh services.msc and configure it to start with an account in Administrators.
  (the service would not start if it is started with SYSTEM)
  It's better to run the service with an account without Administrator privileges,
  but an Administrator should set urlacl with httpcfg.exe for that account.

----------------------------------------------------------------
service-perf.config
  HTTP Proxy, run as Windows Service, publishes statistics information in Windows Performance Counter.
  Install this with:
    sc create hProxyN binPath= "C:\full\path\to\hProxyN.exe D:\full\path\to\service-perf.config" start= demand
  Then laungh services.msc and configure it to start with an account in Administrators.
  (the service would not start if it is started with SYSTEM)
  Laungh perfmon.msc and view counters in hProxyN category

----------------------------------------------------------------
hosting-simple.config
  Web hosting, static only.
  Create this config file with hosting.cmd or hosting-simple.ps1
  Visit http://localhost:81/ http://127.0.0.1:81/ http://127.0.0.2:81/

----------------------------------------------------------------
hosting-php.config
  Web hosting, static and PHP scripting.
  Create this config file with hosting.cmd or hosting-php.ps1
  Visit http://localhost:81/ http://127.0.0.1:81/ http://127.0.0.2:81/

----------------------------------------------------------------
WebFileFetch/demo.cmd
  Fetch a page with Internet Explorer, and observe the requests with LogParser.

----------------------------------------------------------------
proxy-wml.config
  HTTP Proxy, converts all text/vnd.wap.wml responses into text/html.

----------------------------------------------------------------
aspnet.config
  ASP.NET web appliction hosting.
  Create this config file with aspnet.cmd or aspnet.ps1
  Visit http://localhost:81/xiaoniu.aspx  http://localhost:81/aspSysCheck.aspx http://localhost:81/DotNetInfo.aspx

----------------------------------------------------------------
proxy-gateway-fixed.config
  HTTP Proxy with fixed inbound gateway
  All requests are passed to the specified proxy
  Please set your jAccount username/password in config file, or change to another proxy

----------------------------------------------------------------
proxy-gateway-dns.config
  HTTP Proxy, resolving addresses with specified DNS server
  To test this, set dns param to a DNS server of another ISP, visit a website on a CDN. Observe connections with netstat.exe, you may see a CDN node of that ISP.

----------------------------------------------------------------
proxy-xforwardedfor.config
  HTTP Proxy with X-Forwarded-For turned off
  Visit http://www.showmyip.com/simple/, and compare with proxy-simple.config.

----------------------------------------------------------------
proxy-gateway-editable.config
  HTTP Proxy, resolving addresses based on runtime updates
  Hit http://any.host/_hProxyN_/233C731D-1EA5-4c1b-9FD9-4D70F8DF82C6/update.cgi?h=hello.world&a=202.120.58.161, then visit http://hello.world/

----------------------------------------------------------------
proxy-gateway-script.config
  HTTP Proxy, selecting gateway according a PowerShell script

----------------------------------------------------------------
proxy-denylocal.config
  HTTP Proxy, deny request from localhost, so http://proxy-ip:proxy-port/ won't cause loop

----------------------------------------------------------------
proxy-gapp.config
  HTTP Proxy, via GAppProxy

----------------------------------------------------------------
proxy-removexuc.config
  HTTP Proxy, remove X-UA-Compatible header&tag
