using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using System.Net;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// a InboundGateway that resolves the hostname against a specified DNS server
    /// </summary>
    public class DnsGateway : IInboundGateway
    {
        Heijden.DNS.Resolver resolver;
        //Random random;
        public DnsGateway(NameValueCollection param)
        {
            resolver = new Heijden.DNS.Resolver(param["dns"]);
            resolver.UseCache = true;
            //random = new Random();
            /* random choosing doesn't have good performance:
             * If a host name is resolved to 10 IPs, we may have to create multiple connections.
             * Creating connection to the same IP and pipelining requests is better.
             */
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
            IPAddress IP;
            if (IPAddress.TryParse(host, out IP)) return null;
            IPAddress[] IPs;
            try { IPs = resolver.GetHostAddresses(destination.DnsSafeHost); }
            catch { return null; }
            if (IPs == null || IPs.Length < 1) return null;
            //IP = IPs.Length > 1 ? IPs[random.Next(IPs.Length)] : IPs[0];
            IP = IPs[0];
            return new Uri("http://" + IP.ToString() + ":" + destination.Port.ToString());
        }
        public bool IsBypassed(Uri host)
        {
            return false;
        }
    }
}
