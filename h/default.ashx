<%@ WebHandler Language="C#" Class="yoursunny.PersonalSite.Fun2007.hRedirect" %>

using System;
using System.Web;
using System.IO;
using System.Text;

namespace yoursunny.PersonalSite.Fun2007
{
    public class hRedirect : IHttpHandler
    {
        public void ProcessRequest(HttpContext c)
        {
            string r = (c.Request.UrlReferrer == null) ? "" : c.Request.UrlReferrer.AbsoluteUri;
            File.AppendAllText(c.Server.MapPath("hRedirect.txt"),
                DateTime.Now.ToString("MM-dd HH:mm:ss ") + c.Request.UserHostAddress + " " + r + "\r\n");
            c.Response.StatusCode = 301;
            c.Response.AddHeader("Location", "/");
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}