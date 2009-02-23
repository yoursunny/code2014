using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Net;
using System.Text.RegularExpressions;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// WebHosting element
    /// </summary>
    public class WebHostingConfigurationSection : PluginConfigurationSectionBase
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
        /// virtual hosts
        /// </summary>
        [ConfigurationProperty("VHosts")]
        public VHostCollection VHosts
        {
            get { return (VHostCollection)this["VHosts"]; }
        }
        /// <summary>
        /// find a handler for a request
        /// </summary>
        public void FindHandler(IPEndPoint ep, string hostname, string path, out string handler, out string file, out string param)
        {
            handler = null; file = null; param = null;
            VHostElement vh = VHosts.FindVHost(ep, hostname);
            if (vh == null) return;
            var q = from VDirElement vd in vh.VDirs where vd.VPath.IsMatch(path) select vd;
            if (q.Count() > 0)
            {
                VDirElement vd = q.First();
                Match m = q.First().VPath.Match(path);
                handler = vd.handler;
                file = m.Result(vd.file);
                param = m.Result(vd.param);
            }
        }
    }
    /// <summary>
    /// VDir element
    /// </summary>
    public class VDirElement : ConfigurationElement
    {
        /// <summary>
        /// regex to match the path
        /// </summary>
        [ConfigurationProperty("vpath")]
        public string vpath
        {
            get { return (string)this["vpath"]; }
        }
        /// <summary>
        /// handler name
        /// </summary>
        [ConfigurationProperty("handler")]
        public string handler
        {
            get { return (string)this["handler"]; }
        }
        /// <summary>
        /// template to get filename from vpath
        /// </summary>
        [ConfigurationProperty("file")]
        public string file
        {
            get { return (string)this["file"]; }
        }
        /// <summary>
        /// param passed to handler
        /// </summary>
        [ConfigurationProperty("param")]
        public string param
        {
            get { return (string)this["param"]; }
        }
        private Regex _VPath;
        /// <summary>
        /// get a regex for vpath
        /// </summary>
        public Regex VPath
        {
            get
            {
                if (_VPath == null) _VPath = new Regex("^" + vpath + "$", RegexOptions.Compiled | RegexOptions.ECMAScript);
                return _VPath;
            }
        }
    }
    /// <summary>
    /// VDirs element
    /// </summary>
    public class VDirCollection : ConfigurationElementCollection
    {
        public override ConfigurationElementCollectionType CollectionType
        {
            get { return ConfigurationElementCollectionType.BasicMap; }
        }
        protected override string ElementName
        {
            get { return "VDir"; }
        }
        protected override ConfigurationElement CreateNewElement()
        {
            return new VDirElement();
        }
        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((VDirElement)element).vpath;
        }
        public VDirElement this[int index]
        {
            get { return (VDirElement)BaseGet(index); }
        }
        /// <summary>
        /// find a VDirElement matches the path
        /// </summary>
        /// <returns>null if not found</returns>
        public VDirElement FindVDir(string path)
        {
            var q = from VDirElement vd in this where vd.VPath.IsMatch(path) select vd;
            return q.Count() > 0 ? q.First() : null;
        }
    }
    /// <summary>
    /// VHost element
    /// </summary>
    public class VHostElement : ConfigurationElement
    {
        /// <summary>
        /// local IPAddress to serve
        /// </summary>
        [ConfigurationProperty("IP")]
        public string IP
        {
            get { return (string)this["IP"]; }
        }
        /// <summary>
        /// local port number to serve
        /// </summary>
        [ConfigurationProperty("port")]
        public int port
        {
            get { return (int)this["port"]; }
        }
        /// <summary>
        /// local endpoint to serve
        /// </summary>
        public IPEndPoint EndPoint
        {
            get { return new IPEndPoint(IPAddress.Parse(IP), port); }
        }
        /// <summary>
        /// regex of hostnames to serve
        /// </summary>
        [ConfigurationProperty("hostname")]
        public string hostname
        {
            get { return (string)this["hostname"]; }
        }
        private Regex _Host;
        /// <summary>
        /// gets a regex for hostname
        /// </summary>
        public Regex Host
        {
            get
            {
                if (_Host == null) _Host = new Regex("^" + hostname + "$", RegexOptions.Compiled | RegexOptions.ECMAScript);
                return _Host;
            }
        }
        /// <summary>
        /// VDirElements
        /// </summary>
        [ConfigurationProperty("VDirs")]
        public VDirCollection VDirs
        {
            get { return (VDirCollection)this["VDirs"]; }
        }
    }
    /// <summary>
    /// VHosts element
    /// </summary>
    public class VHostCollection : ConfigurationElementCollection
    {
        public override ConfigurationElementCollectionType CollectionType
        {
            get { return ConfigurationElementCollectionType.BasicMap; }
        }
        protected override string ElementName
        {
            get { return "VHost"; }
        }
        protected override ConfigurationElement CreateNewElement()
        {
            return new VHostElement();
        }
        protected override object GetElementKey(ConfigurationElement element)
        {
            VHostElement ele = (VHostElement)element;
            return ele.EndPoint.ToString() + " " + ele.hostname;
        }
        public VHostElement this[int index]
        {
            get { return (VHostElement)BaseGet(index); }
        }
        /// <summary>
        /// find a VHost serving this endpoint and hostname
        /// </summary>
        /// <returns>null if not found</returns>
        public VHostElement FindVHost(IPEndPoint ep, string hostname)
        {
            var q = from VHostElement vh in this where vh.EndPoint.Equals(ep) && vh.Host.IsMatch(hostname) select vh;
            return q.Count() > 0 ? q.First() : null;
        }
    }
}
