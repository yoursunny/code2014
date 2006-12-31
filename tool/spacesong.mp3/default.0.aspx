<@ Page Language="C#" %>
<script language="C#" runat="server">
	private const int count=3;
	protected void Page_Load(Object sender, EventArgs E)
	{
		Random rand = new Random();
		Response.Redirect(rand.Next(1,count+1).ToString()+".mp3");
	}
</script>