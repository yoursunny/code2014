using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Xml;
using System.Xml.Linq;
using System.Net;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// Listener element
    /// </summary>
    public class ListenerConfigurationSection : ConfigurationSection
    {
        /// <summary>
        /// IPEndPoint(s) to listen
        /// </summary>
        [ConfigurationProperty("EndPoints")]
        public ListenerEndPointCollection EndPoints
        {
            get { return (ListenerEndPointCollection)this["EndPoints"]; }
        }
        /// <summary>
        /// running mode: console,service
        /// </summary>
        [ConfigurationProperty("mode")]
        public string mode
        {
            get { return (string)this["mode"]; }
        }
    }
    /// <summary>
    /// listen element
    /// </summary>
    public class ListenerEndPointElement : ConfigurationElement
    {
        /// <summary>
        /// IPAddress to listen
        /// </summary>
        [ConfigurationProperty("IP")]
        //[IPAddressConfigurationValidator()]
        public string IP
        {
            get { return (string)this["IP"]; }
        }
        /// <summary>
        /// port number to listen
        /// </summary>
        [ConfigurationProperty("port")]
        //[IntegerValidator(MinValue = 1, MaxValue = 65535)]
        public int port
        {
            get { return (int)this["port"]; }
        }
        /// <summary>
        /// gets the IPEndPoint of {IP,port}
        /// </summary>
        public IPEndPoint EndPoint
        {
            get
            {
                IPAddress ip;
                if (IPAddress.TryParse(IP, out ip)) return new IPEndPoint(ip, port);
                else
                {
                    if (IP == "any") return new IPEndPoint(IPAddress.Any, port);
                    else return null;
                }
            }
        }
    }
    /// <summary>
    /// EndPoints element
    /// </summary>
    public class ListenerEndPointCollection : ConfigurationElementCollection
    {
        public override ConfigurationElementCollectionType CollectionType
        {
            get { return ConfigurationElementCollectionType.BasicMap; }
        }
        protected override string ElementName
        {
            get { return "listen"; }
        }
        protected override ConfigurationElement CreateNewElement()
        {
            return new ListenerEndPointElement();
        }
        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((ListenerEndPointElement)element).EndPoint;
        }
        public ListenerEndPointElement this[int index]
        {
            get { return (ListenerEndPointElement)BaseGet(index); }
        }
        /// <summary>
        /// determines whether listening to (serving) this endpoint
        /// </summary>
        public bool ListeningTo(IPEndPoint ep)
        {
            foreach (ListenerEndPointElement ele in this)
            {
                //note: IPEndPoint.Equals is different from '=='
                IPEndPoint p = ele.EndPoint;
                if (p.Equals(ep) || (p.Address == IPAddress.Any && p.Port == ep.Port)) return true;
            }
            return false;
        }
    }
}
