<%@ WebHandler Language="C#" Class="yoursunny.Fun2007.PUTtoFTP.h" %>

using System;
using System.Net;
using System.Web;

namespace yoursunny.Fun2007.PUTtoFTP
{
    public class h : IHttpHandler
    {
        public bool IsReusable { get { return true; } }
        public void ProcessRequest(HttpContext c)
        {
            c.Response.ContentType = "text/plain";
            try
            {
                c.Response.Write("yoursunny.Fun2007.PUTtoFTP.h\nProcessing your upload, please wait...\n");
                HttpPostedFile u = c.Request.Files["u"];
                if (u == null || u.ContentLength < 16 || u.ContentLength > 2 * 1024 * 1024)
                {
                    c.Response.Write("Upload field null, or ContentLength not between 16 bytes and 2MB\n");
                    return;
                }
                byte[] buffer = new byte[u.ContentLength];
                u.InputStream.Read(buffer, 0, u.ContentLength);
                WebClient w = new WebClient();
                w.Credentials = new NetworkCredential("sunnyboy", "870212");
                w.UploadData("ftp://202.120.2.2/upload/" + "PUTtoFTP_" + DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + c.Request.UserHostAddress + "_" + u.FileName, buffer);
                w.Dispose();
                c.Response.Write("Uploaded successfully to sunnyboy's public FTP\n");
            }
            catch
            {
                c.Response.Write("Upload failed\n");
            }
        }
    }
}