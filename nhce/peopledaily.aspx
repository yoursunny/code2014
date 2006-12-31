<%@ Page Language="C#" %>
<%@ Import Namespace="System.Xml" %>
<script runat="server">
	protected void Page_Load(Object sender, EventArgs e)
	{
		try
		{
			XmlDocument doc = new XmlDocument();
			doc.Load("http://english.people.com.cn/rss/" + Request.QueryString["area"] + ".xml");
			StringBuilder b = new StringBuilder("document.getElementById('div_peopledaily').innerHTML='<dl>");
			int count = 0;

			foreach (XmlNode node in doc.DocumentElement.FirstChild.ChildNodes)//FirstChild=<channel>
			{
				if (node.NodeType == XmlNodeType.Element && node.Name == "item")
				{
					string title = "";
					string link = "";
					string description = "";
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
								case "description":
									description = n.InnerText;
									break;
									
							}
						}

					}
					if (title.Length > 0 && link.Length > 0 && count < 5)
					{
						++count;
						b.Append("<dt><a href=\"");
						b.Append(link);
						b.Append("\">");
						b.Append(Server.HtmlEncode(title).Replace("\n", " ").Replace("\r", "").Replace("'", "\\'"));
						b.Append("</a></dt><dd>");
						b.Append(Server.HtmlEncode(description).Replace("\n", " ").Replace("\r", "").Replace("'", "\\'"));
						b.Append("</dd>");
					}
				}
			}
			b.Append("</dl>';");
			Response.ContentType = "text/javascript";
			Response.Write(b.ToString());
		}
		catch { }
	}
</script>