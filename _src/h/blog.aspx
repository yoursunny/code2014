<%@ Page Language="C#" %>
<%@ Import Namespace="System.Xml" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Net" %>
<script runat="server">
	protected void Page_Load(Object sender, EventArgs e)
	{
        Response.ContentType = "text/javascript";
        DoRSS(@"http://p.bloggerspaces.com/rss.xml", "blog_p.rss", "blog_p");
        DoRSS(@"http://t.bloggerspaces.com/rss.xml", "blog_t.rss", "blog_t");
    }
    private void DoRSS(string RSSurl, string CACHEfile, string JSobj)
    {
        try
        {
            FileInfo cache = new FileInfo(Server.MapPath(CACHEfile));
            if (!cache.Exists || cache.LastWriteTime < DateTime.Now.AddHours(-3))
            {
                WebClient client = new WebClient();
                client.DownloadFile(RSSurl, Server.MapPath(CACHEfile));
            }
            XmlDocument doc = new XmlDocument();
            doc.Load(Server.MapPath(CACHEfile));
            StringBuilder b = new StringBuilder("document.getElementById('");
            b.Append(JSobj);
            b.Append("').innerHTML='<dl class=\"blog\">");
            int count = 0;

            foreach (XmlNode node in doc.DocumentElement.FirstChild.ChildNodes)//FirstChild=<channel>
            {
                if (node.NodeType == XmlNodeType.Element && node.Name == "item")
                {
                    string title = "";
                    string link = "";
                    DateTime date = DateTime.Now;
                    foreach (XmlNode n in node.ChildNodes)
                    {
                        if (n.NodeType == XmlNodeType.Element)
                        {
                            switch (n.Name)
                            {
                                case "title":
                                    title = n.InnerText;
                                    break;
                                case "link":
                                    link = n.InnerText;
                                    break;
                                case "pubDate":
                                    date = DateTime.Parse(n.InnerText);
                                    break;
                            }
                        }

                    }
                    if (title.Length > 0 && link.Length > 0 && count < 5)
                    {
                        ++count;
                        b.Append("<dt><a href=\"");
                        b.Append(link);
                        b.Append("\" title=\"");
                        b.Append(Server.HtmlEncode(title));
                        b.Append("\" onclick=\"c(this)\">");
                        if (title.Length > 13) title = title.Substring(0, 13) + "..";
                        b.Append(Server.HtmlEncode(title));
                        b.Append("</a></dt><dd>");
                        b.Append(date.ToString("MM-dd HH:mm"));
                        b.Append("</dd>");
                    }
                }
            }
            b.AppendLine("</dl>';");
            Response.Write(b.ToString());
        }
        catch { }
    }
</script>