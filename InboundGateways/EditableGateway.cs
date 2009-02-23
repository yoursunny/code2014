using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using System.Collections;
using System.Net;
using System.Web;

namespace yoursunny.P2008.hProxyN
{
    [Plugin("EditableGateway", "EditableGateway", "yoursunny.P2008.hProxyN.EmptyPluginConfigurationSection")]
    [DependOnPlugin("yoursunny.P2008.hProxyN.HttpProxy")]
    // This class implements both IPlugin and IInboundGateway
    // There will be two instances of this class:
    //   instanceA as IPlugin, serves update requests
    //   instanceB as IInboundGateway, provides IP address to HttpProxy
    public class EditableGateway : IPlugin, IInboundGateway
    {
        /// <summary>
        /// stores host->IP
        /// </summary>
        /// <remarks>
        /// instanceA/B can't access each other, CallPluginMethod is not usable by instanceB
        /// I set this member static, so you can't load this plugin twice
        /// </remarks>
        static Hashtable Resolve;
        /// <summary>
        /// constructor for instanceA
        /// </summary>
        public EditableGateway(PluginConfigurationSectionBase sec)
        {
            Resolve = new Hashtable();
        }
        public void AddHooks(RequestListener listener)
        {
            listener.Prepare += new EventHandler<HttpWorkerEventArgs>(Prepare);
            listener.Handler += new EventHandler<HttpWorkerEventArgs>(Handler);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.Prepare -= new EventHandler<HttpWorkerEventArgs>(Prepare);
            listener.Handler -= new EventHandler<HttpWorkerEventArgs>(Handler);
        }
        void Prepare(object sender, HttpWorkerEventArgs e)
        {
            if (e.Url.AbsolutePath.StartsWith("/_hProxyN_/233C731D-1EA5-4c1b-9FD9-4D70F8DF82C6/update.cgi"))
            {
                RequestListener listener = sender as RequestListener;
                listener.CallPluginMethod("yoursunny.P2008.hProxyN.HttpProxy", "IgnoreRequest", new object[] { e });
            }
        }
        void Handler(object sender, HttpWorkerEventArgs e)
        {
            if (e.Url.AbsolutePath.StartsWith("/_hProxyN_/233C731D-1EA5-4c1b-9FD9-4D70F8DF82C6/update.cgi"))
            {
                NameValueCollection q = HttpUtility.ParseQueryString(e.Request.Url.Query);
                string host = q["h"];
                string IP = q["a"];
                IPAddress address;
                if (!string.IsNullOrEmpty(host) && IP != null && IPAddress.TryParse(IP, out address))
                {
                    Resolve[host] = address.ToString();
                    e.Response.StatusCode = 200;
                    e.Response.OutputStream.Write("EditableGateway update OK");
                    e.Finish();
                }
                else
                {
                    e.Decline(403, "EditableGateway update failed");
                }
            }
        }
        /// <summary>
        /// constructor for instanceB
        /// </summary>
        public EditableGateway(NameValueCollection param)
        {
        }
        public bool UseDirectRequestLine
        {
            get { return true; }
        }
        public System.Net.ICredentials Credentials
        {
            get { return null; }
            set { }
        }
        public Uri GetProxy(Uri destination)
        {
            string host = destination.DnsSafeHost;
            string IP = Resolve[host] as string;
            if (IP == null)
            {
                return null;
            }
            return new Uri("http://" + IP + ":" + destination.Port.ToString());
        }
        public bool IsBypassed(Uri host)
        {
            return false;
        }
    }
}
