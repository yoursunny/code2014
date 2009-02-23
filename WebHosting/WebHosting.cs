using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Collections;
using System.Collections.Specialized;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// provides Web hosting functionality
    /// </summary>
    [Plugin("WebHosting", "WebHosting", "yoursunny.P2008.hProxyN.WebHostingConfigurationSection")]
    public class WebHosting : IPlugin
    {
        WebHostingConfigurationSection sec;
        Hashtable ScriptMap;
        public WebHosting(PluginConfigurationSectionBase sec)
        {
            this.sec = (WebHostingConfigurationSection)sec;
            ScriptMap = new Hashtable();
        }
        public void AddHooks(RequestListener listener)
        {
            listener.Handler += new EventHandler<HttpWorkerEventArgs>(Handler);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.Handler -= new EventHandler<HttpWorkerEventArgs>(Handler);
        }
        [CallablePluginMethod]
        public void AddScriptHandler(IWebHostingScriptHandler H)
        {
            ScriptMap[H.Name] = H;
        }
        [CallablePluginMethod]
        public void RemoveScriptHandler(IWebHostingScriptHandler H)
        {
            ScriptMap.Remove(H.Name);
        }
        public bool IsListeningTo(IPEndPoint ep)
        {
            return sec.EndPoints.ListeningTo(ep);
        }
        /// <summary>
        /// parse param in conf file
        /// </summary>
        public NameValueCollection ParseParam(string param)
        {
            const string TOKEN1 = "_ParseParam_480FF62F-AAE2-4f51-8F29-3121BBADB07D_TOKEN1_";// =
            const string TOKEN2 = "_ParseParam_CC598A46-67B1-4ea1-B07F-A3C0013DB99A_TOKEN2_";// ;
            NameValueCollection p = new NameValueCollection();
            foreach (string pa in (from pp in param.Replace("==", TOKEN1).Replace(";;", TOKEN2).Split(';') select pp))
            {
                string[] paa = pa.Split(new char[] { '=' }, 2);
                if (paa.Length == 2) p.Add(paa[0], paa[1].Replace(TOKEN1, "=").Replace(TOKEN2, ";"));
            }
            return p;
        }
        public void Handler(object sender, HttpWorkerEventArgs e)
        {
            if (!IsListeningTo(e.Request.LocalEndPoint)) return;
            string handler, file, param;
            FindHandler(e.Request.LocalEndPoint, e.Url.Host, "/" + e.Url.GetComponents(UriComponents.Path, UriFormat.SafeUnescaped), out handler, out file, out param);
            if (string.IsNullOrEmpty(handler)) e.Decline(404, "url not accepted");
            Call(handler, file, ParseParam(param), e);
        }
        public void FindHandler(IPEndPoint ep, string hostname, string path, out string handler, out string file, out string param)
        {
            sec.FindHandler(ep, hostname, path, out handler, out file, out param);
        }
        /// <summary>
        /// call a IWebHostingScriptHandler to serve the request using a specified file
        /// </summary>
        public void Call(string handler, string file, NameValueCollection param, HttpWorkerEventArgs e)
        {
            IWebHostingScriptHandler H = (IWebHostingScriptHandler)ScriptMap[handler];
            if (H == null) e.Decline(500, "script handler not found");
            H.HandleWebHostingRequest(this, e, file, param);
        }
    }
    /// <summary>
    /// represents a script handler
    /// </summary>
    public interface IWebHostingScriptHandler
    {
        /// <summary>
        /// gets the name of this handler
        /// </summary>
        string Name { get; }
        /// <summary>
        /// handle a request
        /// </summary>
        /// <remarks>this must be thread-safe</remarks>
        void HandleWebHostingRequest(WebHosting sender, HttpWorkerEventArgs e, string file, NameValueCollection param);
    }
}
