using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Xml;
using System.Xml.Xsl;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// converting text/vnd.wap.wml pages into html
    /// </summary>
    [Plugin("WmlToHtml", "WmlToHtml", "yoursunny.P2008.hProxyN.EmptyPluginConfigurationSection")]
    public class WmlToHtml : HttpProxyExtension, IPlugin
    {
        const string resource_js = "/_hProxyN_/70146D38-CCC9-4f72-AEE7-3CA1D0181918/wml.js";
        const string resource_css = "/_hProxyN_/70146D38-CCC9-4f72-AEE7-3CA1D0181918/wml.css";
        System.Reflection.Assembly thisDLL;
        const string embed_xsl = "yoursunny.P2008.hProxyN.wml.xsl";
        const string embed_js = "yoursunny.P2008.hProxyN.wml.js";
        const string embed_css = "yoursunny.P2008.hProxyN.wml.css";
        Guid PluginStorage_WmlResponse;
        public WmlToHtml(PluginConfigurationSectionBase sec)
        {
            thisDLL = System.Reflection.Assembly.GetExecutingAssembly();
            PluginStorage_WmlResponse = new Guid("{DFB591CB-5B1D-46ee-AC9C-667DC9B41D35}");
        }
        public void AddHooks(RequestListener listener)
        {
            listener.ListenerStart += new EventHandler<RequestListenerEventArgs>(RegisterExtension);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.ListenerStart -= new EventHandler<RequestListenerEventArgs>(RegisterExtension);
        }
        public override void BeforeRequest(HttpProxyContext context)
        {
            string url_path = context.Url.AbsolutePath;
            if (url_path == resource_js || url_path == resource_css)
            {
                context.e.worker.listener.CallPluginMethod("yoursunny.P2008.hProxyN.HttpProxy", "CancelInboundRequest", new object[] { context });
            }
        }
        public override void BeforeResponse(HttpProxyContext context)
        {
            string url_path = context.Url.AbsolutePath;
            if (url_path == resource_js)
            {
                context.Response.ContentType = "text/javascript";
                context.Response.Headers["Cache-Control"] = "max-age=86400";
                context.e.StoreData(PluginStorage_WmlResponse, "js");
            }
            else if (url_path == resource_css)
            {
                context.Response.ContentType = "text/css";
                context.Response.Headers["Cache-Control"] = "max-age=86400";
                context.e.StoreData(PluginStorage_WmlResponse, "css");
            }
            else if (!context.InboundRequestCanceled && context.resp.ContentType.Contains("text/vnd.wap.wml"))
            {
                context.Response.ContentType = "text/html";
                context.e.StoreData(PluginStorage_WmlResponse, "wml");
            }
        }
        public override Stream FilterResponseIn(HttpProxyContext context, Stream s)
        {
            switch (context.e.RetrieveData(PluginStorage_WmlResponse) as string)
            {
                case null:
                    return s;
                case "js":
                    return thisDLL.GetManifestResourceStream(embed_js);
                case "css":
                    return thisDLL.GetManifestResourceStream(embed_css);
                case "wml":
                    {
                        Stream html = MakeXsltStream(s);
                        if (html == null) context.e.Decline(500, "error converting WML page");
                        return html;
                    }
                default:
                    return s;
            }
        }
        XslCompiledTransform xslt;
        public Stream MakeXsltStream(Stream wml)
        {
            try
            {
                if (xslt == null)
                {
                    xslt = LoadXSLT();
                }
                //wap.msn.cn may output extra linefeeds before <?xml , so trim it
                string ws = new StreamReader(wml).ReadToEnd().Trim();
                ws = System.Text.RegularExpressions.Regex.Replace(ws, "<!DOCTYPE[^>]*>", "");
                XmlDocument wdoc = new XmlDocument();
                //preserve whitespace, or http://wap.msn.cn/Product.aspx?supplierId=887&c=&t=&m= may appear strange
                // reference: http://msdn.microsoft.com/en-us/library/aa468566.aspx
                wdoc.PreserveWhitespace = true;
                wdoc.LoadXml(ws);
                MemoryStream ms = new MemoryStream();
                XmlWriter hw = XmlWriter.Create(ms);
                xslt.Transform(wdoc, hw);
                ms.Position = 0;
                return ms;
            }
            catch
            {
                return null;
            }
        }
        public XslCompiledTransform LoadXSLT()
        {
            XslCompiledTransform xslt = new XslCompiledTransform();
            xslt.Load(XmlReader.Create(thisDLL.GetManifestResourceStream(embed_xsl)));
            return xslt;
        }
    }
}
