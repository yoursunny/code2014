using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// Logging element
    /// </summary>
    public class LoggingConfigurationSection : ConfigurationSection
    {
        /// <summary>
        /// this logging enabled
        /// </summary>
        [ConfigurationProperty("enabled")]
        public bool enabled
        {
            get { return (bool)this["enabled"]; }
        }
        /// <summary>
        /// log output
        /// </summary>
        [ConfigurationProperty("Output")]
        public LoggingOutputElement Output
        {
            get { return (LoggingOutputElement)this["Output"]; }
        }
        /// <summary>
        /// log format
        /// </summary>
        [ConfigurationProperty("Format")]
        public LoggingFormatElement Format
        {
            get { return (LoggingFormatElement)this["Format"]; }
        }
        /// <summary>
        /// log fields
        /// </summary>
        [ConfigurationProperty("Fields")]
        public LoggingFieldCollection Fields
        {
            get { return (LoggingFieldCollection)this["Fields"]; }
        }
    }
    /// <summary>
    /// Output element
    /// </summary>
    public class LoggingOutputElement : ConfigurationElement
    {
        /// <summary>
        /// path for log files; or 'STDOUT' for standard output
        /// </summary>
        [ConfigurationProperty("path")]
        public string path
        {
            get { return (string)this["path"]; }
        }
        /// <summary>
        /// prefix in filename
        /// </summary>
        [ConfigurationProperty("prefix")]
        public string prefix
        {
            get { return (string)this["prefix"]; }
        }
        /// <summary>
        /// pattern in filename, this is passed to DateTime.ToString
        /// </summary>
        [ConfigurationProperty("pattern")]
        public string pattern
        {
            get { return (string)this["pattern"]; }
        }
        /// <summary>
        /// postfix in filename
        /// </summary>
        [ConfigurationProperty("postfix")]
        public string postfix
        {
            get { return (string)this["postfix"]; }
        }
        /// <summary>
        /// whether rollover using UTC time
        /// </summary>
        [ConfigurationProperty("utc")]
        public bool utc
        {
            get { return (bool)this["utc"]; }
        }
    }
    /// <summary>
    /// Format element
    /// </summary>
    public class LoggingFormatElement : ConfigurationElement
    {
        /// <summary>
        /// fully-qualified type name of a class inherited from LogFormatBase
        /// </summary>
        [ConfigurationProperty("type")]
        public string type
        {
            get { return (string)this["type"]; }
        }
        /// <summary>
        /// encoding of log files, this is passed to Encoding.GetEncoding
        /// </summary>
        [ConfigurationProperty("encoding")]
        public string encoding
        {
            get { return (string)this["encoding"]; }
        }
    }
    /// <summary>
    /// field element
    /// </summary>
    public class LoggingFieldElement : ConfigurationElement
    {
        /// <summary>
        /// field name, specific to the selected log format
        /// </summary>
        [ConfigurationProperty("name")]
        public string name
        {
            get { return (string)this["name"]; }
        }
    }
    /// <summary>
    /// Fields element
    /// </summary>
    public class LoggingFieldCollection : ConfigurationElementCollection
    {
        public override ConfigurationElementCollectionType CollectionType
        {
            get { return ConfigurationElementCollectionType.BasicMap; }
        }
        protected override string ElementName
        {
            get { return "field"; }
        }
        protected override ConfigurationElement CreateNewElement()
        {
            return new LoggingFieldElement();
        }
        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((LoggingFieldElement)element).name;
        }
        public LoggingFieldElement this[int index]
        {
            get { return (LoggingFieldElement)BaseGet(index); }
        }
    }
}
