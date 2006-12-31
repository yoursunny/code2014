<%@ WebHandler Language="C#" Class="yoursunny.PersonalSite.HomePage.musicHandler" %>
using System;
using System.Web;
using System.IO;
namespace yoursunny.PersonalSite.HomePage
{
    public class musicHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext c)
        {
            string logLine = DateTime.Now.ToString() + "   " + c.Request.UserHostAddress + "   ";
            string Qstar = c.Request.QueryString["star"];
            if (Qstar != null && Qstar != String.Empty)
            {
                try
                {
                    int star = Int32.Parse(Qstar);
                    if (1 <= star && star <= 5)
                    {
                        File.AppendAllText(c.Server.MapPath("music.txt"), logLine + "∆¿∑÷" + star.ToString() + "\r\n");
                        c.Response.Write("<script type=\"text/javascript\">alert('∏Ë«˙∆¿∑÷“—æ≠Ã·Ωª£¨–ª–ªƒ„£°');window.close();</" + "script>");
                    }
                }
                catch { }
                return;
            }

            string Qstop = c.Request.QueryString["stop"];
            if (Qstop != null && Qstop != String.Empty)
            {
                File.AppendAllText(c.Server.MapPath("music.txt"), logLine + "Õ£÷π“Ù¿÷" + "\r\n");
                c.Response.WriteFile("music.off");
            }
        }
        public bool IsReusable { get { return true; } }
    }
}