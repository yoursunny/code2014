using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// Application element
    /// </summary>
    public class AspNetApplicationElement : ConfigurationElement
    {
        /// <summary>
        /// hostname
        /// </summary>
        [ConfigurationProperty("hostname")]
        public string hostname
        {
            get { return (string)this["hostname"]; }
        }
        /// <summary>
        /// TCP port
        /// </summary>
        [ConfigurationProperty("port")]
        public int port
        {
            get { return (int)this["port"]; }
        }
        /// <summary>
        /// virtual path
        /// </summary>
        [ConfigurationProperty("vpath")]
        public string vpath
        {
            get { return (string)this["vpath"]; }
        }
        /// <summary>
        /// physical path
        /// </summary>
        [ConfigurationProperty("path")]
        public string path
        {
            get { return (string)this["path"]; }
        }
    }
    /// <summary>
    /// Applications element
    /// </summary>
    public class AspNetApplicationCollection : ConfigurationElementCollection
    {
        public override ConfigurationElementCollectionType CollectionType
        {
            get { return ConfigurationElementCollectionType.BasicMap; }
        }
        protected override string ElementName
        {
            get { return "Application"; }
        }
        protected override ConfigurationElement CreateNewElement()
        {
            return new AspNetApplicationElement();
        }
        protected override object GetElementKey(ConfigurationElement element)
        {
            AspNetApplicationElement e = (AspNetApplicationElement)element;
            return e.hostname + ":" + e.port.ToString() + e.vpath;
        }
        public AspNetApplicationElement this[int index]
        {
            get { return (AspNetApplicationElement)BaseGet(index); }
        }
        /// <summary>
        /// find a AspNetApplicationElement matches the uri
        /// </summary>
        /// <returns>null if not found</returns>
        public AspNetApplicationElement FindApplication(Uri u)
        {
            var q = from AspNetApplicationElement app in this where app.hostname == u.Host && app.port == u.Port && u.AbsolutePath.StartsWith(app.vpath) orderby app.vpath.Length descending select app;
            return q.Count() > 0 ? q.First() : null;
        }
    }
    /// <summary>
    /// AspNet element
    /// </summary>
    public class AspNetConfigurationSection : PluginConfigurationSectionBase
    {
        [ConfigurationProperty("Applications")]
        public AspNetApplicationCollection Applications
        {
            get { return (AspNetApplicationCollection)this["Applications"]; }
        }
    }
}
