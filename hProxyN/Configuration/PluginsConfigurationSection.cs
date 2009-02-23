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
    /// Plugins element
    /// </summary>
    public class PluginsConfigurationSection : ConfigurationSection
    {
        /// <summary>
        /// plugins to load
        /// </summary>
        [ConfigurationProperty("PluginCollection")]
        public PluginConfigurationCollection PluginCollection
        {
            get { return (PluginConfigurationCollection)this["PluginCollection"]; }
        }
    }
    /// <summary>
    /// plugin element
    /// </summary>
    public class PluginElement : ConfigurationElement
    {
        /// <summary>
        /// fully-qualified type name of a class implementing IPlugin
        /// </summary>
        [ConfigurationProperty("type")]
        public string type
        {
            get { return (string)this["type"]; }
        }
    }
    /// <summary>
    /// PluginCollection element
    /// </summary>
    public class PluginConfigurationCollection : ConfigurationElementCollection
    {
        public override ConfigurationElementCollectionType CollectionType
        {
            get { return ConfigurationElementCollectionType.BasicMap; }
        }
        protected override string ElementName
        {
            get { return "plugin"; }
        }
        protected override ConfigurationElement CreateNewElement()
        {
            return new PluginElement();
        }
        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((PluginElement)element).type;
        }
        public PluginElement this[int index]
        {
            get { return (PluginElement)BaseGet(index); }
        }
    }
    /// <summary>
    /// base class for one plugin's configuration section
    /// </summary>
    public abstract class PluginConfigurationSectionBase : ConfigurationSection { }
    /// <summary>
    /// provides a configuration section for plugins that don't need configuration
    /// </summary>
    public class EmptyPluginConfigurationSection : PluginConfigurationSectionBase { }
}
