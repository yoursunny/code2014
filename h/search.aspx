<%@ Page Language="C#" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.Net.Sockets" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.IO.Compression" %>
<%@ Import Namespace="System.Xml" %>
<script runat="server">
    protected void Page_Load(Object sender, EventArgs e)
    {
        if (!string.IsNullOrEmpty(Request.QueryString["q"])) q();
    }
    protected void Result(string t, string l)//t显示结果,l日志结果
    {
        a.Text = t;
        StreamWriter w = new StreamWriter(Server.MapPath("search.txt"), true);
        w.WriteLine(DateTime.Now.ToString("MM-dd HH:mm ") + Request.UserHostAddress + " " + l);
        w.Close();
    }
    protected void Result(string t) { Result(t, t); }
    protected bool IsDebug { get { return !String.IsNullOrEmpty(Request.QueryString["debug"]); } }
	protected void q()
    {
        string n = Request.QueryString["q"];

        //手机号码
        {
            Int64 temp;
            if (Int64.TryParse(n, out temp))
            {
                Result("手机号码 " + n + " 归属地 " + QueryMobile(n));
                return;
            }
        }

        //IP地址
        {
            IPAddress ip;
            if (IPAddress.TryParse(n, out ip))
            {
                Result("IP地址 " + n + " " + QueryIP(n));
                return;
            }
            if (n.Contains(".") && !n.Contains(" "))
            {
                try
                {
                    IPAddress[] IPs = Dns.GetHostAddresses(n);
                    string IPn = IPs[0].ToString();
                    Result("域名 " + n + " IP地址 " + IPn + " 归属地 " + QueryIP(IPn));
                }
                catch (Exception e)
                {
                    if (IsDebug) Response.Write(e.ToString());
                    Result("域名 " + n + " 无法解析");
                }
                return;
            }
        }

        //词典搜索
        {
            if (n.StartsWith(" "))
            {
                try
                {
                    Result("单词 " + n.Trim() + " 解释 " + QueryDict(n.Trim()), "单词 " + n.Trim());
                }
                catch (Exception e)
                {
                    if (IsDebug) Response.Write(e.ToString());
                    Result("单词 " + n + " 查询失败");
                }
                return;
            }
        }

        //Google
        {
            try
            {
                Result("搜索 " + n + " 结果：" + QueryGoogle(n), "搜索 " + n + " Google");
            }
            catch (Exception e)
            {
                if (IsDebug) Response.Write(e.ToString());
                Result("搜索 " + n + " 查询失败");
            }
            return;
        }
    }
    public string QueryGoogle(string n)
    {
        GoogleSearch.GoogleSearchService service = new GoogleSearch.GoogleSearchService();
        GoogleSearch.GoogleSearchResult result = service.doGoogleSearch("kmQyCzNQFHIcdSweoMNIPIfqyxF9xePN", n, 0, 10, true, "", true, "", "", "");
        StringBuilder b = new StringBuilder();
        b.Append(result.estimatedTotalResultsCount);
        b.Append("个网页 耗时");
        b.Append(result.searchTime);
        b.Append("秒<br/><dl id=\"google\">\n");
        for (int i = 0; i < result.resultElements.Length; ++i)
        {
            GoogleSearch.ResultElement e = result.resultElements[i];
            b.Append("<dt><a href=\"");
            b.Append(Server.HtmlEncode(e.URL));
            b.Append("\" target=\"_blank\">");
            b.Append(e.title);
            b.Append("</a></dt>\n<dd>");
            b.Append(e.snippet);
            b.Append("</dd>\n");            
        }
        b.Append("</dl>");
        return b.ToString();
    }
    public string QueryDict(string n)
    {
        XmlReader r = XmlReader.Create("http://dict.cn/ws.php?utf8=true&q=" + Server.UrlEncode(n));
        //XmlReader r = XmlReader.Create("http://2169.net/sunny/proxy/proxy.asp?u=" + Server.UrlEncode("http://dict.cn/ws.php?utf8=true&q=" + Server.UrlEncode(n)));
        r.ReadToFollowing("def");
        string def = r.ReadElementContentAsString();
        r.Close();
        return def;
    }
    /* mini接口,XML故障时使用
    public string QueryDict(string n)
    {
        WebClient client = new WebClient();
        StreamReader r = new StreamReader(new MemoryStream(client.DownloadData("http://dict.cn/mini.php?q=" + Server.UrlEncode(n))), Encoding.GetEncoding("GB2312"));
        StringBuilder b = new StringBuilder("<br/>");
        bool append = false;
        for (int i = 0; i < 200; ++i)
        {
            string l = r.ReadLine();
            if (l.Contains("<span class=\"g\">Define</span>")) append = true;
            if (l.Trim() == "<div align=\"center\">") { append = false; break; }
            if (append) b.AppendLine(l);
        }
        client.Dispose();
        r.Close();
        string s = b.ToString();
        int pos1 = s.IndexOf("<object ");
        int pos2 = s.IndexOf("</object>");
        if (pos1 < 0) return s;
        return (s.Substring(0, pos1) + s.Substring(pos2 + 9));
    }
     */
    public string QueryIP(string n)
	{
		string result = "";
        try
        {
            HttpWebRequest req = WebRequest.Create("http://www.cz88.net/ip/ipcheck.aspx?ip=" + n) as HttpWebRequest;
            //HttpWebRequest req = WebRequest.Create("http://2169.net/sunny/proxy/proxy.asp?u=" + Server.UrlEncode("http://www.cz88.net/ip/ipcheck.aspx?ip=" + n)) as HttpWebRequest;
            HttpWebResponse resp = req.GetResponse() as HttpWebResponse;
            StreamReader r = new StreamReader(resp.GetResponseStream(), Encoding.GetEncoding("GB2312"));
            //StreamReader r = new StreamReader(resp.GetResponseStream());
            result = r.ReadLine().Replace("document.write(\"", "").Replace("\");", "").Replace("CZ88.NET", "").Trim();
            if (result.IndexOf("纯真网络") >= 0 && result.IndexOf("IP数据") >= 0) result = "";
        }
        catch (Exception e) { if (IsDebug) Response.Write(e.ToString()); }
		return result;
	}
	public string QueryMobile(string n)
	{
		if (n.Length < 7) return "";
		Random rand = new Random();
		string num = n.Substring(0, 7) + rand.Next(1000, 10000).ToString();
		Int64 t; if (!Int64.TryParse(num, out t)) return "";
		if (t >= 13400000000 && t <= 13999999999) return QueryCMCC(num);
		if (t >= 15900000000 && t <= 15999999999) return QueryCMCC(num);
        if (t >= 13000000000 && t <= 13399999999) return QueryUnicom(num);
        if (t >= 15300000000 && t <= 15399999999) return QueryUnicom(num);
        return "";
	}
	private string QueryCMCC(string n)
	{
        //return "移动查询接口目前有故障，近期无法查询";
		string result = "";
		try
		{
			HttpWebRequest req = WebRequest.Create("http://www.chinamobile.com/ZZFW/Search_Result.asp?ClassID=2&ClassChild_ID=19") as HttpWebRequest;
			req.Method = "POST";
			req.UserAgent = "Mozilla/5.0 (yoursunny mobile location query (ASP.NET))";
			req.Accept = "text/xml,application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,* /*;q=0.5";
			req.Headers.Add("Accept-Language", "zh-cn,zh;q=0.5");
			req.Headers.Add("Accept-Encoding", "gzip");
			req.Headers.Add("Accept-Charset", "gb2312,utf-8;q=0.7,*;q=0.7");
			req.Referer = "http://www.chinamobile.com/ZZFW/hdcx.asp?ClassID=2&ClassChild_ID=19";
			req.Headers.Add("Cookie", "ASPSESSIONIDQQQASTTQ=HNLOHHBDCJGIDKCOPPOONLBI");
			req.ContentType = "application/x-www-form-urlencoded";
			req.ContentLength = 39;
			req.Timeout = 5000;
			StreamWriter w = new StreamWriter(req.GetRequestStream(), Encoding.GetEncoding("GB2312"));
			w.Write("phoneNo=" + n + "&submit=%B2%E9%D1%AF");
			w.Flush();
            //HttpWebRequest req = WebRequest.Create("http://2169.net/sunny/proxy/cmcc.asp?n=" + Server.UrlEncode(n)) as HttpWebRequest;
			HttpWebResponse resp = req.GetResponse() as HttpWebResponse;
			//StreamReader r = new StreamReader(new GZipStream(resp.GetResponseStream(), CompressionMode.Decompress), Encoding.GetEncoding("GB2312"));
			StreamReader r = new StreamReader(resp.GetResponseStream(), Encoding.GetEncoding("GB2312"));
            for (int i = 0; i < 500; ++i)
			{
                if (r.EndOfStream) break;
				string l = r.ReadLine();
				if (l.IndexOf("手机号码所属地为：") >= 0)
				{
					result = l.Replace("手机号码所属地为：", "").Replace("</td>", "").Trim();
					break;
				}
			}
			w.Dispose();
			r.Close();
			r.Dispose();
		}
        catch (Exception e) { if (IsDebug) Response.Write(e.ToString()); }
        return result;
	}
	private string QueryUnicom(string n)
	{
		string result = "";
		try
		{
			TcpClient client = new TcpClient();
			client.Connect(Dns.GetHostAddresses("www.chinaunicom.com")[0], 80);
			while (!client.Connected) ;
			NetworkStream s = client.GetStream();
			StreamWriter w = new StreamWriter(s);
			w.WriteLine("POST /tools/phone/queryLocationByPhone.do HTTP/1.1");
            w.WriteLine("Accept: *" + "/*");
			w.WriteLine("Referer: http://www.chinaunicom.com/services/zzfw/index.html");
			w.WriteLine("Accept-Language: zh-cn");
			w.WriteLine("Content-Type: application/x-www-form-urlencoded");
			w.WriteLine("Accept-Encoding: gzip, deflate");
			w.WriteLine("User-Agent: yoursunny mobile location query (ASP.NET)");
			w.WriteLine("Host: www.chinaunicom.com");
			w.WriteLine("Content-Length: 26");
			w.WriteLine("Connection: close");
			w.WriteLine("Cache-Control: no-cache");
			w.WriteLine();
			w.WriteLine("phone=" + n + "&sjhfket=");
			w.WriteLine();
			w.Flush();
			StreamReader r = new StreamReader(s, Encoding.GetEncoding("GB2312"));
            /*
            HttpWebRequest req = WebRequest.Create("http://2169.net/sunny/proxy/unicom.asp?n=" + Server.UrlEncode(n)) as HttpWebRequest;
            HttpWebResponse resp = req.GetResponse() as HttpWebResponse;
            StreamReader r = new StreamReader(resp.GetResponseStream(), Encoding.GetEncoding("GB2312"));
             */
            for (int i = 0; i < 500; ++i)
			{
				string l = r.ReadLine();
				if (l.IndexOf("<div align=\"right\">归属地：</div>") >= 0) break;
			}
			result = r.ReadLine().Replace("<td>", "").Replace("</td>", "").Trim();
			//w.Dispose();
			r.Close();
			r.Dispose();
		}
        catch (Exception e) { if (IsDebug) Response.Write(e.ToString()); }
        return result;
	}
</script>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>综合搜索</title>
<style type="text/css">
#google dt { font-size: 12pt; margin-top: 1em; }
#google dd { font-size: 9pt; }
</style>
</head>
<body>
<form method="get">
<input type="text" name="q" size="30" />
<input type="submit" value="查询" />
</form>
<asp:Literal ID="a" runat="server">
本综合搜索工具当前支持：
<ul>
<li>手机归属地查询，数据来自移动、联通，请输入手机号码</li>
<li>IP地址归属地查询，数据来自纯真官方站，请输入IP地址或域名</li>
<li>词典查询，数据来自dict.cn，请在单词前加一个空格查询</li>
<li>Google搜索，不能识别的字符串均提交Google</li>
</ul>
</asp:Literal>
</body>
</html>
