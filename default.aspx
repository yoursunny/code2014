<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<script runat="server">
	protected void Page_Load(Object sender, EventArgs e)
	{
        if (Request.Url.Host != "yoursunny.com" && Request.Url.Host != "isunny.eb.cn")
        {
            Response.AddHeader("Location", "http://yoursunny.com/");
            Response.StatusCode = 301;
        }
        if (Request.RequestType == "GET")
        {
            if (IsCrawler())
            {
                const string keywords = "石君霄,上海交通大学,交通大学,交大,上海交大,阳光男孩,你的阳光,你的,阳光,男孩,阳光男孩,yoursunny,your,sunny,boy,sunnyboy";
                const string description = "阳光男孩个人站点，欢迎您的访问；个人博客、学习心得、课件资源、网络技巧、免费推荐……";
                Response.Write("<meta name='keywords' content='" + keywords + "'/>\n");
                Response.Write("<meta name='description' content='" + description + "'/>\n");
                Response.Write("<span style='display:none;'>" + keywords + "</span>\n");
            }
            Response.WriteFile(Server.MapPath("./home.htm"));
            SaveLog((Request.UrlReferrer == null) ? "" : Request.UrlReferrer.AbsoluteUri, "", 0);
        }
        else
        {
            SaveLog("", new Uri(Request.Form["to"]).AbsoluteUri, Int32.Parse(Request.Form["stay"]));
            Response.Write("<html><!--已记录信息--></html>");
        }
	}
	private string qqwry()
	{
		PPTech.WebSite.BusinessRules.IPScaner objScan = new PPTech.WebSite.BusinessRules.IPScaner();
		objScan.DataPath = Server.MapPath("~/App_Data/QQWry.Dat");
		objScan.IP = Request.UserHostAddress;
		return objScan.IPLocation();
	}
	private bool IsCrawler()
	{
        if (Request.UserAgent == null) return false;
		string UA = Request.UserAgent.ToLower();
		return (UA.IndexOf("bot") >= 0 || UA.IndexOf("spider") >= 0 || UA.IndexOf("yahoo") >= 0);
	}
    private void SaveLog(string from, string to, int stay)
    {
        try
        {
            StreamWriter w = new StreamWriter(Server.MapPath("h/visitlog.txt"), true, Encoding.UTF8);
            w.Write(DateTime.Now.ToString("MM-dd HH:mm,"));
            w.Write(Request.UserHostAddress + "," + qqwry() + ",");
            w.Write(((Request.Browser.Browser == "Unknown") ? Request.ServerVariables["HTTP_USER_AGENT"] : (Request.Browser.Browser + " " + Request.Browser.Version)) + ",");
            w.Write(from + ",");
            w.Write(to + ",");
            w.Write(stay.ToString());
            w.WriteLine();
            w.Flush(); w.Close(); w.Dispose();
        }
        catch { }
    }
</script>