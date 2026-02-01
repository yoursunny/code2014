<%@ WebHandler Language="C#" Class="yoursunny.PageGenerator.KeyGenHandler" %>

using System;
using System.Web;
using System.Text;

namespace yoursunny.PageGenerator
{
    public class KeyGenHandler : IHttpHandler
    {
        HttpContext c;
        public void ProcessRequest(HttpContext context)
        {
            c = context;
            c.Response.ContentType = "text/plain";
            W("----------------yoursunny PageGenerator 注册码生成器----------------");
            W("用法：");
            W("IP A段 keygen.ashx?A.20070228.59                 59.*.*.*");
            W("IP B段 keygen.ashx?B.20070228.59.78              59.78.*.*");
            W("IP C段 keygen.ashx?C.20070228.59.78.20           59.78.20.*");
            W("IP地址 keygen.ashx?I.20070228.59.78.20.24        59.78.20.24");
            W("域名   keygen.ashx?D.20070228.yoursunny          *.yoursunny.*");
            W("主机名 keygen.ashx?H.20070228.www.yoursunny.com  www.yoursunny.com");
            W("                 其中20070228为到期日；域名至少5位");
            W("--------------------------------------------------------------------");
            string q = c.Request.ServerVariables["QUERY_STRING"];
            if (!String.IsNullOrEmpty(q))
            {
                W("请求的注册码为");
                W(q + "|" + HashSN(q));
            }
        }
        private void W(string m)
        {
            c.Response.Write(m + "\r\n");
        }
        private const string SecretKey = "yoursunnyPageGeneratorSecret15900941215";
        private string HashSN(string s)
        {
            System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();
            UnicodeEncoding enc = new UnicodeEncoding();
            Byte[] bytes = md5.ComputeHash(enc.GetBytes(SecretKey + s + s.Length.ToString()));
            StringBuilder b = new StringBuilder();
            for (int i = 0; i < bytes.Length; ++i) b.Insert(0, bytes[(i * 3) % 16].ToString("x"));
            return b.ToString();
        }
        public bool IsReusable { get { return false; } }
    }
}