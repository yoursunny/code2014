using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using System.IO;
using System.Net;
using System.Web;
using System.Web.Hosting;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// hosting ASP.NET applications
    /// </summary>
    [Plugin("AspNet", "AspNet", "yoursunny.P2008.hProxyN.AspNetConfigurationSection")]
    public class AspNet : IPlugin
    {
        /*
         * This module provides ASP.NET hosting. A preview with lots of bugs and poor performance
         *    can't login into web application
         *    stop responding after several dead requests
         *    ....
         * 
         * References:
         * http://www.microsoft.com/china/MSDN/library/WebServices/WebServices/ServiceStation.mspx?mfr=true
         * http://www.codeproject.com/KB/dotnet/usingaspruntime.aspx
         */
        AspNetConfigurationSection sec;
        Dictionary<AspNetApplicationElement, AspNetHost> hosts;
        public AspNet(PluginConfigurationSectionBase sec)
        {
            this.sec = (AspNetConfigurationSection)sec;
            hosts = new Dictionary<AspNetApplicationElement, AspNetHost>();
        }
        public void AddHooks(RequestListener listener)
        {
            listener.Handler += new EventHandler<HttpWorkerEventArgs>(Handler);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.Handler -= new EventHandler<HttpWorkerEventArgs>(Handler);
        }
        void Handler(object sender, HttpWorkerEventArgs e)
        {
            Uri u = e.Url;
            AspNetApplicationElement app = sec.Applications.FindApplication(u);
            if (app == null) return;
            AspNetHost host = GetHost(app);
            string method = e.Request.HttpMethod;
            NameValueCollection reqHeaders = e.Request.Headers;
            IPEndPoint remoteEP = e.Request.RemoteEndPoint;
            Stream reqBody = new MemoryStream();
            e.Request.InputStream.CopyTo(reqBody, e.Request.ContentLength64);
            reqBody.Position = 0;
            int status;
            NameValueCollection respHeaders;
            Stream respBody;
            host.Handler(method, u, reqHeaders, remoteEP, reqBody, out status, out respHeaders, out respBody);
            e.Response.StatusCode = status;
            foreach (string key in respHeaders.Keys)
            {
                switch (key)
                {
                    case "Content-Length":
                    case "Keep-Alive":
                    case "Transfer-Encoding":
                    case "WWW-Authenticate":
                    case "Content-Encoding":
                    case "Content-Type":
                    case "Last-Modified":
                    case "Server":
                        break;
                    default:
                        e.Response.AppendHeader(key, respHeaders[key]);
                        break;
                }
            }
            respBody.Position = 0;
            respBody.CopyTo(e.Response.OutputStream);
            e.Finish();
        }
        AspNetHost GetHost(AspNetApplicationElement app)
        {
            AspNetHost h;
            if (hosts.TryGetValue(app, out h)) return h;
            lock (hosts)//avoid creating duplicate AspNetHost
            {
                if (hosts.TryGetValue(app, out h)) return h;
                DirectoryInfo bin = new DirectoryInfo(Path.Combine(app.path, "bin"));
                if (!bin.Exists) bin.Create();
                System.Reflection.Assembly dll = System.Reflection.Assembly.GetExecutingAssembly();
                //ApplicationHost.CreateApplicationHost expects this assembly in either GAC or app.path\bin
                // so copy this dll into app.path\bin
                File.Copy(dll.Location, Path.Combine(bin.FullName, Path.GetFileName(dll.Location)), true);
                h = (AspNetHost)ApplicationHost.CreateApplicationHost(typeof(AspNetHost), app.vpath, app.path);
                hosts.Add(app, h);
            }
            return h;
        }
    }
}
