<%@ Page Language="C#" ResponseEncoding="GB2312" %>
<%@ Import Namespace="System.Xml" %>
<script runat="server">
	protected void Page_Load(Object sender, EventArgs e)
	{
		try
		{
			XmlDocument doc = new XmlDocument();
			doc.Load("http://t.bloggerspaces.com/rss.xml");
			StringBuilder b = new StringBuilder("function yoursunny_threads(){document.getElementById('NewEvent').innerHTML='<div class=\"partHeader\">精彩帖子收藏区<div class=\"more\">&nbsp;<a href=\"http:\\/\\/threads.yoursunny.com\\/\">查看全部</a></div></div></div><div class=\"partCont\" style=\"height:5em\"><ul>");
			int count = 0;

			foreach (XmlNode node in doc.DocumentElement.FirstChild.ChildNodes)//FirstChild=<channel>
			{
				if (node.NodeType == XmlNodeType.Element && node.Name == "item")
				{
					string title = "";
					string link = "";
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
							}
						}

					}
					if (title.Length > 0 && link.Length > 0 && count < 5)
					{
						++count;
						if (title.Length > 20) title = title.Substring(0, 18) + "..";
						b.Append("<li><a href=\"");
						b.Append(link);
						b.Append("\">");
						b.Append(Server.HtmlEncode(title));
						b.Append("</a></li>");
					}
				}
			}
			b.Append("</ul></div>';}setTimeout('yoursunny_threads()',1000);");
			Response.ContentType = "text/javascript";
			Response.Write(b.ToString());
		}
		catch { }
	}
</script>