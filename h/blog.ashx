<%@ WebHandler Language="C#" Class="yoursunny.PersonalSite.HomePage.blogHandler" %>
using System;
using System.Web;
using System.Xml;
using System.Net;
using System.IO;
using System.Text;
namespace yoursunny.PersonalSite.HomePage
{
    public class blogHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext c)
        {
            try
            {
                c.Response.ContentType = "text/javascript";
                if (c.Request.QueryString["force"] == "1" || !File.Exists(c.Server.MapPath("blog.js")) || File.GetLastWriteTime(c.Server.MapPath("blog.js")) < DateTime.Now.AddHours(-3))
                {
                    StreamWriter w = new StreamWriter(c.Server.MapPath("blog.js"));
                    w.Write(DoRSS(@"http://sunny.10mb.cn/rss.xml", "blog_p", @"http://sunny.10mb.cn/", @"http://sunny.10mb.cn/", c));
                    w.Write(DoRSS(@"http://yoursunny.blogspot.com/rss.xml", "blog_t", @"http://yoursunny.blogspot.com/", @"http://yoursunny.blogspot.com/", c));
                    w.Flush(); w.Close();
                }
                c.Response.WriteFile(c.Server.MapPath("blog.js"));
            }
            catch (Exception e)
            {
                c.Response.ContentType = "text/plain";
                c.Response.Write(e.ToString());
            }
        }
        private string DoRSS(string RSSurl, string JSobj, string oldDomain, string newDomain, HttpContext c)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                //doc.Load(RSSurl);
                {
                    HttpWebRequest req = WebRequest.Create(RSSurl) as HttpWebRequest;
                    req.Timeout = 20000;
                    HttpWebResponse resp = req.GetResponse() as HttpWebResponse;
                    doc.Load(resp.GetResponseStream());
                    resp.Close();
                }
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
                                        link = n.InnerText.Replace(oldDomain, newDomain);
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
                            b.Append(c.Server.HtmlEncode(title));
                            b.Append("\" onclick=\"c(this)\">");
                            if (title.Length > 13) title = title.Substring(0, 13) + "..";
                            b.Append(c.Server.HtmlEncode(title));
                            b.Append("</a></dt><dd>");
                            b.Append(date.ToString("MM-dd HH:mm"));
                            b.Append("</dd>");
                        }
                    }
                }
                b.AppendLine("</dl>';");
                return b.ToString();
            }
            catch (Exception e)
            {
                c.Response.ContentType = "text/plain";
                c.Response.Write(e.ToString());
            }
            return "";
        }
        public bool IsReusable { get { return true; } }
    }
}