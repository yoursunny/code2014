<%@ Page Language="C#" %>
<%@ Import Namespace="System.Net" %>
<script runat="server">
	WebClient client;
	protected void Page_Load(Object sender, EventArgs e)
	{
		client = new WebClient();
		client.Credentials = new NetworkCredential("yoursunny", "hyxkur");
		Upload("/home.htm", "/yoursunny.htm");
	}
	private void Upload(string localFile, string remoteFile)
	{
		client.UploadFile("ftp://yoursunny.199.hezu1.com/web" + remoteFile, Server.MapPath(localFile));
	}
</script>