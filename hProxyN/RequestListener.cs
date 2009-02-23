using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Threading;
using System.Configuration;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// listens for HTTP request, and dispatch them to workers
    /// </summary>
    public partial class RequestListener
    {
        ListenerConfigurationSection sec;
        HttpListener listener;
        LogWriter logwriter;
        public HttpListener Listener { get { return listener; } }
        public RequestListener(hProxyNConfigurationSectionGroup cg)
        {
            sec = (ListenerConfigurationSection)cg.Sections["Listener"];
            listener = new HttpListener();
            foreach (ListenerEndPointElement ele in sec.EndPoints) Add(ele.EndPoint);
            LoggingConfigurationSection sec_logging = (LoggingConfigurationSection)cg.Sections["Logging"];
            this.logwriter = new LogWriter(sec_logging);
            PluginsConfigurationSection sec_plugins = (PluginsConfigurationSection)cg.Sections["Plugins"];
            LoadPlugins(sec_plugins, (PluginConfigurationSectionGroup)cg.SectionGroups["PluginConfiguration"]);
            if (this.ListenerOpen != null) this.ListenerOpen(this, new RequestListenerEventArgs());

            cbGotRequest = new AsyncCallback(GotRequest);
            cbProcessRequest = new WaitCallback(ProcessRequest);
            ThreadPool.SetMaxThreads(200, 200);
        }
        /// <summary>
        /// close the listener and free resources, aborting any existing connections
        /// </summary>
        public void Close()
        {
            Stop();
            if (this.ListenerClose != null) this.ListenerClose(this, new RequestListenerEventArgs());
            UnloadPlugins();
            listener.Abort();
            logwriter.Close();
        }
        HttpListenerPrefixCollection Prefixes { get { return listener.Prefixes; } }
        void Add(IPEndPoint ep) { Prefixes.Add(ep.httpPrefix()); }
        /// <summary>
        /// start the listener
        /// </summary>
        public void Start() {
            if (listener.IsListening) return;
            listener.Start();
            if (this.ListenerStart != null) this.ListenerStart(this, new RequestListenerEventArgs());
            listener.BeginGetContext(cbGotRequest, null);
        }
        /// <summary>
        /// stop the listener
        /// </summary>
        public void Stop() {
            if (!listener.IsListening) return;
            if (this.ListenerStop != null) this.ListenerStop(this, new RequestListenerEventArgs());
            listener.Stop();
        }
        AsyncCallback cbGotRequest;
        /// <summary>
        /// called back when a request arrives
        /// </summary>
        public void GotRequest(IAsyncResult async)
        {
            if (!listener.IsListening) return;
            if (this.ListenerGotRequest != null) this.ListenerGotRequest(this, new RequestListenerEventArgs());
            try
            {
                HttpListenerContext context = listener.EndGetContext(async);
                listener.BeginGetContext(cbGotRequest, null);
                //we have to record time_start here, HttpWorker.ctor should be very fast
                ThreadPool.QueueUserWorkItem(cbProcessRequest, new HttpWorker(this, logwriter, context));
            }
            catch { }
        }
        WaitCallback cbProcessRequest;
        /// <summary>
        /// called back from ThreadPool for a request
        /// </summary>
        /// <param name="state">a HttpWorker</param>
        public void ProcessRequest(object state)
        {
            HttpWorker worker = (HttpWorker)state;
            worker.ProcessRequest();
        }
    }
}
