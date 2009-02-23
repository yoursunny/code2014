using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.IO;
using System.Configuration;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// provides a handler serving static files
    /// </summary>
    /// <remarks>causion: if configured incorrectly, source code of server-scripts may be leaked</remarks>
    [Plugin("StaticHosting", "StaticHosting", "yoursunny.P2008.hProxyN.EmptyPluginConfigurationSection")]
    [DependOnPlugin("yoursunny.P2008.hProxyN.WebHosting")]
    public class StaticHosting : IPlugin, IWebHostingScriptHandler
    {
        public StaticHosting(PluginConfigurationSectionBase sec)
        {
        }
        public void AddHooks(RequestListener listener)
        {
            listener.ListenerOpen += new EventHandler<RequestListenerEventArgs>(ListenerOpen);
            listener.ListenerClose += new EventHandler<RequestListenerEventArgs>(ListenerClose);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.ListenerOpen -= new EventHandler<RequestListenerEventArgs>(ListenerOpen);
            listener.ListenerClose -= new EventHandler<RequestListenerEventArgs>(ListenerClose);
        }
        public void ListenerOpen(object sender, RequestListenerEventArgs e)
        {
            RequestListener listener = (RequestListener)sender;
            listener.CallPluginMethod("yoursunny.P2008.hProxyN.WebHosting", "AddScriptHandler", new object[] { this });
        }
        public void ListenerClose(object sender, RequestListenerEventArgs e)
        {
            RequestListener listener = (RequestListener)sender;
            listener.CallPluginMethod("yoursunny.P2008.hProxyN.WebHosting", "RemoveScriptHandler", new object[] { this });
        }
        public string Name { get { return "static"; } }
        public void HandleWebHostingRequest(WebHosting sender, HttpWorkerEventArgs e, string file, System.Collections.Specialized.NameValueCollection param)
        {
            FileInfo fi = new FileInfo(file);
            if (!fi.Exists) e.Decline(404, "file not found");
            Stream fs = fi.OpenRead();
            e.Response.ContentLength64 = fs.Length;
            fs.CopyTo(e.Response.OutputStream, fs.Length);
            fs.Close();
            e.Finish();
        }
    }
}
