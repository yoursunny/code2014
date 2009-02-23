using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;
using System.Net;

namespace yoursunny.P2008.hProxyN
{
    public partial class HttpProxy : IPlugin
    {
        private void InitCollectServerEndPoint()
        {
            AnyIPEndPoint4 = new IPEndPoint(IPAddress.Any, 0);
            AnyIPEndPoint6 = new IPEndPoint(IPAddress.IPv6Any, 0);
            CollectServerIPcache = new Hashtable();
            CollectServerIPcacheLastSweep = DateTime.Now;
        }
        IPEndPoint AnyIPEndPoint4;
        IPEndPoint AnyIPEndPoint6;
        Hashtable CollectServerIPcache;
        DateTime CollectServerIPcacheLastSweep;
        class CollectServerIPcacheEntry
        {
            public CollectServerIPcacheEntry(IPAddress address)
            {
                this.address = address;
                since = DateTime.Now;
            }
            public IPAddress address;
            public DateTime since;
        }
        private void CollectServerEndPoint1(HttpProxyContext context)
        {
            context.req.ServicePoint.BindIPEndPointDelegate = (BindIPEndPoint)delegate(ServicePoint servicePoint, IPEndPoint remoteEndPoint, int retryCount)
            {
                context.e.log.server_ep = remoteEndPoint;
                CollectServerIPcache[servicePoint.GetHashCode()] = new CollectServerIPcacheEntry(remoteEndPoint.Address);
                context.CollectedServerIP = true;
                return (remoteEndPoint.AddressFamily == System.Net.Sockets.AddressFamily.InterNetworkV6) ? AnyIPEndPoint6 : AnyIPEndPoint4;
            };
        }
        private void CollectServerEndPoint2(HttpProxyContext context)
        {
            if (!context.CollectedServerIP)
            {
                CollectServerIPcacheEntry entry = CollectServerIPcache[context.req.ServicePoint.GetHashCode()] as CollectServerIPcacheEntry;
                if (entry != null)
                {
                    context.e.log.server_ep = new IPEndPoint(entry.address, context.Url.Port);
                }
            }
            DateTime now = DateTime.Now;
            //sweep old entries every 600 seconds
            if ((now - CollectServerIPcacheLastSweep).TotalSeconds > 600)
            {
                lock (CollectServerIPcache)
                {
                    DateTime keep = now.AddMilliseconds(-ServicePointManager.MaxServicePointIdleTime);
                    Hashtable c = new Hashtable();
                    foreach (DictionaryEntry p in CollectServerIPcache)
                    {
                        CollectServerIPcacheEntry entry = p.Value as CollectServerIPcacheEntry;
                        if (entry.since >= keep) c[p.Key] = p.Value;
                    }
                    CollectServerIPcacheLastSweep = now;
                    CollectServerIPcache = c;
                }
            }
        }
    }
}
