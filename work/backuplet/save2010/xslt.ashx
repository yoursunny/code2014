<%@ WebHandler Language="C#" Class="yoursunny.P2010.GoDaddyWeb.backupletXSLTHandler" %>

using System;
using System.Web;
using System.Xml;
using System.Xml.Xsl;

namespace yoursunny.P2010.GoDaddyWeb
{
    public class backupletXSLTHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            string stylesheet = context.Request.QueryString["xsl"];
            string sid = context.Request.QueryString["sid"];
            if (stylesheet.Contains(".") || stylesheet.Contains("/") || stylesheet.Contains("\\")) return;
            
            XslCompiledTransform xsl = new XslCompiledTransform();
            xsl.Load(context.Server.MapPath("~/App_Data/backuplet_xslt/" + stylesheet + ".xsl"));
            xsl.Transform("http://yoursunny.com/work/backuplet/save/atom.php?sid=" + sid + "&ip=" + context.Request.UserHostAddress, new XmlTextWriter(context.Response.Output));
        }
        public bool IsReusable { get { return false; } }
    }
}