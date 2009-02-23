using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Collections.Specialized;
using System.Configuration;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// specify additional information for inbound gateway
    /// </summary>
    public interface IInboundGateway : IWebProxy
    {
        /// <summary>
        /// returns whether to use "direct" request line:
        /// when true, request line will look like GET /start.htm HTTP/1.1
        /// when false, request line will look like GET http://any.host/start.htm HTTP/1.1
        /// </summary>
        /// <remarks>
        /// you can return a Uri representing the server you want in GetProxy and return true here,
        /// so that you can send request to any server without making DNS changes
        /// </remarks>
        bool UseDirectRequestLine { get; }
    }
    /// <summary>
    /// InboundGateway element
    /// </summary>
    public class HttpProxyInboundGatewayConfigurationElement : ConfigurationElement
    {
        /// <summary>
        /// fully-qualified type name of a class implementing IWebProxy
        /// </summary>
        [ConfigurationProperty("type")]
        public string type
        {
            get { return (string)this["type"]; }
        }
        /// <summary>
        /// params to pass to 'type' class
        /// </summary>
        [ConfigurationProperty("param")]
        public KeyValueConfigurationCollection param
        {
            get { return (KeyValueConfigurationCollection)this["param"]; }
        }
        /// <summary>
        /// gets an IWebProxy
        /// </summary>
        public IWebProxy ToProxy()
        {
            Type t = Type.GetType(type);
            if (t == null) return null;
            System.Reflection.ConstructorInfo ctor = t.GetConstructor(new Type[] { typeof(NameValueCollection) });
            IWebProxy g = (IWebProxy)ctor.Invoke(new object[] { param.ToNameValueCollection() });
            return g;
        }
    }
    /// <summary>
    /// provides a fixed gateway
    /// </summary>
    public class FixedGateway : WebProxy
    {
        public FixedGateway(NameValueCollection param)
        {
            this.Address = new Uri("http://" + param["host"] + ":" + param["port"]);
            this.Credentials = new NetworkCredential(param["username"], param["password"]);
        }
    }
}
