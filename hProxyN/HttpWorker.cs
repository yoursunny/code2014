using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Collections;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// a worker class to handle an HTTP request
    /// </summary>
    /// <remarks>an instance can't be used across multiple requests at the same time</remarks>
    public class HttpWorker
    {
        /// <summary>
        /// part of HTTP 'Server:' header
        /// </summary>
        public const string ServerHeader = "yoursunny-hProxyN";
        public RequestListener listener { get; private set; }
        public LogWriter logwriter { get; private set; }
        public LogEntry log { get; private set; }
        public Uri Url { get; set; }
        public HttpListenerContext Context { get; private set; }
        public HttpListenerRequest Request { get; private set; }
        public HttpListenerResponse Response { get; private set; }
        public string AuthenticatedUser { get; set; }
        /// <summary>
        /// a place for plugins to store data associated with this request
        /// </summary>
        public Dictionary<Guid, object> PluginStorage { get; private set; }
        public HttpWorker(RequestListener listener, LogWriter logwriter, HttpListenerContext context)
        {
            //initialize members of this instance
            this.listener = listener;
            this.logwriter = logwriter;
            this.Context = context;
            this.Request = context.Request;
            this.Response = context.Response;
            this.PluginStorage = new Dictionary<Guid, object>();
            //start timer
            log = new LogEntry();
            StartTimer();
        }
        /// <summary>
        /// process the request
        /// </summary>
        public void ProcessRequest()
        {
            listener.InvokeWorkerStart(this);
            Response.Headers["Server"] = ServerHeader;
            try
            {
                //#### parsing phase
                BuildUrl();
                CollectRequestLog();
                listener.InvokeTranslateUrl(this);
                //#### security phase
                listener.InvokeAuthentication(this);
                listener.InvokeAccessControl(this);
                //#### preparation phase
                listener.InvokePrepare(this);
                //#### handler phase
                listener.InvokeHandler(this);
                //at least one handler should call e.Finish(), then HttpWorker+RequestFinishedException is thrown
                //if a request reaches here, then no handler accepted it
                ReturnError(501, "no handler accepted this request");
            }
            catch (RequestFinishedException) { }
            //#### close response and free resources
            CollectResponseLog();
            try { Response.Close(); }
            catch (HttpListenerException) { }
            catch (InvalidOperationException) { }
            //#### write to log
            StopTimer();
            logwriter.Write(log);
            listener.InvokeWorkerFinish(this);
        }
        /// <summary>
        /// record start time
        /// </summary>
        protected void StartTimer()
        {
            log.time_start = DateTime.UtcNow;
        }
        /// <summary>
        /// record stop time
        /// </summary>
        protected void StopTimer()
        {
            log.time_stop = DateTime.UtcNow;
        }
        /// <summary>
        /// build the actual url
        /// </summary>
        protected void BuildUrl()
        {
            //Request.Url may be http://proxyurl/rawpathandquery
            //Request.Url.PathAndQuery may be decoded, which breaks Google Reader
            Uri rawUrl = new Uri(Request.RawUrl, UriKind.RelativeOrAbsolute);
            Url = rawUrl.IsAbsoluteUri ? rawUrl : new Uri(new Uri("http://" + Request.Headers["Host"]), Request.RawUrl);
        }
        /// <summary>
        /// show error message to remote user
        /// </summary>
        public void ReturnError(int status, string message)
        {
            try
            {
                Response.StatusCode = status;
                if (Request.HttpMethod != "HEAD")
                {
                    Response.ContentType = "text/plain; charset=utf-8";
                    Response.OutputStream.Write("[hProxyN] " + message);
                }
            }
            catch { }
        }
        /// <summary>
        /// indicates the request processing is finished and remaining steps should be skipped
        /// </summary>
        public void RequestFinished() { throw new RequestFinishedException(); }
        private class RequestFinishedException : Exception { }
        /// <summary>
        /// collect information from request for logging
        /// </summary>
        protected void CollectRequestLog()
        {
            log.client_ep = Request.RemoteEndPoint;
            log.server_ep = Request.LocalEndPoint;
            //impossible to determine log.received_bytes because HTTPAPI already parsed the request
            log.method = Request.HttpMethod;
            log.version = Request.ProtocolVersion;
            log.url = Url;
            log.user_agent = Request.UserAgent;
            log.cookie = Request.Headers["Cookie"];
            log.referer = Request.Headers["Referer"];
            log.request_content_type = LogEntry.GetContentType(Request.ContentType);
        }
        /// <summary>
        /// collect information from response for logging
        /// </summary>
        protected void CollectResponseLog()
        {
            //impossible to determine log.sent_bytes because HTTPAPI will build the request
            log.username = AuthenticatedUser;
            log.status = Response.StatusCode;
            log.response_content_type = LogEntry.GetContentType(Response.ContentType);
        }
    }
}
