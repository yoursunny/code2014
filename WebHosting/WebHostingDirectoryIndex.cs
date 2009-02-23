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
    /// provides a handler serving 'dirname/' like 'dirname/index.htm'(or other names)
    /// </summary>
    [Plugin("WebHostingDirectoryIndex", "WebHostingDirectoryIndex", "yoursunny.P2008.hProxyN.EmptyPluginConfigurationSection")]
    [DependOnPlugin("yoursunny.P2008.hProxyN.WebHosting")]
    public class WebHostingDirectoryIndex : IPlugin, IWebHostingScriptHandler
    {
        public WebHostingDirectoryIndex(PluginConfigurationSectionBase sec)
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
        public string Name { get { return "DirectoryIndex"; } }
        /// <param name="param">
        /// index => index-file-name|handler|handler-param , ...
        /// </param>
        public void HandleWebHostingRequest(WebHosting sender, HttpWorkerEventArgs e, string file, System.Collections.Specialized.NameValueCollection param)
        {
            string dir = file.Replace('/', Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar;
            if (!Directory.Exists(dir)) e.Decline(404, "directory not exist");
            string index = param["index"];
            if (string.IsNullOrEmpty(index)) e.Decline(403, "directory index not found");
            string[] indexes = index.Split(',');
            foreach (string idx in indexes)
            {
                string[] a = idx.Split('|');
                if (a.Length != 3) continue;
                string f = Path.Combine(dir, a[0]);
                if (File.Exists(f))
                {
                    sender.Call(a[1], f, sender.ParseParam(a[2]), e);
                    return;
                }
            }
        }
    }
}
