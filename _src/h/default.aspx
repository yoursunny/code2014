<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<script runat="server">
	protected void Page_Load(Object sender, EventArgs e)
	{
        if (Request.RequestType == "GET")
        {
            if (IsCrawler())
            {
                Response.Write("<meta name=\"keywords\" content=\"石君霄,上海交通大学,交通大学,交大,阳光男孩,你的阳光,你的,阳光,男孩,阳光男孩,yoursunny,your,sunny,boy,sunnyboy\"/>");
                Response.Write("石君霄,上海交通大学,交通大学,交大,阳光男孩,你的阳光,你的,阳光,男孩,阳光男孩,yoursunny,your,sunny,boy,sunnyboy");
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
		string UA = Request.UserAgent.ToLower();
		return (UA.IndexOf("bot") >= 0 || UA.IndexOf("spider") >= 0 || UA.IndexOf("yahoo") >= 0);
	}
    private void SaveLog(string from, string to, int stay)
    {
        try
        {
            StreamWriter w = new StreamWriter(Server.MapPath("visitlog.txt"), true, Encoding.UTF8);
            w.Write(DateTime.Now.ToString("MM-dd HH:mm,"));
            w.Write(Request.UserHostAddress + "," + qqwry() + ",");
            w.Write(Request.Browser.Browser + " " + Request.Browser.Version + ",");
            w.Write(from + ",");
            w.Write(to + ",");
            w.Write(stay.ToString());
            w.WriteLine();
            w.Flush(); w.Close(); w.Dispose();
        }
        catch { }
    }
</script>