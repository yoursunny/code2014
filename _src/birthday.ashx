<%@ WebHandler Language="C#" Class="yoursunny.Fun2007.birthday" %>

using System;
using System.Web;
using System.IO;

namespace yoursunny.Fun2007
{
    public class birthday : IHttpHandler
    {
        public void ProcessRequest(HttpContext c)
        {
            if (c.Request.RequestType == "POST")
            {
                File.AppendAllText(c.Server.MapPath("birthday.txt"),
                    DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss ")
                    + c.Request.UserHostAddress + "|"
                    + c.Request.Form["n"].Replace("\r", "").Replace("\n", "").Replace("|", "")
                    + "|" + c.Request.Form["m"].Replace("\r", "").Replace("\n", "").Replace("|", "") + "\r\n");
                c.Response.Write("<script type='text/javascript'>alert('祝福已保存，衷心感谢');</" + "script>");
            }
            else
            {
                c.Response.ContentType = "text/javascript";
                char[] split = new char[] { '|' };
                string[] w = File.ReadAllLines(c.Server.MapPath("birthday.txt"));
                c.Response.ContentType = "text/javascript";
                c.Response.Write("document.getElementById('birthday_p').innerHTML='<dl>");
                for (int i = 0; i < w.Length; ++i)
                {
                    string[] l = w[i].Split(split, 3);
                    w[i] = "<dt title=\"" + text2js(c, l[1]) + "\">" + text2js(c, maxlen(l[1], 6)) + "</dt><dd title=\"" + text2js(c, l[2]) + "\">" + text2js(c, maxlen(l[2], 7)) + "</dd>";
                }
                int count = 0;
                for (int i = w.Length - 1; i >= 0; --i)
                {
                    c.Response.Write(w[i]);
                    ++count;
                    if (count > 5) break;
                }
                c.Response.Write("</dl>';");
                c.Response.Write("document.getElementById('birthday_n').innerHTML='birthday(" + w.Length.ToString() + "条祝福)';");
            }
        }
        private string maxlen(string s, int m)
        {
            return (s.Length > m) ? s.Substring(0, m) : s;
        }
        private string text2js(HttpContext c, string s)
        {
            return c.Server.HtmlEncode(s).Replace(@"\", @"\\").Replace("'", @"\'");
        }
        public bool IsReusable { get { return false; } }
    }
}