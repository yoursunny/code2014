using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;

namespace yoursunny.P2008.hProxyN
{
    public partial class RequestListener
    {
        /// <summary>
        /// fires when RequestListener opens
        /// </summary>
        public event EventHandler<RequestListenerEventArgs> ListenerOpen;
        /// <summary>
        /// fires when RequestListener starts
        /// </summary>
        public event EventHandler<RequestListenerEventArgs> ListenerStart;
        /// <summary>
        /// fires when RequestListener stops
        /// </summary>
        public event EventHandler<RequestListenerEventArgs> ListenerStop;
        /// <summary>
        /// fires when RequestListener closes
        /// </summary>
        public event EventHandler<RequestListenerEventArgs> ListenerClose;
        /// <summary>
        /// fires when RequestListener gets a new request, but didn't start processing it
        /// </summary>
        public event EventHandler<RequestListenerEventArgs> ListenerGotRequest;
        /// <summary>
        /// fires when HttpWorker start processing a request
        /// </summary>
        public event EventHandler<HttpWorkerEventArgs> WorkerStart;
        public void InvokeWorkerStart(HttpWorker worker)
        {
            if (WorkerStart != null) WorkerStart(this, new HttpWorkerEventArgs(worker));
        }
        /// <summary>
        /// fires when HttpWorker finish processing a request
        /// </summary>
        public event EventHandler<HttpWorkerEventArgs> WorkerFinish;
        public void InvokeWorkerFinish(HttpWorker worker)
        {
            if (WorkerFinish != null) WorkerFinish(this, new HttpWorkerEventArgs(worker));
        }
        /// <summary>
        /// HttpWorker gives a chance for plugins to translate the url
        /// </summary>
        public event EventHandler<HttpWorkerEventArgs> TranslateUrl;
        public void InvokeTranslateUrl(HttpWorker worker)
        {
            if (TranslateUrl != null) TranslateUrl(this, new HttpWorkerEventArgs(worker));
        }
        /// <summary>
        /// HttpWorker gives a chance for plugins to perform authentication
        /// </summary>
        public event EventHandler<HttpWorkerEventArgs> Authentication;
        public void InvokeAuthentication(HttpWorker worker)
        {
            if (Authentication != null) Authentication(this, new HttpWorkerEventArgs(worker));
        }
        /// <summary>
        /// HttpWorker gives a chance for plugins to perform access-control
        /// </summary>
        public event EventHandler<HttpWorkerEventArgs> AccessControl;
        public void InvokeAccessControl(HttpWorker worker)
        {
            if (AccessControl != null) AccessControl(this, new HttpWorkerEventArgs(worker));
        }
        /// <summary>
        /// HttpWorker gives a chance for plugins to prepare
        /// </summary>
        public event EventHandler<HttpWorkerEventArgs> Prepare;
        public void InvokePrepare(HttpWorker worker)
        {
            if (Prepare != null) Prepare(this, new HttpWorkerEventArgs(worker));
        }
        /// <summary>
        /// HttpWorker gives a chance for plugins to handle the request
        /// </summary>
        public event EventHandler<HttpWorkerEventArgs> Handler;
        public void InvokeHandler(HttpWorker worker)
        {
            if (Handler != null) Handler(this, new HttpWorkerEventArgs(worker));
        }
        /*
        private List<EventHandler<HttpWorkerHandlerEventArgs>> handlerList;
        private List<EventHandler<HttpWorkerHandlerEventArgs>> HandlerList
        {
            get
            {

                if (handlerList == null) handlerList = new List<EventHandler<HttpWorkerHandlerEventArgs>>();
                return handlerList;
            }
        }
        public event EventHandler<HttpWorkerHandlerEventArgs> Handler
        {
            add { HandlerList.Add(value); }
            remove { HandlerList.Remove(value); }
        }
        public void CallHandler(HttpWorker worker)
        {
            //we need to invoke Handlers one-by-one, and stop as soon as a Handler finish or decline the request
            foreach (EventHandler<HttpWorkerHandlerEventArgs> handler in HandlerList)
            {
                HttpWorkerHandlerEventArgs e = new HttpWorkerEventArgs(worker);
                handler(listener, e);
            }
        }*/
    }
    /// <summary>
    /// provides information about RequestListener
    /// </summary>
    public class RequestListenerEventArgs : EventArgs
    {
    }
    /// <summary>
    /// provides information about HttpWorker
    /// </summary>
    public class HttpWorkerEventArgs : EventArgs
    {
        public HttpWorkerEventArgs(HttpWorker worker)
        {
            this.worker = worker;
        }
        public HttpWorker worker { get; private set; }
        /// <summary>
        /// retrieve data from PluginStorage
        /// </summary>
        public object RetrieveData(Guid key)
        {
            object v;
            if (worker.PluginStorage.TryGetValue(key, out v)) return v;
            else return null;
        }
        /// <summary>
        /// store data to PluginStorage
        /// </summary>
        public void StoreData(Guid key, object value)
        {
            worker.PluginStorage[key] = value;
        }
        /// <summary>
        /// gets the LogEntry associates with this request
        /// </summary>
        public LogEntry log { get { return worker.log; } }
        /// <summary>
        /// gets or sets the url of this request
        /// </summary>
        public Uri Url { get { return worker.Url; } set { worker.Url = value; } }
        /// <summary>
        /// gets the HttpListenerRequest
        /// </summary>
        public HttpListenerRequest Request { get { return worker.Request; } }
        /// <summary>
        /// gets the HttpListenerResponse
        /// </summary>
        public HttpListenerResponse Response { get { return worker.Response; } }
        /// <summary>
        /// gets or sets the username
        /// </summary>
        public string AuthenticatedUser { get { return worker.AuthenticatedUser; } set { worker.AuthenticatedUser = value; } }
        /// <summary>
        /// give user-agent an error message, and stop the request
        /// </summary>
        public void Decline(int status, string message)
        {
            worker.ReturnError(status, message);
            Finish();
        }
        /// <summary>
        /// stop the request
        /// </summary>
        public void Finish()
        {
            worker.RequestFinished();
        }
    }
}
