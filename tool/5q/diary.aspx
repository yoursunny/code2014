<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.Xml" %>
<script runat="server">
	StreamReader r;
	XmlWriter w;
	string author, userId;
	protected void Page_Load(Object sender, EventArgs e)
	{
		userId = Request.QueryString["userId"];
		WebClient client = new WebClient();
		byte[] buffer = client.DownloadData("http://5q.com/society/SocietyUserPerson.do?userId=" + userId);
		MemoryStream s = new MemoryStream(buffer);
		r = new StreamReader(s, Encoding.GetEncoding("GB2312"));
		Response.ContentType = "text/xml";
		w = XmlWriter.Create(Response.Output);
		w.WriteStartDocument();
		w.WriteStartElement("rss");
		w.WriteAttributeString("version", "2.0");

		PersonInfo();
		w.WriteElementString("generator", "yoursunny.com 5Q日记 - RSS 转换器");
		GetLine("<a href=\"/diary/PsDiaryList.do?userId=");
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
		StreamWriter w = File.AppendText(Server.MapPath("diary.txt"));
		w.WriteLine(DateTime.Now.ToString() + "   " + Request.UserHostAddress + "   " + userId + "  " + name);
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
		Trace.Write(l);
		return l;
	}
	private void PersonInfo()
	{
		string name, link, image, l;
		link = "http://5q.com/diary/PsDiaryList.do?userId=" + userId;
		l = GetLine("-个人主页</title>");
		author = Server.HtmlDecode(l.Substring(l.IndexOf("<title>") + 7, l.IndexOf("-个人主页</title>") - l.IndexOf("<title>") - 7));
		name = author + " - 5Q校园网 日记";
		GetLine(">相册</a> |");
		l = GetLine("<a href=\"/album/Album.jsp?u=");
		image = l.Substring(l.IndexOf("http://cover.5q.com"), l.IndexOf("' alt=\"查看更多照片\"") - l.IndexOf("http://cover.5q.com"));
		w.WriteElementString("title", name);
		w.WriteElementString("link", link);
		w.WriteStartElement("image");
		w.WriteElementString("url", image);
		w.WriteEndElement();//image
		log(author);
	}
	private void Items()
	{
		while (true)
		{
			string l = GetLine("<li><a href=\"/diary/PsDiaryView.do?userId=");
			if (l == "") break;
			Item(l);
		}
	}
	private void Item(string line)
	{
		string title, link, l;
		l = line;
		link = "http://5q.com" + l.Substring(l.IndexOf("/diary/PsDiaryView.do?userId="), l.IndexOf("\">") - l.IndexOf("/diary/PsDiaryView.do?userId="));
		title = Server.HtmlDecode(l.Substring(l.IndexOf("\">") + 2, l.IndexOf("</a>") - l.IndexOf("\">") - 2));
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