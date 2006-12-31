<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.Xml" %>
<script runat="server">
	StreamReader r;
	XmlWriter w;
	protected void Page_Load(Object sender, EventArgs e)
	{
		WebClient client = new WebClient();
		byte[] buffer = client.DownloadData("http://group.5q.com/community/Home.do?commno=" + Request.QueryString["commno"]);
		MemoryStream s = new MemoryStream(buffer);
		r = new StreamReader(s,Encoding.GetEncoding("GB2312"));
		Response.ContentType = "text/xml";
		w = XmlWriter.Create(Response.Output);
		w.WriteStartDocument();
		w.WriteStartElement("rss");
		w.WriteAttributeString("version", "2.0");

		CommInfo();
		w.WriteElementString("generator", "yoursunny.com 5Q圈子 - RSS 转换器");
		GetLine("<div id=\"hotlist\">");
		Items();
		
		w.WriteEndElement();//rss
		w.WriteEndDocument();
		w.Flush();
		w.Close();
		s.Close();
		s.Dispose();
	}
	private void log(string name)
	{
		StreamWriter w = File.AppendText(Server.MapPath("rss.txt"));
		w.WriteLine(DateTime.Now.ToString() + "   " + Request.UserHostAddress + "   " + Request.QueryString["commno"] + "  " + name);
		w.Flush();
		w.Close();
	}
	private string GetLine(string substring)//跳到含有指定内容的行
	{
		string l = "";
		while (true)
		{
			if (r.EndOfStream)
			{
				l = "";
				break;
			}
			l = r.ReadLine();
			if (l.IndexOf(substring) >= 0) break;
		}
		return l;
	}
	private void CommInfo()
	{
		string name, link, image, l;
		l = GetLine("http://group.5q.com/HomePage.do");
		link = l.Substring(l.IndexOf("<b>") + 3, l.IndexOf("</b>") - l.IndexOf("<b>") - 3);
		l = GetLine("http://cover.5q.com");
		image = l.Substring(l.IndexOf("http://cover.5q.com"), l.IndexOf("border=") - l.IndexOf("http://cover.5q.com") - 2);
		l = GetLine("小圈子名：");
		name = Server.HtmlDecode(l.Substring(l.IndexOf("<b>") + 3, l.IndexOf("</b>") - l.IndexOf("<b>") - 3));
		w.WriteElementString("title", name);
		w.WriteElementString("link", link);
		w.WriteStartElement("image");
		w.WriteElementString("url", image);
		w.WriteEndElement();//image
		log(name);
	}
	private void Items()
	{
		while (true)
		{
			string l = GetLine("http://group.5q.com/topic/ShowTopic.do");
			if (l == "") break;
			Item(l);
		}
	}
	private void Item(string line)
	{
		string title, link, author, l;
		l = line;
		link = l.Substring(l.IndexOf("http://group.5q.com/topic/ShowTopic.do"), l.IndexOf("target=") - l.IndexOf("http://group.5q.com/topic/ShowTopic.do") - 2);
		title = Server.HtmlDecode(l.Substring(l.IndexOf("<font") + 22, l.IndexOf("</", l.IndexOf("<font") + 22) - l.IndexOf("<font") - 22));
		l = GetLine("http://5q.com/society/SocietyUserPerson.do");
		author = Server.HtmlDecode(l.Substring(l.IndexOf("\"_blank\">") + 9, l.IndexOf("</a>") - l.IndexOf("\"_blank\">") - 9));
		w.WriteStartElement("item");
		w.WriteElementString("title", title);
		w.WriteElementString("link", link);
		w.WriteStartElement("guid");
		w.WriteAttributeString("isPermaLink", "true");
		w.WriteString(link);
		w.WriteEndElement();//guid
		w.WriteElementString("author", author);
		w.WriteEndElement();//item
	}
</script>