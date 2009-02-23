using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Net;
using System.IO;
using System.Web;
using System.Collections.Specialized;
using System.IO.Compression;

/* GAppProxy support for hProxyN
 * 2009-02-23
 * 
 * [-- GAppProxy fetchServer protocol --]
 * 
 * 
 * [Request]
 * 
 * POST /fetch.py HTTP/1.1
 * Host: appid.appspot.com
 * 
 * method=HTTP_METHOD&path=FULL_URL&headers=HEADERS&encodeResponse=compress&postData=POST_BODY&version=r68
 * 
 * 
 * [Response Body]
 * 
 * STATUS_LINE
 * HEADER_NAME: HEADER_VALUE
 * HEADER_NAME: HEADER_VALUE
 * 
 * GZIPPED_ENTITY (if text/*) or ENTITY (if not text/*)
 * 
 */

namespace yoursunny.P2008.hProxyN
{
    [Plugin("GAppProxy", "GAppProxy", "yoursunny.P2008.hProxyN.GAppProxyConfigurationSection")]
    [DependOnPlugin("yoursunny.P2008.hProxyN.HttpProxy")]
    public class GAppProxy : HttpProxyExtension, IPlugin
    {
        Guid PluginStorage_TakeIt;
        Guid PluginStorage_POSTdata;
        Guid PluginStorage_Response;
        Guid PluginStorage_ResponseEntity;
        GAppProxyConfigurationSection sec;
        Uri fetchServer;
        long[] skipIP;
        Heijden.DNS.Resolver DNS;
        public GAppProxy(PluginConfigurationSectionBase sec)
        {
            PluginStorage_TakeIt = new Guid("{F23FB7B2-F964-4556-978C-4AE6F360AC1D}");
            PluginStorage_POSTdata = new Guid("{57A74D0A-3F16-4508-BE60-427130C5BCB7}");
            PluginStorage_Response = new Guid("{2B59469A-9075-4c73-BF37-68A3C99126AF}");
            PluginStorage_ResponseEntity = new Guid("{32AB908F-25B3-43da-89AD-6FC96283D9C5}");
            this.sec = (GAppProxyConfigurationSection)sec;
            ChooseFetchServer();
            LoadSkipIP();
        }
        public void AddHooks(RequestListener listener)
        {
            listener.ListenerStart += new EventHandler<RequestListenerEventArgs>(RegisterExtension);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.ListenerStart -= new EventHandler<RequestListenerEventArgs>(RegisterExtension);
        }
        void ChooseFetchServer()
        {
            if (string.IsNullOrEmpty(sec.loadBalancer))
            {
                fetchServer = new Uri(sec.fetchServer);
            }
            else
            {
                fetchServer = new Uri(new WebClient().DownloadString(sec.loadBalancer));
            }
        }
        void LoadSkipIP()
        {
            if (string.IsNullOrEmpty(sec.skipIP)) return;
            List<long> a = new List<long>();
            StreamReader r = File.OpenText(sec.skipIP);
            string l;
            while (null != (l = r.ReadLine()))
            {
                string[] s = l.Split(',');
                if (s.Length != 2) continue;
                a.Add(long.Parse(s[0]));
                a.Add(long.Parse(s[1]));
            }
            skipIP = a.ToArray();
            DNS = new Heijden.DNS.Resolver(sec.DNS);
        }
        /// <summary>
        /// check whether the URL is fetchable by fetchServer and not in skipIP
        /// </summary>
        bool CheckRequest(HttpProxyContext context)
        {
            if (context.Url.Scheme != "http" || context.Url.Port != 80) return false;
            if (context.Request.HttpMethod != "GET" && context.Request.HttpMethod != "HEAD" && context.Request.HttpMethod != "POST") return false;
            if (skipIP == null) return true;
            IPHostEntry ihe = DNS.Resolve(context.Url.DnsSafeHost);
            IPAddress a = null;
            foreach (IPAddress addr in ihe.AddressList)
            {
                if (addr.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                {
                    a = addr;
                    break;
                }
            }
            if (a == null) return true;
            byte[] b = a.GetAddressBytes();
            long ip = (((Convert.ToInt64(b[0]) * 256 + b[1]) * 256) + b[2]) * 256 + b[3];
            for (int i = 1, len = skipIP.Length; i < len; i += 2)
            {
                if (skipIP[i - 1] <= ip && ip <= skipIP[i]) return false;
            }
            return true;
        }
        public override void BeforeRequest(HttpProxyContext context)
        {
            if (CheckRequest(context))
            {
                context.e.StoreData(PluginStorage_TakeIt, true);
                context.listener.CallPluginMethod("yoursunny.P2008.hProxyN.HttpProxy", "CancelInboundRequest", new object[] { context });
            }
        }
        public override Stream FilterRequestIn(HttpProxyContext context, Stream s)
        {
            if (context.e.RetrieveData(PluginStorage_TakeIt) == null) return s;
            MemoryStream ms = new MemoryStream();
            s.CopyTo(ms);
            context.e.StoreData(PluginStorage_POSTdata, ms.ToArray());
            return Stream.Null;
        }
        public override void AfterRequest(HttpProxyContext context)
        {
            if (context.e.RetrieveData(PluginStorage_TakeIt) == null) return;
            NameValueCollection Headers = context.Request.Headers;
            StringBuilder headers = new StringBuilder();
            for (int j = 0; j < Headers.Count; ++j)
            {
                string key = Headers.GetKey(j);
                string[] values = Headers.GetValues(j);
                foreach (string value in values)
                {
                    headers.AppendLine(key + ": " + value);
                }
            }
            StringBuilder payload = new StringBuilder();
            payload.Append("method=");
            payload.Append(context.Request.HttpMethod);
            payload.Append("&path=");
            payload.Append(HttpUtility.UrlEncode(context.Url.ToString()));
            payload.Append("&headers=");
            payload.Append(HttpUtility.UrlEncode(headers.ToString()));
            payload.Append("&encodeResponse=");
            payload.Append("&version=r68");
            payload.Append("&postdata=");
            byte[] body1 = Encoding.UTF8.GetBytes(payload.ToString());
            byte[] body2o = context.e.RetrieveData(PluginStorage_POSTdata) as byte[];
            byte[] body2 = body2o == null ? new byte[0] : HttpUtility.UrlEncodeToBytes(HttpUtility.UrlDecodeToBytes(body2o));
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(fetchServer);
            req.Method = WebRequestMethods.Http.Post;
            req.UserAgent = "hProxyN-GAppProxy";
            req.ContentLength = body1.Length + body2.Length;
            Stream reqs = req.GetRequestStream();
            reqs.Write(body1, 0, body1.Length);
            reqs.Write(body2, 0, body2.Length);
            HttpWebResponse resp;
            try { resp = (HttpWebResponse)req.GetResponse(); }
            catch (WebException) { return; }
            context.e.StoreData(PluginStorage_Response, resp);
        }
        public override void BeforeResponse(HttpProxyContext context)
        {
            HttpWebResponse resp = context.e.RetrieveData(PluginStorage_Response) as HttpWebResponse;
            if (resp == null) return;
            Stream gs = resp.GetResponseStream();
            StringBuilder b = new StringBuilder();
            while (true)
            {
                int chi = gs.ReadByte();
                if (chi < 0) break;
                char ch = Convert.ToChar(chi);
                b.Append(ch);
                if (ch == '\n')
                {
                    string l = b.ToString().TrimEnd('\r', '\n');
                    if (l.Length <= 2) break;
                    b = new StringBuilder();
                    string[] la;
                    if (l.StartsWith("HTTP"))
                    {
                        la = l.Split(new char[] { ' ' }, 3);
                        if (la.Length < 3) continue;
                        context.Response.StatusCode = int.Parse(la[1]);
                        context.Response.StatusDescription = la[2];
                        continue;
                    }
                    la = l.Split(new char[] { ':' }, 2);
                    if (la.Length < 2) continue;
                    string key = la[0];
                    string value = la[1].TrimStart(' ');
                    switch (key.ToLower())
                    {
                        case "content-length":
                        case "keep-alive":
                        case "transfer-encoding":
                        case "www-authenticate":
                        case "content-encoding":
                        case "last-modified":
                        case "server":
                            break;
                        case "content-type":
                            context.Response.ContentType = value;
                            break;
                        default:
                            try { context.Response.AppendHeader(key, value); }
                            catch (ArgumentException) { }
                            break;
                    }
                }
            }
            context.e.StoreData(PluginStorage_ResponseEntity, gs);
        }
        public override Stream FilterResponseIn(HttpProxyContext context, Stream s)
        {
            Stream gs = context.e.RetrieveData(PluginStorage_ResponseEntity) as Stream;
            if (gs == null) return s;
            return gs;
        }
    }
    /// <summary>
    /// GAppProxy element
    /// </summary>
    public class GAppProxyConfigurationSection : PluginConfigurationSectionBase
    {
        /// <summary>
        /// LOAD BALANCE url
        /// </summary>
        [ConfigurationProperty("loadBalancer")]
        public string loadBalancer
        {
            get { return (string)this["loadBalancer"]; }
        }
        /// <summary>
        /// FETCH SERVER url, used when LOAD BALANCE is not specified
        /// </summary>
        [ConfigurationProperty("fetchServer")]
        public string fetchServer
        {
            get { return (string)this["fetchServer"]; }
        }
        /// <summary>
        /// skip IP list file, IPAddress in this file will not pass through GAppProxy.
        /// File Format: start_ip_as_long,stop_ip_as_long
        /// </summary>
        [ConfigurationProperty("skipIP")]
        public string skipIP
        {
            get { return (string)this["skipIP"]; }
        }
        /// <summary>
        /// DNS Server IP to resolve hostnames, used by skip IP
        /// </summary>
        [ConfigurationProperty("DNS")]
        public string DNS
        {
            get { return (string)this["DNS"]; }
        }
    }
}
