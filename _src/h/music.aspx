<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<script runat="server">
	protected void Page_Load(Object sender, EventArgs e)
	{
		string Qstar = Request.QueryString["star"];
		if (Qstar != null && Qstar != String.Empty)
		{
			try
			{
				int star = Int32.Parse(Qstar);
				if (1 <= star && star <= 5)
				{
					save("∆¿∑÷" + star.ToString());
					Response.Write("<script type=\"text/javascript\">alert('∏Ë«˙∆¿∑÷“—æ≠Ã·Ωª£¨–ª–ªƒ„£°');window.close();</" + "script>");
				}
			}
			catch { }
			return;
		}

		string Qstop = Request.QueryString["stop"];
		if (Qstop != null && Qstop != String.Empty)
		{
			save("Õ£÷π“Ù¿÷");
			Response.WriteFile("music.off");
		}
	}
	protected void save(string msg)
	{
		StreamWriter w = File.AppendText(Server.MapPath("music.txt"));
		w.WriteLine(DateTime.Now.ToString() + "   " + Request.UserHostAddress + "   " + msg);
		w.Flush(); w.Close();		
	}
</script>