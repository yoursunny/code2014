using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Configuration;
using System.IO;
using System.Collections.Specialized;
using System.IO.Compression;
using System.Reflection;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// a plugin serving HTTP proxy
    /// </summary>
    [Plugin("HttpProxy", "HttpProxy", "yoursunny.P2008.hProxyN.HttpProxyConfigurationSection")]
    public partial class HttpProxy : IPlugin
    {
        HttpProxyConfigurationSection sec;
        IWebProxy InboundGateway;
        Guid PluginStorage_IgnoreRequest;
        FieldInfo field_ServicePoint_ProxyServicePoint;
        public HttpProxy(PluginConfigurationSectionBase sec)
        {
            this.sec = (HttpProxyConfigurationSection)sec;
            ServicePointManager.DefaultConnectionLimit = 50;
            ServicePointManager.EnableDnsRoundRobin = true;
            InboundGateway = this.sec.GetInboundGateway();
            extensions = new List<IHttpProxyExtension>();
            PluginStorage_IgnoreRequest = new Guid("{6F526784-09AA-458f-A3DE-3FF7A84AE333}");
            field_ServicePoint_ProxyServicePoint = (typeof(ServicePoint)).GetField("m_ProxyServicePoint", BindingFlags.NonPublic | BindingFlags.Instance);
            InitCollectServerEndPoint();
        }
        public void AddHooks(RequestListener listener)
        {
            listener.AccessControl += new EventHandler<HttpWorkerEventArgs>(AccessControl);
            listener.Handler += new EventHandler<HttpWorkerEventArgs>(Handler);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.AccessControl -= new EventHandler<HttpWorkerEventArgs>(AccessControl);
            listener.Handler -= new EventHandler<HttpWorkerEventArgs>(Handler);
        }
        /// <summary>
        /// determines whether proxy should serve this request
        /// </summary>
        [CallablePluginMethod]
        public bool IsListeningTo(HttpListenerRequest Request)
        {
            return sec.EndPoints.ListeningTo(Request.LocalEndPoint);
        }
        /// <summary>
        /// make HttpProxy ignore this request, called by another plugin before Handler phase
        /// </summary>
        [CallablePluginMethod]
        public void IgnoreRequest(HttpWorkerEventArgs e)
        {
            e.StoreData(PluginStorage_IgnoreRequest, true);
        }
        void AccessControl(object sender, HttpWorkerEventArgs e)
        {
            if (!IsListeningTo(e.Request)) return;
            if (sec.DenyLocal && e.Request.RemoteEndPoint.Address.Equals(e.Request.LocalEndPoint.Address))
                e.Decline(403, "DenyLocal is set");
        }
        public void Handler(object sender, HttpWorkerEventArgs e)
        {
            if (e.RetrieveData(PluginStorage_IgnoreRequest) != null) return;
            HttpProxyContext context = new HttpProxyContext(); context.e = e;
            BuildRequest(context);
            CollectServerEndPoint1(context);
            CallBeforeRequest(context);
            CopyRequestEntity(context);
            if (!context.InboundRequestCanceled)
            {
                context.InboundRequestStarted = true;
                WebException inbound_failure = null;
                try { context.resp = (HttpWebResponse)context.req.GetResponse(); }
                catch (WebException ex) { context.resp = (HttpWebResponse)ex.Response; inbound_failure = ex; }
                CollectServerEndPoint2(context);
                if (context.resp == null) ReportInboundFailure(inbound_failure, context);
            }
            CallAfterRequest(context);
            BuildResponse(context);
            CallBeforeResponse(context);
            CopyResponseEntity(context);
            CallAfterResponse(context);
            if (!context.InboundRequestCanceled) context.resp.Close();
            e.Finish();
        }
        /// <summary>
        /// build a HttpWebRequest, set headers
        /// </summary>
        /// <remarks>Content-Length is not set</remarks>
        private void BuildRequest(HttpProxyContext context)
        {
            HttpListenerRequest Request = context.Request;
            HttpWebRequest req = context.req = (HttpWebRequest)WebRequest.Create(context.Url);
            req.AllowAutoRedirect = false;
            req.Method = Request.HttpMethod;
            req.CookieContainer = new CookieContainer();
            foreach (Cookie cookie in Request.Cookies)
                if (string.IsNullOrEmpty(cookie.Domain)) cookie.Domain = context.Url.Host;
            req.CookieContainer.Add(Request.Cookies);
            for (int j = 0; j < Request.Headers.Count; ++j)
            {
                string key = Request.Headers.GetKey(j);
                string[] values = Request.Headers.GetValues(j);
                foreach (string value in values)
                {
                    switch (key)
                    {
                        case "Accept":
                            req.Accept = value;
                            break;
                        case "If-Modified-Since":
                            //some browser may send 'If-Modified-Since: 0' which is against HTTP/1.1
                            try { req.IfModifiedSince = DateTime.Parse(value); }
                            catch (FormatException) { }
                            break;
                        case "Range":
                            {
                                if (value.StartsWith("bytes="))
                                {
                                    string[] byte_range_set = value.Substring(6).Split(',');
                                    foreach (string byte_range_spec in byte_range_set)
                                    {
                                        int hyphen = byte_range_spec.IndexOf('-');
                                        if (hyphen < 0) { }//invalid, response with 200
                                        if (hyphen > 0)//byte-range-spec
                                        {
                                            //Exception: value too big for Int32; download from http://jsmcc.onlinedown.net/soft/2926.htm ; cannot repro
                                            int first_byte_pos = int.Parse(byte_range_spec.Remove(hyphen));
                                            if (++hyphen == byte_range_spec.Length) req.AddRange(first_byte_pos);
                                            else
                                            {
                                                int last_byte_pos = int.Parse(byte_range_spec.Substring(hyphen + 1));
                                                req.AddRange(first_byte_pos, last_byte_pos);
                                            }
                                        }
                                        else//suffix-byte-range-spec
                                        {
                                            int suffix_length = int.Parse(byte_range_spec);
                                            req.AddRange(suffix_length);
                                        }
                                    }
                                }
                            }
                            break;
                        case "Referer":
                            req.Referer = value;
                            break;
                        case "Content-Length":
                        case "Content-Type":
                        case "User-Agent":
                        case "Connection":
                        case "Date":
                        case "Host":
                        case "Transfer-Encoding":
                        case "Proxy-Connection":
                        case "Cookie":
                        case "Expect":
                        case "Proxy-Authorization":
                            break;
                        default:
                            req.Headers.Add(key, value);
                            break;
                    }
                }
            }
            //req.ContentLength = Request.ContentLength64;
            req.ContentType = Request.ContentType;
            req.UserAgent = Request.UserAgent;
            if (sec.addXForwardedFor) req.Headers["X-Forwarded-For"] = Request.RemoteEndPoint.Address.ToString();
            req.Proxy = InboundGateway;
            if (InboundGateway != null && InboundGateway is IInboundGateway)
            {
                IInboundGateway InboundGateway_ = InboundGateway as IInboundGateway;
                if (InboundGateway_.UseDirectRequestLine)
                    field_ServicePoint_ProxyServicePoint.SetValue(req.ServicePoint, false);
            }
            req.Timeout = sec.Timeout;
        }
        /// <summary>
        /// copy entity from HttpListenerRequest to HttpWebRequest
        /// </summary>
        /// <remarks>set Content-Length</remarks>
        private void CopyRequestEntity(HttpProxyContext context)
        {
            if (context.Request.HasEntityBody)
            {
                Stream sin_orig, sin, sout;
                sin_orig = context.Request.InputStream;
                sin = CallFilterRequestIn(context, sin_orig);
                if (context.InboundRequestCanceled)
                {
                    if (sin_orig != sin) sin.CopyTo(Stream.Null);
                    return;
                }
                StreamCopyResult r = null;
                long ContentLength = context.Request.ContentLength64;
                if (ContentLength < 0 || sin_orig != sin)
                {
                    //Content-Length is required by many servers, so we must determine it
                    MemoryStream ms = new MemoryStream();
                    r = sin.CopyTo(ms);
                    if (!r.success)
                    {
                        if (r.exception is WebException) ReportInboundFailure(r.exception as WebException, context);
                        else context.e.Decline(408, "request timed out");
                    }
                    ContentLength = ms.Length;
                    ms.Seek(0, SeekOrigin.Begin);
                    sin = ms;
                }
                context.req.ContentLength = ContentLength;
                context.InboundRequestStarted = true;
                try { sout = context.req.GetRequestStream(); }
                catch (WebException ex) { ReportInboundFailure(ex, context); return; };
                r = sin.CopyTo(sout, context.Request.ContentLength64);
                try { sin.Close(); }
                catch { }
                try { sout.Close(); }
                catch { }
                if (!r.success)
                {
                    if (r.exception is WebException) ReportInboundFailure(r.exception as WebException, context);
                    else context.e.Decline(408, "request timed out");
                }
            }
            else context.req.ContentLength = 0;
        }
        /// <summary>
        /// report a WebException friendly to the user-agent, and stop request
        /// </summary>
        private void ReportInboundFailure(WebException ex, HttpProxyContext context)
        {
            HttpWorkerEventArgs e = context.e;
            int status; string message;
            if (ex == null)
            {
                status = 502; message = "proxy error occured";
            }
            else
            {
                switch (ex.Status)
                {
                    case WebExceptionStatus.NameResolutionFailure:
                        status = 504; message = "DNS lookup failed for " + e.Url.Host;
                        break;
                    case WebExceptionStatus.ConnectFailure:
                        status = 504; message = "can't connect to " + e.Url.Host;
                        break;
                    case WebExceptionStatus.ReceiveFailure:
                        status = 502; message = "a complete response was not received from " + e.Url.Host;
                        break;
                    case WebExceptionStatus.SendFailure:
                        status = 504; message = "a complete request could not be sent to " + e.Url.Host;
                        break;
                    case WebExceptionStatus.ConnectionClosed:
                        status = 504; message = "the connection to " + e.Url.Host + " was prematurely closed";
                        break;
                    case WebExceptionStatus.Timeout:
                        status = 504; message = "no response was received from " + e.Url.Host + " during the time-out period of " + sec.Timeout.ToString() + "ms";
                        break;
                    default:
                        status = 502; message = "proxy error occured";
                        break;
                }
            }
            //unable to login to http://www.alimama.com/membersvc/member/login.htm
            //  when a header spans across two TCP headers, HttpWebResponse may not correctly parse it
            //  if packet#1 ends with 0x0D and packet#2 starts with 0x0A, WebExceptionStatus.ServerProtocolViolation
            //  otherwise, an invalid header name appears
            //solution: add this to configuration file, but still don't work sometimes
            //  <system.net><settings><httpWebRequest useUnsafeHeaderParsing="true"/></settings></system.net>
            //I decide not to solve this problem since I think it's a bug of .Net Framework
            e.Decline(status, message);
        }
        /// <summary>
        /// set headers in HttpListenerResponse
        /// </summary>
        /// <remarks>Content-Length is not set</remarks>
        private void BuildResponse(HttpProxyContext context)
        {
            if (context.InboundRequestCanceled) return;
            HttpWebResponse resp = context.resp;
            HttpListenerResponse Response = context.Response;
            Response.StatusCode = (int)resp.StatusCode;
            for (int j = 0; j < resp.Headers.Count; ++j)
            {
                string key = resp.Headers.GetKey(j);
                //we can't use Headers[key], there may be multiple headers with the same key
                string[] values = resp.Headers.GetValues(j);
                foreach (string value in values)
                {
                    switch (key)
                    {
                        case "Content-Length":
                        case "Keep-Alive":
                        case "Transfer-Encoding":
                        case "WWW-Authenticate":
                        //due to limitations of HttpListener, it's difficult to implement WWW-Authenticate without send the inbound request twice
                        //maybe we can use a form to collect credentials
                        case "Content-Encoding":
                        case "Content-Type":
                        case "Last-Modified":
                        case "Server":
                            break;
                        default:
                            Response.AppendHeader(key, value);
                            break;
                    }
                }
            }
            //resp.Cookies contains only the first cookie, which breaks login of zhidao.baidu.com
            Response.Headers["Content-Encoding"] = resp.ContentEncoding;
            Response.ContentType = resp.ContentType;
            //when hitting http://asset1.jiwai.de/system/user/profile_image/126046/54079/thumb48s/http_imgload.jpg
            // server returns Last-Modified: Mon, 27 Oct 2008 23:43:03 CST , but only GMT is allowed
            try { Response.Headers["Last-Modified"] = resp.LastModified.ToString("R"); }
            catch (ProtocolViolationException) { }
            Response.Headers["Server"] = resp.Server + " " + HttpWorker.ServerHeader;
            //if (resp.ContentLength >= 0) Response.ContentLength64 = resp.ContentLength;
        }
        /// <summary>
        /// copy entity from HttpWebResponse to HttpListenerResponse
        /// </summary>
        /// <remarks>set Content-Length</remarks>
        private void CopyResponseEntity(HttpProxyContext context)
        {
            switch (context.Request.HttpMethod)
            {
                case "HEAD":
                    //MUST NOT include an entity with these verbs
                    return;
            }
            HttpWebResponse resp = context.resp;
            if (!context.InboundRequestCanceled)
            {
                switch ((int)resp.StatusCode)
                {
                    case 204:
                    case 205:
                    case 304:
                        //MUST NOT include an entity with these status codes
                        return;
                }
            }
            Stream sin_orig, sin, sout_orig, sout;
            if (context.InboundRequestCanceled)
            {
                sin_orig = sin = Stream.Null;
            }
            else
            {
                sin_orig = sin = resp.GetResponseStream();
                if (string.IsNullOrEmpty(resp.ContentEncoding))
                {
                    context.ResponseEntityCompressed = false;
                }
                else
                {
                    if (sec.Decompress)
                    {
                        context.ResponseEntityCompressed = false;
                        switch (resp.ContentEncoding)
                        {
                            case "gzip":
                                sin = new GZipStream(sin, CompressionMode.Decompress);
                                context.Response.Headers["Content-Encoding"] = "";
                                break;
                            case "deflate":
                                sin = new DeflateStream(sin, CompressionMode.Decompress);
                                context.Response.Headers["Content-Encoding"] = "";
                                break;
                            default://unknown compress method
                                context.ResponseEntityCompressed = true;
                                break;
                        }
                    }
                    else
                    {
                        context.ResponseEntityCompressed = true;
                    }
                }
            }
            sin_orig = context.InboundRequestCanceled ? Stream.Null : resp.GetResponseStream();
            sin = CallFilterResponseIn(context, sin);
            sout_orig = context.Response.OutputStream;
            sout = CallFilterResponseOut(context, sout_orig);
            //must check resp!=null here, otherwise InboundRequestCanceled may cause NullReference when extension doesn't provide sin
            if (sin_orig == sin && sout_orig == sout && resp != null && resp.ContentLength >= 0)
            {
                context.Response.ContentLength64 = resp.ContentLength;
                sin.CopyTo(sout, resp.ContentLength);
            }
            else
            {
                sin.CopyTo(sout);
            }
            try { sin.Close(); }
            catch { }
            try { sout.Close(); }
            catch { }
            //when listener.IgnoreWriteExceptions==true,
            //CopyTo is still running (and downloading from inbound server) when client disconnects.
            //  download any VLC channel on http://video6.sjtu.edu.cn/vlc/ ,
            //  VLC channels are infinite, and downloading never ends!
            //we should let listener.IgnoreWriteExceptions==false,
            //so HttpListenerException is thrown on disconnect, and catched in CopyTo
        }
    }
    /// <summary>
    /// provides a context to HttpProxy and IHttpProxyExtension
    /// </summary>
    public class HttpProxyContext
    {
        public HttpWorkerEventArgs e;
        public RequestListener listener { get { return worker.listener; } }
        public HttpWorker worker { get { return e.worker; } }
        public Uri Url { get { return e.Url; } }
        public HttpListenerRequest Request { get { return e.Request; } }
        public HttpListenerResponse Response { get { return e.Response; } }
        public HttpWebRequest req;
        public HttpWebResponse resp;
        public bool InboundRequestCanceled;
        public bool InboundRequestStarted;
        public bool ResponseEntityCompressed;
        public bool CollectedServerIP;
    }
    /// <summary>
    /// HttpProxy element
    /// </summary>
    public class HttpProxyConfigurationSection : PluginConfigurationSectionBase
    {
        /// <summary>
        /// local endpoints to serve
        /// </summary>
        [ConfigurationProperty("EndPoints")]
        public ListenerEndPointCollection EndPoints
        {
            get { return (ListenerEndPointCollection)this["EndPoints"]; }
        }
        /// <summary>
        /// timeout for inbound requests
        /// </summary>
        [ConfigurationProperty("Timeout")]
        public int Timeout
        {
            get { return (int)this["Timeout"]; }
        }
        /// <summary>
        /// whether to add X-Forwarded-For header in inbound requests
        /// </summary>
        [ConfigurationProperty("addXForwardedFor")]
        public bool addXForwardedFor
        {
            get { return (bool)this["addXForwardedFor"]; }
        }
        /// <summary>
        /// whether to decompress response entities
        /// </summary>
        /// <remarks>if set to true, response entities will be decompressed, and all response filters will see decompressed stream</remarks>
        [ConfigurationProperty("Decompress")]
        public bool Decompress
        {
            get { return (bool)this["Decompress"]; }
        }
        /// <summary>
        /// choose a proxy for inbound requests
        /// </summary>
        [ConfigurationProperty("InboundGateway")]
        public HttpProxyInboundGatewayConfigurationElement InboundGateway
        {
            get { return (HttpProxyInboundGatewayConfigurationElement)this["InboundGateway"]; }
        }
        /// <summary>
        /// whether to deny request from localhost
        /// </summary>
        /// <remarks>if set to false, request from localhost is allowed; visiting http://proxy-ip:proxy-port/ may cause loop until timeout</remarks>
        [ConfigurationProperty("DenyLocal")]
        public bool DenyLocal
        {
            get { return (bool)this["DenyLocal"]; }
        }
        /// <summary>
        /// gets an IWebProxy for use as the inbound gateway
        /// </summary>
        public IWebProxy GetInboundGateway()
        {
            HttpProxyInboundGatewayConfigurationElement c = InboundGateway;
            if (c == null) return null;
            return c.ToProxy();
        }
    }
}
